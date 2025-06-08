document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");
    const filtroInput = document.querySelector(".top-bar input");
    const modal = document.getElementById("modalServico");
    const form = document.getElementById("formServico");
    const btnClose = document.querySelector(".close-modal");

    function carregarServicos() {
        return JSON.parse(localStorage.getItem("servicos")) || [];
    }

    function salvarServicos(servicos) {
        localStorage.setItem("servicos", JSON.stringify(servicos));
    }

    function renderizarTabela(filtro = "") {
        const servicos = carregarServicos();
        tbody.innerHTML = "";

        servicos
            .filter(servico =>
                servico.nome.toLowerCase().includes(filtro.toLowerCase()) ||
                servico.categoria.toLowerCase().includes(filtro.toLowerCase())
            )
            .forEach((servico, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${servico.nome}</td>
                    <td>${servico.categoria}</td>
                    <td>R$ ${parseFloat(servico.valor).toFixed(2)}</td>
                    <td>${servico.status}</td>
                    <td>
                        <button class="btn-acoes" onclick="editarServico(${index})">Editar</button>
                        <button class="btn-acoes" onclick="excluirServico(${index})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
    }

    filtroInput.addEventListener("input", () => {
        renderizarTabela(filtroInput.value);
    });

    window.openAddServiceModal = () => {
        modal.classList.remove("hidden");
        form.reset();
        document.getElementById("indiceServico").value = ""; // Limpa índice para modo "criar"
    };

    btnClose.addEventListener("click", () => modal.classList.add("hidden"));
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nomeServico").value;
        const categoria = document.getElementById("categoriaServico").value;
        const valor = document.getElementById("valorServico").value;
        const status = document.getElementById("statusServico").value;
        const indice = document.getElementById("indiceServico").value;

        const servicos = carregarServicos();

        const novoServico = { nome, categoria, valor, status };

        if (indice === "") {
            // Novo serviço
            servicos.push(novoServico);
        } else {
            // Editar serviço
            servicos[indice] = novoServico;
        }

        salvarServicos(servicos);
        renderizarTabela(filtroInput.value);
        modal.classList.add("hidden");
    });

    window.editarServico = (index) => {
        const servicos = carregarServicos();
        const servico = servicos[index];

        document.getElementById("nomeServico").value = servico.nome;
        document.getElementById("categoriaServico").value = servico.categoria;
        document.getElementById("valorServico").value = servico.valor;
        document.getElementById("statusServico").value = servico.status;
        document.getElementById("indiceServico").value = index;

        modal.classList.remove("hidden");
    };

    window.excluirServico = (index) => {
        const confirmar = confirm("Tem certeza que deseja excluir este serviço?");
        if (confirmar) {
            const servicos = carregarServicos();
            servicos.splice(index, 1);
            salvarServicos(servicos);
            renderizarTabela(filtroInput.value);
        }
    };

    renderizarTabela();
});