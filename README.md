# Instituto Renascer — Site institucional (SPA)

Projeto acadêmico da disciplina de Desenvolvimento front-end (plataforma DreamShaper): uma Single Page Application para uma ONG fictícia, o Instituto Renascer, construída em JavaScript puro ao longo de 4 experiências práticas (estrutura estática, estilo, interatividade/SPA e versionamento/acessibilidade/deploy).

## Sobre o projeto

Site institucional que apresenta o Instituto Renascer, lista seus projetos sociais e permite o cadastro de doadores/voluntários. Navegação em página única (SPA), sem reload, com formulário validado e persistência local dos cadastros.

## Tecnologias utilizadas

- HTML5 semântico
- CSS3 (variáveis, grid/flexbox)
- JavaScript puro (ES6+), sem framework
- [IMask.js](https://imask.js.org/) (via CDN) para máscaras de input
- Git + GitHub, com GitFlow, para versionamento

## Estrutura de pastas

```
/html      → index.html (único ponto de entrada da SPA)
/css       → style.css
/imagens   → assets estáticos
  /otimizadas → imagens em WebP/JPG responsivas (400w, 800w, 1200w)
/js
  main.js  → bootstrap da aplicação
  /modules
    router.js        → navegação por hash, sem reload
    templates.js     → geração de HTML dinâmico (Template Literals)
    eventos.js       → delegação de clique, toast
    validacao.js     → validação de formulário + máscaras (IMask.js)
    storage.js       → persistência dos cadastros no localStorage
    acessibilidade.js → recursos de acessibilidade (WCAG 2.1 AA)
/tools
  build.js → build de produção (minificação), gera a pasta /dist
```

## Como instalar e executar localmente

### Desenvolvimento (sem bundler)

1. `git clone <url-do-repositório>`
2. Entre na pasta do projeto
3. Abra `html/index.html` direto no navegador (duplo clique)

Em desenvolvimento, o projeto roda **sem bundler e sem instalar nada**: é JavaScript puro, e a única dependência externa (IMask.js) é carregada via CDN, então é preciso ter internet no primeiro carregamento. Opcionalmente, use a extensão **Live Server** do VS Code.

### Build de produção (opcional)

O comando `npm run build` é **opcional**: serve apenas para minificar HTML, CSS e JS e gerar a pasta `/dist` usada na publicação. Não é necessário para rodar ou editar o projeto.

1. `npm install` (instala as ferramentas de build: esbuild e html-minifier-terser)
2. `npm run build` (gera a pasta `/dist`, ignorada pelo Git)

## Estratégia de versionamento (GitFlow)

- `main`: produção, estável
- `develop`: integração contínua
- `feature/*`: uma por funcionalidade, nasce e volta pra `develop`
- `hotfix/*`: correções urgentes, nasce de `main`, volta pra `main` **e** `develop`
- Releases marcadas com tags semânticas anotadas

## Deploy

Publicado no **GitHub Pages**, direto a partir da pasta `/dist` gerada pelo build. Escolhido em vez de Vercel/Netlify porque:

- O projeto é 100% estático (sem backend, sem serverless functions, sem variáveis de ambiente) — GitHub Pages é a opção mais simples e gratuita pra exatamente esse caso.
- O código já mora no GitHub, então não exige conectar outra conta/plataforma externa.
- Vercel e Netlify brilham em projetos com SSR, funções serverless ou frameworks (Next.js etc.) — nada disso se aplica aqui.

CI/CD: `.github/workflows/deploy-pages.yml` builda e publica automaticamente a cada push na `main` (ou seja, a cada release feita via GitFlow — merge de `develop` ou de um `hotfix/*`). O workflow roda `npm ci && npm run build` e publica o conteúdo de `/dist` via `actions/deploy-pages`.

Deploy manual (sem esperar o push): aba **Actions** do repositório → `Deploy para GitHub Pages` → **Run workflow**.

## Changelog

- **v1.0.0** — MVP: estrutura de pastas, SPA (router/templates/eventos), formulário validado + localStorage, integração do IMask.js
- **v1.0.1** — fix: mensagem de erro vazando entre inputs do mesmo fieldset
- **v1.0.2** — fix: máscara de telefone travando no formato de 8 dígitos
- **v1.1.0** — minificação de produção (esbuild + html-minifier-terser), imagens WebP responsivas, acessibilidade WCAG 2.1 AA (skip link, ARIA, foco visível, alto contraste) e deploy automatizado via GitHub Actions
