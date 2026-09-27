// js/modules/validacao.js
// Responsabilidade única: máscaras de entrada + validação do formulário
// de cadastro, com feedback visual por campo (aria-invalid + mensagem)
// e um toast geral ao enviar.

window.Renascer = window.Renascer || {};

Renascer.Validacao = (function () {
  const regras = {
    nome: {
      pattern: /^[A-Za-zÀ-ÿ ]{5,}$/,
      mensagem: "Informe seu nome completo (mín. 5 letras, apenas letras e espaços).",
    },
    cpf: {
      pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      mensagem: "CPF no formato 000.000.000-00.",
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      mensagem: "Informe um e-mail válido.",
    },
    telefone: {
      pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
      mensagem: "Telefone no formato (00) 00000-0000.",
    },
    cep: {
      pattern: /^\d{5}-\d{3}$/,
      mensagem: "CEP no formato 00000-000.",
    },
    cidade: {
      pattern: null,
      mensagem: "Informe sua cidade.",
    },
    tipo: {
      pattern: null,
      mensagem: "Selecione como deseja ajudar.",
    },
  };

  // --- Fallback manual (usado só se o IMask.js do CDN não carregar) ---

  function aplicarMascara(input, formatador) {
    if (!input) return;
    input.addEventListener("input", () => {
      input.value = formatador(input.value);
    });
  }

  function mascaraCPF(valor) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function mascaraTelefone(valor) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function mascaraCEP(valor) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function exibirErro(campo, mensagem) {
    campo.setAttribute("aria-invalid", "true");
    // Bug corrigido: campo.parentElement é o <fieldset> inteiro (os campos
    // não têm wrapper individual), então buscar ".erro-campo" nele pegava
    // a mensagem de erro de OUTRO campo do mesmo fieldset. A busca correta
    // é no irmão imediato (nextElementSibling), que é sempre exclusivo
    // deste input.
    let mensagemErro = campo.nextElementSibling;
    if (!mensagemErro || !mensagemErro.classList.contains("erro-campo")) {
      mensagemErro = document.createElement("small");
      mensagemErro.className = "erro-campo";
      campo.insertAdjacentElement("afterend", mensagemErro);
    }
    mensagemErro.textContent = mensagem;
  }

  function limparErro(campo) {
    campo.removeAttribute("aria-invalid");
    const proximo = campo.nextElementSibling;
    if (proximo && proximo.classList.contains("erro-campo")) {
      proximo.remove();
    }
  }

  function validarCampo(campo) {
    const regra = regras[campo.name];
    if (!regra) return true;

    const valor = campo.value.trim();

    if (campo.hasAttribute("required") && !valor) {
      exibirErro(campo, "Campo obrigatório.");
      return false;
    }
    if (regra.pattern && !regra.pattern.test(valor)) {
      exibirErro(campo, regra.mensagem);
      return false;
    }

    limparErro(campo);
    return true;
  }

  function iniciarMascaras() {
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const cepInput = document.getElementById("cep");

    // Integração com a biblioteca externa IMask.js (via CDN, ver html/index.html).
    // Verificamos typeof IMask antes de usar: se o CDN falhar ao carregar
    // (ex: sem internet), caímos pro fallback manual abaixo, sem quebrar o form.
    if (typeof IMask !== "undefined") {
      if (cpfInput) IMask(cpfInput, { mask: "000.000.000-00" });
      if (telefoneInput) {
        // Bug corrigido: o array de 2 máscaras (fixo/celular) fazia o
        // IMask "travar" no formato de 8 dígitos antes do usuário terminar
        // de digitar o 9º dígito do celular, obrigando a apagar e redigitar.
        // Como praticamente todo número hoje é celular (9 dígitos), fixei
        // uma única máscara — elimina a ambiguidade de seleção automática.
        IMask(telefoneInput, { mask: "(00) 00000-0000" });
      }
      if (cepInput) IMask(cepInput, { mask: "00000-000" });
    } else {
      aplicarMascara(cpfInput, mascaraCPF);
      aplicarMascara(telefoneInput, mascaraTelefone);
      aplicarMascara(cepInput, mascaraCEP);
    }
  }

  function iniciarFormularioCadastro(aoSalvarComSucesso) {
    const form = document.getElementById("form-cadastro");
    if (!form) return;

    iniciarMascaras();

    // valida campo a campo ao perder o foco, pra dar feedback cedo
    form.querySelectorAll("input, select").forEach((campo) => {
      campo.addEventListener("blur", () => validarCampo(campo));
    });

    form.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const campos = [...form.querySelectorAll("input, select")];
      const todosValidos = campos.map(validarCampo).every(Boolean);

      if (!todosValidos) {
        Renascer.Eventos.mostrarToast("Verifique os campos destacados antes de enviar.", "error");
        const primeiroInvalido = form.querySelector('[aria-invalid="true"]');
        if (primeiroInvalido) primeiroInvalido.focus();
        return;
      }

      const dados = Object.fromEntries(new FormData(form).entries());
      Renascer.Storage.salvar(dados);
      Renascer.Eventos.mostrarToast("Cadastro enviado com sucesso! Obrigado por se juntar a nós.", "success");
      form.reset();

      if (typeof aoSalvarComSucesso === "function") aoSalvarComSucesso();
    });
  }

  return { iniciarFormularioCadastro };
})();
