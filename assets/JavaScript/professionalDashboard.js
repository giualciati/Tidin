// ========== FORMULÁRIO DE PERFIL ==========
function preencherFormularioProfissional() {
  const profissional = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!profissional) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("txtnome").value = profissional.nome || profissional.nomeFantasia || "";
  document.getElementById("cpf").value = profissional.cpfcnpj || "";
  document.getElementById("txtemail").value = profissional.email || "";
  document.getElementById("telefone").value = profissional.telefone || "";
  document.getElementById("dataNascimento").value = profissional.dataNascimento || "";
  document.getElementById("cep").value = profissional.cep || "";
  document.getElementById("endereco").value = profissional.endereco || "";
  document.getElementById("numeroEndereco").value = profissional.numeroEndereco || "";
}

// ========== SALVAR ALTERAÇÕES ==========
function salvarAlteracoesProfissional(event) {
  event.preventDefault();

  const nome = document.getElementById("txtnome").value.trim();
  const cpfcnpj = document.getElementById("cpf").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const dataNascimento = document.getElementById("dataNascimento").value;
  const cep = document.getElementById("cep").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const numeroEndereco = document.getElementById("numeroEndereco").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmSenha = document.getElementById("confirmSenha").value;

  if (!nome || !cpfcnpj || !telefone || !dataNascimento || !cep || !endereco || !numeroEndereco) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  if (senha && senha !== confirmSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  let profissional = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!profissional) {
    alert("Erro ao recuperar profissional.");
    return;
  }

  profissional.nome = nome;
  profissional.cpfcnpj = cpfcnpj;
  profissional.telefone = telefone;
  profissional.dataNascimento = dataNascimento;
  profissional.cep = cep;
  profissional.endereco = endereco;
  profissional.numeroEndereco = numeroEndereco;
  if (senha.length > 0) {
    profissional.senha = senha;
  }

  // Atualizar lista de prestadores no localStorage
  let prestadores = JSON.parse(localStorage.getItem("prestadores")) || [];
  const index = prestadores.findIndex(p => p.email === profissional.email);
  if (index !== -1) {
    prestadores[index] = profissional;
  } else {
    prestadores.push(profissional); // fallback de segurança
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(profissional));
  localStorage.setItem("prestadores", JSON.stringify(prestadores));

  alert("Alterações salvas com sucesso!");
}

// ========== INICIALIZAÇÃO (atualizada) ==========
document.addEventListener("DOMContentLoaded", () => {
  preencherNomeProfissional();

  const path = window.location.pathname;
  if (path.includes("professionalDashHistory.html")) {
    carregarServicosDoProfissional(); // sem limite
  } else if (document.getElementById("professional-service-body")) {
    carregarServicosDoProfissional(4); // limitado
  }

  if (document.getElementById("formMeusDados")) {
    preencherFormularioProfissional();
    document.getElementById("formMeusDados").addEventListener("submit", salvarAlteracoesProfissional);
  }
});
