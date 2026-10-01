// js/modules/acessibilidade.js
// Responsabilidade única: recursos de acessibilidade que não pertencem
// à navegação da SPA em si — sincronizar aria-expanded do menu mobile
// e o toggle de alto contraste (persistido em localStorage).

window.Renascer = window.Renascer || {};

Renascer.Acessibilidade = (function () {
  const CHAVE_CONTRASTE = "renascer_alto_contraste";
  const BREAKPOINT_MOBILE = "(max-width: 767px)";

  function sincronizarMenuMobile() {
    const toggle = document.getElementById("nav-toggle");
    const label = document.querySelector('label[for="nav-toggle"]');
    const menu = document.getElementById("menu-principal");
    if (!toggle || !label || !menu) return;

    const mediaMobile = window.matchMedia(BREAKPOINT_MOBILE);

    // Bug de acessibilidade corrigido: com max-height: 0 no CSS, os
    // links do menu recolhido ficavam visualmente escondidos mas
    // continuavam alcançáveis via Tab — quem navega por teclado
    // "sumia" dentro de um menu invisível. `inert` remove esses links
    // da navegação por teclado e de leitores de ecrã enquanto o menu
    // está fechado, só no viewport mobile (no desktop o menu é sempre
    // visível e nunca deve ficar inert).
    function sincronizarInert() {
      const deveFicarInert = mediaMobile.matches && !toggle.checked;
      menu.toggleAttribute("inert", deveFicarInert);
    }

    toggle.addEventListener("change", () => {
      label.setAttribute("aria-expanded", toggle.checked ? "true" : "false");
      sincronizarInert();
    });
    mediaMobile.addEventListener("change", sincronizarInert);
    sincronizarInert();
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
