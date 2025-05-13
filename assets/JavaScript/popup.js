function abrirPopup() {
    document.getElementById('popupModal').style.display = 'flex';
  }
  
  function fecharPopup() {
    document.getElementById('popupModal').style.display = 'none';
  }
  
  function selecionarConta(tipo) {
    if (tipo === "Cliente") {
      window.location.href = "signUpClient.html";
    } else if (tipo === "Profissional") {
      window.location.href = "signUpProfessional.html";
    } else if (tipo === "Empresa") {
      window.location.href = "cadastro-empresa.html";
    }
  }