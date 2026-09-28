// js/modules/acessibilidade.js
// Responsabilidade única: recursos de acessibilidade que não pertencem
// à navegação da SPA em si — sincronizar aria-expanded do menu mobile
// e o toggle de alto contraste (persistido em localStorage).

window.Renascer = window.Renascer || {};

Renascer.Acessibilidade = (function () {
  const CHAVE_CONTRASTE = "renascer_alto_contraste";

  function sincronizarMenuMobile() {
    const toggle = document.getElementById("nav-toggle");
    const label = document.querySelector('label[for="nav-toggle"]');
    if (!toggle || !label) return;

    toggle.addEventListener("change", () => {
      label.setAttribute("aria-expanded", toggle.checked ? "true" : "false");
    });
  }

  function aplicarContraste(ativo) {
    document.documentElement.classList.toggle("alto-contraste", ativo);
    const botao = document.getElementById("botao-alto-contraste");
    if (botao) botao.setAttribute("aria-pressed", ativo ? "true" : "false");
  }

  function iniciarAltoContraste() {
    const botao = document.getElementById("botao-alto-contraste");
    if (!botao) return;

    const ativoSalvo = localStorage.getItem(CHAVE_CONTRASTE) === "true";
    aplicarContraste(ativoSalvo);

    botao.addEventListener("click", () => {
      const ativo = !document.documentElement.classList.contains("alto-contraste");
      aplicarContraste(ativo);
      localStorage.setItem(CHAVE_CONTRASTE, String(ativo));
    });
  }

  function iniciar() {
    sincronizarMenuMobile();
    iniciarAltoContraste();
  }

  return { iniciar };
})();
