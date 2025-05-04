document.getElementById("form-contato").addEventListener("submit", function(event) {
    event.preventDefault(); 
  
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const assunto = document.getElementById("assunto").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
  
    if (!nome || !email || !assunto || !mensagem) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
  
    enviarFormulario(nome, email, assunto, mensagem);
  });
  
  function enviarFormulario(nome, email, assunto, mensagem) {
    console.log("Formulário enviado:", { nome, email, assunto, mensagem });
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
  
    document.getElementById("form-contato").reset();
  }