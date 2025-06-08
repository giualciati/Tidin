// Dados dos serviços e preços base
const servicos = {
  "Limpeza Padrão": 60,
  "Limpeza Pesada": 90,
  "Passadoria": 40,
  "Montagem de móveis": 80,
  "Limpeza de Vidros": 100,
  "Limpeza de estofados": 100,
  "Limpeza de piscina": 100,
  "Assistência Residencial": 90,
  "Limpeza Comercial": 60,
  "Assistencia Empresarial": 100
};

let quantidadeQuartos = 2;
let quantidadeBanheiros = 2;
let tipoImovelSelecionado = null;
let metrosQuadrados = 0;

function alterarQuantidade(tipo, operacao) {
  if (tipo === 'quartos') {
    quantidadeQuartos = Math.max(1, quantidadeQuartos + operacao);
    document.getElementById('qtdQuartos').textContent = quantidadeQuartos;
  } else if (tipo === 'banheiros') {
    quantidadeBanheiros = Math.max(1, quantidadeBanheiros + operacao);
    document.getElementById('qtdBanheiros').textContent = quantidadeBanheiros;
  }
  calcularPreco();
}

function calcularPreco() {
  const servico = document.getElementById('servico').value;
  const levarProdutos = document.getElementById('levarProdutos').checked;

  if (!servico) {
    document.getElementById('descricaoServico').textContent = "Selecione um serviço para ver o resumo.";
    document.getElementById('precoFinal').textContent = "R$ 0,00";
    return;
  }

  let precoBase = servicos[servico] || 0;
  let precoFinal = precoBase;

  if (tipoImovelSelecionado === "Empresa") {
    const blocosDe100 = Math.floor(metrosQuadrados / 100);
    precoFinal += blocosDe100 * 100;
    precoFinal += quantidadeBanheiros * 15;
  } else {
    const quartosExtras = Math.max(0, quantidadeQuartos - 1);
    const banheirosExtras = Math.max(0, quantidadeBanheiros - 1);
    precoFinal += (quartosExtras * 10) + (banheirosExtras * 15);
  }

  if (levarProdutos) {
    precoFinal += 20;
  }

  const descricao = `
    Serviço: ${servico} | 
    Imóvel: ${tipoImovelSelecionado || 'N/A'} ${tipoImovelSelecionado === "Empresa" 
      ? `| ${metrosQuadrados} m²` 
      : `| ${quantidadeQuartos} quartos, ${quantidadeBanheiros} banheiros`} 
    ${levarProdutos ? '| Com produtos do profissional' : '| Sem produtos'}
  `;

  document.getElementById('descricaoServico').textContent = descricao.trim();
  document.getElementById('precoFinal').textContent = `R$ ${precoFinal.toFixed(2)}`;
}

function configurarEventos() {
  document.getElementById('servico').addEventListener('change', calcularPreco);
  document.getElementById('levarProdutos').addEventListener('change', calcularPreco);

  document.querySelectorAll('.radio-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selecionado'));
      option.classList.add('selecionado');
      tipoImovelSelecionado = option.dataset.value;

      const campoMetros = document.getElementById('campoMetros');
      if (tipoImovelSelecionado === "Empresa") {
        campoMetros.style.display = "block";
      } else {
        campoMetros.style.display = "none";
      }

      calcularPreco();
    });
  });

  const metrosInput = document.getElementById("metrosQuadrados");
  if (metrosInput) {
    metrosInput.addEventListener("input", () => {
      metrosQuadrados = parseInt(metrosInput.value) || 0;
      calcularPreco();
    });
  }
}

window.onload = () => {
  configurarEventos();
  document.getElementById('qtdQuartos').textContent = quantidadeQuartos;
  document.getElementById('qtdBanheiros').textContent = quantidadeBanheiros;
  calcularPreco();

  document.getElementById('btnConcluir').addEventListener('click', () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) {
      alert("Você precisa estar logado para contratar um serviço.");
      window.location.href = "login.html";
      return;
    }

    const servico = document.getElementById('servico').value;
    const qtdQuartos = document.getElementById('qtdQuartos').textContent;
    const qtdBanheiros = document.getElementById('qtdBanheiros').textContent;
    const tipoSelecionado = tipoImovelSelecionado;
    const metrosQuadrados = document.getElementById('metrosQuadrados')?.value || '0';
    const levarProdutos = document.getElementById('levarProdutos').checked;
    const infoAdicionais = document.getElementById('infoAdicionais').value.trim();
    const precoFinalTexto = document.getElementById('precoFinal').textContent;
    const precoFinal = parseFloat(precoFinalTexto.replace('R$', '').replace(',', '.').trim());
    const dataServico = document.getElementById('dataServico')?.value || '';

    if (!servico) {
      alert('Por favor, selecione um tipo de serviço.');
      return;
    }

    const dadosServico = {
      id: Date.now(),
      servico,
      qtdQuartos,
      qtdBanheiros,
      tipoImovel: tipoSelecionado,
      metrosQuadrados,
      levarProdutos,
      infoAdicionais,
      precoFinal,
      data: dataServico,
      status: 'Aguardando pagamento',
      nomeCliente: usuario.nome || usuario.email
    };

   
    const chaveUsuario = `servicos_${usuario.email}`;
    const historico = JSON.parse(localStorage.getItem(chaveUsuario)) || [];

    historico.push(dadosServico);
    localStorage.setItem(chaveUsuario, JSON.stringify(historico));
    localStorage.setItem('dadosServico', JSON.stringify(dadosServico)); 

    adicionarNotificacao(`Novo pedido de serviço: ${servico}`);

    window.location.href = 'paymentPage.html';
  });
};
