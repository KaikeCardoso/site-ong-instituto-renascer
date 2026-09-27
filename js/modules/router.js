// js/modules/router.js
// Responsabilidade única: mapear a URL (hash) para um template, injetar
// esse HTML dentro de #app e disparar a inicialização específica da
// rota (ex: ligar os eventos do formulário quando é a rota de cadastro).

window.Renascer = window.Renascer || {};

Renascer.Router = (function () {
  const app = document.getElementById("app");

  const rotas = {
    "": {
      titulo: "Instituto Renascer | Início",
      renderizar: () => Renascer.Templates.home(),
    },
    projetos: {
      titulo: "Instituto Renascer | Projetos",
      renderizar: () => Renascer.Templates.projetos(),
    },
    cadastro: {
      titulo: "Instituto Renascer | Cadastro",
      renderizar: () => Renascer.Templates.cadastro(Renascer.Storage.listar()),
    },
  };

  function obterChaveDaRota() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    return rotas[hash] ? hash : "";
  }

  function renderizarRotaAtual() {
    const chave = obterChaveDaRota();
    const rota = rotas[chave];

    app.innerHTML = rota.renderizar();
    document.title = rota.titulo;
    Renascer.Eventos.marcarLinkAtivo(chave);
    app.focus();

    if (chave === "cadastro") {
      Renascer.Validacao.iniciarFormularioCadastro(renderizarRotaAtual);
    }
  }

  function navegarPara(hash) {
    if (window.location.hash === hash) {
      renderizarRotaAtual();
    } else {
      window.location.hash = hash;
    }
  }

  function iniciar() {
    Renascer.Eventos.ligarLinksDeNavegacao(navegarPara);
    window.addEventListener("hashchange", renderizarRotaAtual);

    if (!window.location.hash) {
      window.location.hash = "#/";
    } else {
      renderizarRotaAtual();
    }
  }

  return { iniciar };
})();
