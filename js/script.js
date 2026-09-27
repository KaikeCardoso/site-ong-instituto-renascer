// Máscaras de entrada nativas via JavaScript simples (sem libs externas)

function aplicarMascara(input, formatador) {
  input.addEventListener("input", () => {
    input.value = formatador(input.value);
  });
}

const cpfInput = document.getElementById("cpf");
if (cpfInput) {
  aplicarMascara(cpfInput, (valor) => {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  });
}

const telefoneInput = document.getElementById("telefone");
if (telefoneInput) {
  aplicarMascara(telefoneInput, (valor) => {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  });
}

const cepInput = document.getElementById("cep");
if (cepInput) {
  aplicarMascara(cepInput, (valor) => {
    return valor
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2");
  });
}

function mostrarToast(mensagem, tipo) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensagem;
  toast.className = "toast show toast-" + tipo;
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

const form = document.getElementById("form-cadastro");
if (form) {
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (form.checkValidity()) {
      mostrarToast("Cadastro enviado com sucesso! Obrigado por se juntar a nós.", "success");
      form.reset();
    } else {
      mostrarToast("Verifique os campos destacados antes de enviar.", "error");
    }
  });
}
