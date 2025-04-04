 function buscarEnderecoPorCEP(){
 const cep = document.getElementById("cep").value;


 if(cep.length !== 8){
    alert("CEP inválido.");
    return;
 }

 const url = `https://viacep.com.br/ws/${cep}/json`;


fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.erro){
            alert("CEP não encontrado");
            document.getElementById('endereco').value = "";
        }else{
            const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            document.getElementById("endereco").value = enderecoCompleto;
        }
    })
    .catch(error => {
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


function validarSignUp(event) {
    event.preventDefault(); 

    const dataNascimento = document.getElementById("dataNascimento").value;
    const genero = document.querySelector('input[name="gender"]:checked');
    const captcha = grecaptcha.getResponse();

    if (!validarIdade(dataNascimento)) {
        alert("Você deve ser maior de idade para se cadastrar.");
        return;
    }

    if (!genero) {
        alert("Por favor, selecione um gênero antes de continuar.");
        return;
    }

    if (!captcha) {
        alert("Por favor, confirme que você não é um robô.");
        return;
    }

    alert("Cadastro realizado com sucesso!");
    event.target.submit(); 
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".form-signUp").addEventListener("submit", validarSignUp);
});




