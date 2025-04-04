function Entrar(){

    var textoEmail = document.getElementById('txtemail').value;

    var textoSenha = document.getElementById('txtsenha').value;

    if(textoEmail == "adm@gmail.com" && textoSenha == "ADM12345")
        {
            window.location.href = 'admpage.html';
        }else{
            alert("Você ainda não possui uma conta.")
        }
    
        
    }
