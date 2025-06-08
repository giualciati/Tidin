function buscarEnderecoPorCEP() {
    const cep = document.getElementById("cep").value;

    if (cep.length !== 8 || isNaN(cep)) {
        alert("CEP inválido.");
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado");
                document.getElementById('endereco').value = "";
            } else {
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

    if (!validarIdade(dataNascimento)) {
        alert("Você deve ser maior de idade para se cadastrar.");
        return;
    }

    if (!genero) {
        alert("Por favor, selecione um gênero antes de continuar.");
        return;
    }


    const nome = document.getElementById("txtnome").value;
    const cpf = document.getElementById("CPF").value;
    const email = document.getElementById("txtemail").value;
    const telefone = document.getElementById("telefone").value;
    const nascimento = document.getElementById("dataNascimento").value;
    const cep = document.getElementById("cep").value;
    const endereco = document.getElementById("endereco").value;
    const numero = document.getElementById("numeroEndereco").value;
    const senha = document.getElementById("senha").value;
    const generoSelecionado = genero ? genero.id : "Não informado";

    const dadosUsuario = {
        nome,
        cpf,
        email,
        telefone,
        nascimento,
        cep,
        endereco,
        numero,
        senha,
        genero: generoSelecionado,
        tipoConta: "Pessoa Física"
    };

    const listaClientes = JSON.parse(localStorage.getItem("clientes")) || [];
    listaClientes.push(dadosUsuario);
    localStorage.setItem("clientes", JSON.stringify(listaClientes));
    localStorage.setItem("totalClientes", listaClientes.length);
    localStorage.setItem("nomeUsuario", nome); 

    alert("Cadastro realizado com sucesso!");
    adicionarNotificacao(`Nova conta cliente criada: ${nome}`);
    document.querySelector(".form-signUp").reset();
    grecaptcha.reset();
    window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".form-signUp").addEventListener("submit", validarSignUp);
});
