// ========== PERFIL (Meus Dados) ==========
function preencherFormulario() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
    return;
  }

  const nomeCampo = document.getElementById("txtnome");
  if (!nomeCampo) return;

  const nomePerfil = document.getElementById("nomeUsuarioPerfil");
  if (nomePerfil) nomePerfil.textContent = usuario.nome || "";

  nomeCampo.value = usuario.nome || "";
  document.getElementById("cpf").value = usuario.cpf || "";
  document.getElementById("txtemail").value = usuario.email || "";
  document.getElementById("telefone").value = usuario.telefone || "";
  document.getElementById("dataNascimento").value = usuario.dataNascimento || "";
  document.getElementById("cep").value = usuario.cep || "";
  document.getElementById("endereco").value = usuario.endereco || "";
  document.getElementById("numeroEndereco").value = usuario.numeroEndereco || "";
}


function salvarAlteracoes(event) {
  event.preventDefault();

  const nome = document.getElementById("txtnome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const dataNascimento = document.getElementById("dataNascimento").value;
  const cep = document.getElementById("cep").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const numeroEndereco = document.getElementById("numeroEndereco").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmSenha = document.getElementById("confirmSenha").value;

  if (senha && senha !== confirmSenha) {
    alert("As senhas não conferem.");
    return;
  }

  let usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    alert("Erro ao recuperar usuário.");
    return;
  }

  usuario.nome = nome;
  usuario.cpf = cpf;
  usuario.telefone = telefone;
  usuario.dataNascimento = dataNascimento;
  usuario.cep = cep;
  usuario.endereco = endereco;
  usuario.numeroEndereco = numeroEndereco;
  if (senha.length > 0) {
    usuario.senha = senha;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const index = clientes.findIndex(c => c.email === usuario.email);
  if (index !== -1) {
    clientes[index] = usuario;
  } else {
    clientes.push(usuario);
  }
  localStorage.setItem("clientes", JSON.stringify(clientes));

  alert("Alterações salvas com sucesso!");
}

// ========== HISTÓRICO ==========
function carregarHistoricoNaDashboard(limite = null) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    alert("Você precisa estar logado para acessar o histórico.");
    window.location.href = "login.html";
    return;
  }

  const chaveUsuario = `servicos_${usuario.email}`;
  const historico = JSON.parse(localStorage.getItem(chaveUsuario)) || [];
  const tabela = document.getElementById('history-body');

  if (!tabela) return;

  if (historico.length === 0) {
    tabela.innerHTML = `<tr><td colspan="7">Você ainda não possui serviços agendados.</td></tr>`;
    return;
  }

  tabela.innerHTML = '';

  const historicoFiltrado = limite
    ? historico.slice(0, limite).reverse()
    : historico.slice().reverse();

  historicoFiltrado.forEach(servico => {
    const imovel = `${servico.tipoImovel} - ${servico.qtdQuartos} quartos, ${servico.qtdBanheiros} banheiros`;
    const dataObj = servico.data ? new Date(servico.data.split("T")[0]) : null;
    const data = dataObj && !isNaN(dataObj.getTime()) ? dataObj.toLocaleDateString("pt-BR") : '-';
    const preco = parseFloat(servico.precoFinal);
    const precoFormatado = !isNaN(preco) ? preco.toFixed(2) : '-';

    let avaliacaoHTML = '';
    if (servico.status === 'Concluído' && !servico.avaliacao) {
      avaliacaoHTML = `
        <label for="nota-${servico.id}">⭐</label>
        <select id="nota-${servico.id}">
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select><br>
        <textarea id="comentario-${servico.id}" placeholder="Comentário..."></textarea>
        <button onclick="salvarAvaliacao(${servico.id})">Enviar</button>
      `;
    } else if (servico.avaliacao) {
      avaliacaoHTML = `
        ${'⭐'.repeat(servico.avaliacao.nota)}<br>
        <em>${servico.avaliacao.comentario}</em>
      `;
    } else {
      avaliacaoHTML = '—';
    }

    let acaoHTML = '';
    if (servico.status !== 'Concluído') {
      acaoHTML = `<button onclick="marcarComoConcluido(${servico.id})">Marcar como concluído</button>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${servico.servico}</td>
      <td>${imovel}</td>
      <td>R$ ${precoFormatado}</td>
      <td>${data}</td>
      <td>${servico.status}</td>
      <td>${avaliacaoHTML}</td>
      <td>${acaoHTML}</td>
    `;
    tabela.appendChild(tr);
  });
}

function salvarAvaliacao(id) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const chaveUsuario = `servicos_${usuario?.email}`;
  let historico = JSON.parse(localStorage.getItem(chaveUsuario)) || [];

  const nota = parseInt(document.getElementById(`nota-${id}`).value);
  const comentario = document.getElementById(`comentario-${id}`).value.trim();

  const index = historico.findIndex(s => s.id === id);
  if (index !== -1) {
    historico[index].avaliacao = { nota, comentario };
    localStorage.setItem(chaveUsuario, JSON.stringify(historico));
    alert('Avaliação salva com sucesso!');
    carregarHistoricoNaDashboard();
  }
}

function marcarComoConcluido(id) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const chaveUsuario = `servicos_${usuario?.email}`;
  const historico = JSON.parse(localStorage.getItem(chaveUsuario)) || [];

  const index = historico.findIndex(s => s.id === id);
  if (index !== -1) {
    historico[index].status = "Concluído";
    localStorage.setItem(chaveUsuario, JSON.stringify(historico));
    carregarHistoricoNaDashboard();
  }
}

// ========== GERAL ==========
function logout() {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("nomeUsuario");
  window.location.href = "login.html";
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", () => {
  const nomeUsuario = localStorage.getItem("nomeUsuario") || "Usuário";
  const elementoNome = document.querySelector(".profile .info p b");
  if (elementoNome) elementoNome.textContent = nomeUsuario;

  // Se existir o formulário, preenche e ativa o botão
  if (document.getElementById("formMeusDados")) {
    preencherFormulario();
    document.getElementById("formMeusDados").addEventListener("submit", salvarAlteracoes);
  }

  
  const path = window.location.pathname;
  if (path.includes("clientDashHistory.html")) {
    carregarHistoricoNaDashboard();
  } else if (document.getElementById("history-body")) {
    carregarHistoricoNaDashboard(4);
  }
});
