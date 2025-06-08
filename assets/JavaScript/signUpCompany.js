document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("form-signUp-clientePJ")
    .addEventListener("submit", validarCadastroEmpresaCliente);
});

function buscarEnderecoPorCEPCliente() {
  const cep = document.getElementById("cep-cliente").value.replace(/\D/g, "");

  if (cep.length !== 8 || isNaN(cep)) {
    alert("CEP inválido.");
    document.getElementById("endereco-cliente").value = "";
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((res) => res.json())
    .then((data) => {
      if (data.erro) {
        alert("CEP não encontrado.");
        document.getElementById("endereco-cliente").value = "";
      } else {
        const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        document.getElementById("endereco-cliente").value = enderecoCompleto;
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar o CEP:", error);
    });
}

function validarIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade >= 18;
}

function validarCadastroEmpresaCliente(event) {
  event.preventDefault();

  const razaoSocial = document.getElementById("razaoSocial-cliente").value.trim();
  const cnpj = document.getElementById("cnpj-cliente").value.trim();
  const nomeFantasia = document.getElementById("nomeFantasia-cliente").value.trim();
  const cep = document.getElementById("cep-cliente").value.trim();
  const endereco = document.getElementById("endereco-cliente").value.trim();
  const numero = document.getElementById("numeroEndereco-cliente").value.trim();
  const email = document.getElementById("email-cliente").value.trim();
  const telefone = document.getElementById("telefone-cliente").value.trim();

  const nomeRepresentante = document.getElementById("nome-representante").value.trim();
  const dataNascimento = document.getElementById("dataNascimento-representante").value;
  const cpf = document.getElementById("cpf-representante").value.trim();
  const senha = document.getElementById("senha-cliente").value;
  const confirmSenha = document.getElementById("confirmSenha-cliente").value;

  if (
    !razaoSocial || !cnpj || !nomeFantasia || !cep || !endereco || !numero || !email || !telefone ||
    !nomeRepresentante || !dataNascimento || !cpf || !senha || !confirmSenha
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  if (!validarIdade(dataNascimento)) {
    alert("O representante legal precisa ter pelo menos 18 anos.");
    return;
  }

  if (senha !== confirmSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  const novaEmpresa = {
    tipoConta: "Empresa Cliente",
    razaoSocial,
    cnpj,
    nomeFantasia,
    cep,
    endereco,
    numero,
    email,
    telefone,
    senha,
    representante: {
      nome: nomeRepresentante,
      cpf,
      dataNascimento
    }
  };

  const empresasClientes = JSON.parse(localStorage.getItem("empresasClientes")) || [];
  empresasClientes.push(novaEmpresa);
  localStorage.setItem("empresasClientes", JSON.stringify(empresasClientes));
  localStorage.setItem("nomeUsuario", nomeRepresentante);

  alert("Cadastro da empresa realizado com sucesso!");
  adicionarNotificacao(`Nova conta cliente PJ criada: ${razaoSocial}`);
  document.getElementById("form-signUp-clientePJ").reset();
  grecaptcha.reset();
  window.location.href = "login.html";
}
