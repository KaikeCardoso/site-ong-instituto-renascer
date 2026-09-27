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
    let mensagemErro = campo.parentElement.querySelector(".erro-campo");
    if (!mensagemErro) {
      mensagemErro = document.createElement("small");
      mensagemErro.className = "erro-campo";
      campo.insertAdjacentElement("afterend", mensagemErro);
    }
    mensagemErro.textContent = mensagem;
  }

  function limparErro(campo) {
    campo.removeAttribute("aria-invalid");
    const mensagemErro = campo.parentElement.querySelector(".erro-campo");
    if (mensagemErro) mensagemErro.remove();
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

  function iniciarFormularioCadastro(aoSalvarComSucesso) {
    const form = document.getElementById("form-cadastro");
    if (!form) return;

    aplicarMascara(document.getElementById("cpf"), mascaraCPF);
    aplicarMascara(document.getElementById("telefone"), mascaraTelefone);
    aplicarMascara(document.getElementById("cep"), mascaraCEP);

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
