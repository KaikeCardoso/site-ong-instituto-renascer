// tools/build.js
// Script de build de produção: minifica JS, CSS e HTML com esbuild e
// html-minifier-terser, gerando uma pasta /dist com a mesma estrutura
// de /html, /css, /js, /imagens, mas com os arquivos otimizados.
// Não há bundling em um único arquivo (cada módulo continua como um
// <script> separado, carregado via tag global, não ES modules) — só
// minificação, já que o projeto não usa import/export em runtime.

const esbuild = require("esbuild");
const { minify: minifyHtml } = require("html-minifier-terser");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

function tamanho(caminho) {
  return fs.statSync(caminho).size;
}

function copiarDiretorio(origem, destino) {
  fs.mkdirSync(destino, { recursive: true });
  for (const item of fs.readdirSync(origem)) {
    const origemItem = path.join(origem, item);
    const destinoItem = path.join(destino, item);
    if (fs.statSync(origemItem).isDirectory()) {
      copiarDiretorio(origemItem, destinoItem);
    } else if (!origemItem.endsWith(".js") && !origemItem.endsWith(".css")) {
      fs.copyFileSync(origemItem, destinoItem);
    }
  }
}

async function build() {
  fs.rmSync(DIST, { recursive: true, force: true });

  // 1) copia estática (imagens e qualquer outro asset não-JS/CSS)
  copiarDiretorio(path.join(ROOT, "imagens"), path.join(DIST, "imagens"));
  fs.mkdirSync(path.join(DIST, "html"), { recursive: true });
  fs.mkdirSync(path.join(DIST, "css"), { recursive: true });
  fs.mkdirSync(path.join(DIST, "js", "modules"), { recursive: true });

  const relatorio = [];

  // 2) minifica cada arquivo JS individualmente (mantém um arquivo por
  //    módulo — só minifica, não faz bundling em um único arquivo)
  const arquivosJs = [
    "js/main.js",
    ...fs.readdirSync(path.join(ROOT, "js/modules")).map((f) => `js/modules/${f}`),
  ];
  for (const rel of arquivosJs) {
    const origem = path.join(ROOT, rel);
    const destino = path.join(DIST, rel);
    const antes = tamanho(origem);
    esbuild.buildSync({
      entryPoints: [origem],
      outfile: destino,
      minify: true,
      target: "es2018",
      legalComments: "none",
    });
    relatorio.push({ arquivo: rel, antes, depois: tamanho(destino) });
  }

  // 3) minifica o CSS
  {
    const origem = path.join(ROOT, "css/style.css");
    const destino = path.join(DIST, "css/style.css");
    const antes = tamanho(origem);
    esbuild.buildSync({
      entryPoints: [origem],
      outfile: destino,
      minify: true,
      loader: { ".css": "css" },
    });
    relatorio.push({ arquivo: "css/style.css", antes, depois: tamanho(destino) });
  }

  // 4) minifica o HTML
  {
    const origem = path.join(ROOT, "html/index.html");
    const destino = path.join(DIST, "html/index.html");
    const antesTexto = fs.readFileSync(origem, "utf8");

    // Desafio encontrado: o html-minifier-terser, com removeComments: true,
    // não removia um dos comentários do arquivo (o que precede <main>),
    // por razão não identificada na lib — os outros 3 comentários eram
    // removidos normalmente. Em vez de depender só da opção da lib,
    // adicionamos uma pré-remoção manual via regex como rede de segurança,
    // garantindo que nenhum comentário vaze pro HTML de produção.
    const semComentarios = antesTexto.replace(/<!--[\s\S]*?-->/g, "");

    const depoisTexto = await minifyHtml(semComentarios, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: false, // o JS interno (se houver) já vem minificado por scripts externos
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
    });
    fs.writeFileSync(destino, depoisTexto);
    relatorio.push({
      arquivo: "html/index.html",
      antes: Buffer.byteLength(antesTexto, "utf8"),
      depois: Buffer.byteLength(depoisTexto, "utf8"),
    });
  }

  // 5) gera um index.html na RAIZ do /dist (sem "../" nos caminhos),
  //    pronto pra ser servido diretamente como root do site em GitHub
  //    Pages/Netlify — plataformas assim servem a pasta publicada como
  //    document root, então o index.html não pode ficar dentro de /html
  {
    const htmlRaiz = fs
      .readFileSync(path.join(DIST, "html/index.html"), "utf8")
      .replace(/\.\.\/css\//g, "css/")
      .replace(/\.\.\/js\//g, "js/")
      .replace(/\.\.\/imagens\//g, "imagens/");
    fs.writeFileSync(path.join(DIST, "index.html"), htmlRaiz);
  }

  // 5b) o templates.js também monta caminhos de imagem (via JS), então
  //     precisa do mesmo ajuste: no site publicado o index.html fica na raiz
  {
    const arq = path.join(DIST, "js/modules/templates.js");
    const js = fs.readFileSync(arq, "utf8").replace(/\.\.\/imagens\//g, "imagens/");
    fs.writeFileSync(arq, js);
  }

  // 6) relatório final
  const totalAntes = relatorio.reduce((s, r) => s + r.antes, 0);
  const totalDepois = relatorio.reduce((s, r) => s + r.depois, 0);

  console.log("\nArquivo".padEnd(34), "Antes".padStart(10), "Depois".padStart(10), "Redução");
  for (const r of relatorio) {
    const reducao = (100 * (1 - r.depois / r.antes)).toFixed(1) + "%";
    console.log(r.arquivo.padEnd(34), String(r.antes).padStart(10), String(r.depois).padStart(10), reducao.padStart(8));
  }
  console.log("-".repeat(70));
  console.log(
    "TOTAL".padEnd(34),
    String(totalAntes).padStart(10),
    String(totalDepois).padStart(10),
    ((100 * (1 - totalDepois / totalAntes)).toFixed(1) + "%").padStart(8)
  );
}

build();
