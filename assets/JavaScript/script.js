function Entrar() {
  const emailDigitado = document.getElementById('txtemail').value;
  const senhaDigitada = document.getElementById('txtsenha').value;

  const listaClientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const listaPrestadores = JSON.parse(localStorage.getItem("prestadores")) || [];
  const listaEmpresasClientes = JSON.parse(localStorage.getItem("empresasClientes")) || [];

  // Verifica se é um cliente
  const clienteEncontrado = listaClientes.find(cliente =>
    cliente.email === emailDigitado && cliente.senha === senhaDigitada
  );

  // Verifica se é um prestador
  const prestadorEncontrado = listaPrestadores.find(prestador =>
    prestador.email === emailDigitado && prestador.senha === senhaDigitada
  );

  // Verifica se é uma empresa cliente
  const empresaClienteEncontrada = listaEmpresasClientes.find(empresa =>
    empresa.email === emailDigitado && empresa.senha === senhaDigitada
  );

  if (clienteEncontrado) {
    localStorage.setItem("usuarioLogado", JSON.stringify(clienteEncontrado));
    localStorage.setItem("nomeUsuario", clienteEncontrado.nome);
    alert("Login realizado com sucesso!");
    window.location.href = 'index.html';

  } else if (prestadorEncontrado) {
    localStorage.setItem("usuarioLogado", JSON.stringify(prestadorEncontrado));
    localStorage.setItem("nomeUsuario", prestadorEncontrado.nomeFantasia || prestadorEncontrado.nome);
    alert("Login de prestador realizado com sucesso!");
    window.location.href = 'professionalDashboard.html';

  } else if (empresaClienteEncontrada) {
    localStorage.setItem("usuarioLogado", JSON.stringify(empresaClienteEncontrada));
    // Usar razão social ou nome fantasia para mostrar
    localStorage.setItem("nomeUsuario", empresaClienteEncontrada.razaoSocial || empresaClienteEncontrada.nomeFantasia);
    alert("Login de empresa cliente realizado com sucesso!");
    // Redirecionar para dashboard específico de empresa cliente, por exemplo:
    window.location.href = 'clientDashboard.html';

  } else if (emailDigitado === "adm@gmail.com" && senhaDigitada === "ADM12345") {
    alert("Bem-vindo(a), administrador!");
    window.location.href = 'admDashboard.html';

  } else {
    alert("E-mail ou senha incorretos.");
  }
}

function atualizarNavUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const navLoginItem = document.getElementById("nav-login-item");

  if (usuario && navLoginItem) {
   
    const nomeExibido = usuario.tipo === 'PJ' ? usuario.nomeFantasia : usuario.nome || usuario.email;

    
    let destino;
    if (usuario.tipo === 'PJ' || usuario.tipo === 'PF') {
      destino = 'professionalDashboard.html';
    } else {
      destino = 'clientDashboard.html';
    }

    navLoginItem.innerHTML = `
      <a href="${destino}">
        Olá, <strong>${nomeExibido}</strong>
      </a>
    `;
  } else if (navLoginItem) {
    navLoginItem.innerHTML = `<a href="login.html" class="entrar">Entrar</a>`;
  }
}

function showSection(sectionId) {
  const sections = document.querySelectorAll('.slider-section');
  const buttons = document.querySelectorAll('.switch-buttons button');

  sections.forEach(section => section.classList.remove('active'));
  buttons.forEach(button => button.classList.remove('active'));

  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add('active');

    const activeBtn = [...buttons].find(btn =>
      btn.textContent.toLowerCase().includes(sectionId === 'home' ? 'lar' : 'empresa')
    );
    if (activeBtn) activeBtn.classList.add('active');

    selectedSection.scrollIntoView({ behavior: "smooth" });
  }
}

function verificarParametroURL() {
  const params = new URLSearchParams(window.location.search);
  const secao = params.get('secao');

  if (secao === 'home' || secao === 'business') {
    showSection(secao);
  }
}

function verificarConsentimentoCookies() {
  const consentimento = localStorage.getItem("cookiesConsentimento");

  if (!consentimento) {
    const modal = document.getElementById("cookieModal");
    if (modal) modal.classList.remove("hidden");
  }
}

function aceitarCookies() {
  localStorage.setItem("cookiesConsentimento", "aceito");
  document.getElementById("cookieModal").classList.add("hidden");
}

function recusarCookies() {
  localStorage.setItem("cookiesConsentimento", "recusado");
  document.getElementById("cookieModal").classList.add("hidden");
}

function enviarRecuperacao() {
  const email = document.getElementById('emailRecuperacao').value.trim();

  if (email === "") {
    alert("Por favor, digite seu e-mail.");
    return;
  }
  document.getElementById('mensagemSucesso').style.display = "block";
}

window.addEventListener('DOMContentLoaded', () => {
  atualizarNavUsuario();
  verificarParametroURL();
  verificarConsentimentoCookies();
});
