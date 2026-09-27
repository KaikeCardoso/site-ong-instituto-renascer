// js/modules/eventos.js
// Responsabilidade única: centralizar listeners de eventos reutilizáveis
// (cliques de navegação, feedback visual em toast). O router chama estas
// funções em vez de cada módulo colocar addEventListener por conta própria.

window.Renascer = window.Renascer || {};

Renascer.Eventos = (function () {
  function ligarLinksDeNavegacao(aoNavegar) {
    // Delegação de evento no document: funciona mesmo para links que
    // ainda nem existem no DOM (eles são recriados a cada troca de rota)
    document.addEventListener("click", (evento) => {
      const link = evento.target.closest("[data-rota]");
      if (!link) return;

      evento.preventDefault();
      aoNavegar(link.getAttribute("href"));

      // fecha o menu hambúrguer no mobile após escolher uma rota
      const toggle = document.getElementById("nav-toggle");
      if (toggle) toggle.checked = false;
    });
  }

  function marcarLinkAtivo(rotaAtual) {
    document.querySelectorAll("[data-rota]").forEach((link) => {
      const alvo = link.getAttribute("href").replace("#/", "").replace("#", "");
      if (alvo === rotaAtual) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensagem;
    toast.className = `toast show toast-${tipo}`;
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

  return { ligarLinksDeNavegacao, marcarLinkAtivo, mostrarToast };
})();
