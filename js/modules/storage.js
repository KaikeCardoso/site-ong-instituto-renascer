// js/modules/storage.js
// Responsabilidade única: ler e gravar os cadastros no localStorage.
// Nenhum outro módulo deve chamar localStorage diretamente — tudo passa
// por aqui, para manter a lógica de persistência centralizada.

window.Renascer = window.Renascer || {};

Renascer.Storage = (function () {
  const CHAVE = "renascer_cadastros";
  const LIMITE = 10; // guarda só os 10 cadastros mais recentes

  function listar() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE));
      return Array.isArray(dados) ? dados : [];
    } catch (erro) {
      console.warn("Não foi possível ler os cadastros salvos:", erro);
      return [];
    }
  }

  function salvar(dadosFormulario) {
    const cadastros = listar();
    cadastros.unshift({
      ...dadosFormulario,
      dataEnvio: new Date().toLocaleString("pt-BR"),
    });
    localStorage.setItem(CHAVE, JSON.stringify(cadastros.slice(0, LIMITE)));
  }

  function limpar() {
    localStorage.removeItem(CHAVE);
  }

  return { listar, salvar, limpar };
})();
