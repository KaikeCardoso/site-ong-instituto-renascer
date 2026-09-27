// js/modules/eventos.js
// Responsabilidade única: centralizar listeners de eventos reutilizáveis
// (cliques de navegação, feedback visual em toast).

window.Renascer = window.Renascer || {};

Renascer.Eventos = (function () {
  function ligarLinksDeNavegacao(aoNavegar) {
    document.addEventListener("click", (evento) => {
      const link = evento.target.closest("[data-rota]");
      if (!link) return;

      evento.preventDefault();
      aoNavegar(link.getAttribute("href"));

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
