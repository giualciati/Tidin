// Alterna visibilidade dos formulários PF e PJ
const tipoContaCheckbox = document.getElementById("tipo-conta");
const formSignUpPF = document.getElementById("form-signUp-pf");
const formSignUpPJ = document.getElementById("form-signUp-pj");
const especialidade = document.getElementById("servico-pf").value;


tipoContaCheckbox.addEventListener("change", () => {
  if (tipoContaCheckbox.checked) {
    formSignUpPF.style.display = "none";
    formSignUpPJ.style.display = "block";
  } else {
    formSignUpPF.style.display = "block";
    formSignUpPJ.style.display = "none";
  }
});


function buscarEnderecoPorCEP_pf() {
  const cep = document.getElementById("cep-pf").value.replace(/\D/g, '');

  if (cep.length !== 8 || isNaN(cep)) {
    alert("CEP inválido.");
    document.getElementById('endereco-pf').value = "";
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        alert("CEP não encontrado");
        document.getElementById('endereco-pf').value = "";
      } else {
        const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        document.getElementById("endereco-pf").value = enderecoCompleto;
      }
    })
    .catch(error => {
      console.error("Erro ao buscar o CEP (PF):", error);
    });
}


function buscarEnderecoPorCEP_pj() {
  const cep = document.getElementById("cep-pj").value.replace(/\D/g, '');

  if (cep.length !== 8 || isNaN(cep)) {
    alert("CEP inválido.");
    document.getElementById('endereco-pj').value = "";
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        alert("CEP não encontrado");
        document.getElementById('endereco-pj').value = "";
      } else {
        const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        document.getElementById("endereco-pj").value = enderecoCompleto;
      }
    })
    .catch(error => {
      console.error("Erro ao buscar o CEP (PJ):", error);
    });
}

function buscarEnderecoPorCEP() {
  const estiloPF = window.getComputedStyle(formSignUpPF);
  if (estiloPF.display !== "none") {
    buscarEnderecoPorCEP_pf();
  } else {
    buscarEnderecoPorCEP_pj();
  }
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


function salvarPrestadorNoLocalStorage(prestador) {
  const lista = JSON.parse(localStorage.getItem("prestadores")) || [];
  lista.push(prestador);
  localStorage.setItem("prestadores", JSON.stringify(lista));
}


function validarSignUp(event) {
  event.preventDefault();

  if (formSignUpPF.style.display !== "none") {
    
    const nome = document.getElementById("txtnome-pf").value.trim();
    const cpf = document.getElementById("CPF-pf").value.trim();
    const email = document.getElementById("txtemail-pf").value.trim();
    const telefone = document.getElementById("telefone-pf").value.trim();
    const dataNascimento = document.getElementById("dataNascimento-pf").value;
    const cep = document.getElementById("cep-pf").value.trim();
    const endereco = document.getElementById("endereco-pf").value.trim();
    const numeroEndereco = document.getElementById("numeroEndereco-pf").value.trim();
    const senha = document.getElementById("senha-pf").value;
    const confirmSenha = document.getElementById("confirmSenha-pf").value;
    const especialidade = document.getElementById("servico-pf").value;

    if (!nome || !cpf || !email || !telefone || !dataNascimento || !cep || !endereco || !numeroEndereco || !senha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!validarIdade(dataNascimento)) {
      alert("Você precisa ter pelo menos 18 anos para se cadastrar.");
      return;
    }

    if (senha !== confirmSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const prestador = {
      tipo: "PF",
      nome,
      cpfcnpj: cpf,
      email,
      telefone,
      dataNascimento,
      cep,
      endereco,
      numeroEndereco,
      senha,
      especialidade
    };

    salvarPrestadorNoLocalStorage(prestador);
    adicionarNotificacao(`Nova conta profissional criada: ${nome}`);
    alert("Cadastro PF realizado com sucesso!");
    window.location.href = "login.html";
    
    document.querySelector("#form-signUp-pf form").reset();

  } else {
   
    const razaoSocial = document.getElementById("razaoSocial-pj").value.trim();
    const cnpj = document.getElementById("cnpj-pj").value.trim();
    const nomeFantasia = document.getElementById("nomeFantasia-pj").value.trim();
    const enderecoPJ = document.getElementById("endereco-pj").value.trim();
    const numeroEnderecoPJ = document.getElementById("numeroEndereco-pj").value.trim();
    const emailPJ = document.getElementById("txtemail-pj").value.trim();
    const telefonePJ = document.getElementById("telefone-pj").value.trim();
    const nomeRep = document.getElementById("txtnome-pj").value.trim();
    const dataNascimentoRep = document.getElementById("dataNascimento-pj").value;
    const cpfRep = document.getElementById("CPF-pj").value.trim();
    const senhaPJ = document.getElementById("senha-pj").value;
    const confirmSenhaPJ = document.getElementById("confirmSenha-pj").value;
    const especialidade = document.getElementById("servico-pj").value;
    const form = event.target;

    if (!razaoSocial || !cnpj || !nomeFantasia || !enderecoPJ || !numeroEnderecoPJ || !emailPJ || !telefonePJ || !nomeRep || !dataNascimentoRep || !cpfRep || !senhaPJ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!validarIdade(dataNascimentoRep)) {
      alert("O representante legal precisa ter pelo menos 18 anos.");
      return;
    }

    if (senhaPJ !== confirmSenhaPJ) {
      alert("As senhas não coincidem.");
      return;
    }

   const prestador = {
  tipo: "PJ",
  nome: razaoSocial,
  cpfcnpj: cnpj,
  nomeFantasia,
  email: emailPJ,
  telefone: telefonePJ,
  dataNascimento: dataNascimentoRep,
  cep: document.getElementById("cep-pj").value.trim(),
  endereco: enderecoPJ,
  numeroEndereco: numeroEnderecoPJ,
  senha: senhaPJ,
  representante: {
    nome: nomeRep,
    cpf: cpfRep,
    dataNascimento: dataNascimentoRep
  },
  especialidade
};

    salvarPrestadorNoLocalStorage(prestador);
    adicionarNotificacao(`Nova conta profissional criada: ${nome || razaoSocial}`);
    alert("Cadastro PJ realizado com sucesso!");
    form.reset();
    window.location.href = "login.html";
  }
}


const forms = document.querySelectorAll(".form-signUp");
forms.forEach(form => {
  form.addEventListener("submit", validarSignUp);
});
