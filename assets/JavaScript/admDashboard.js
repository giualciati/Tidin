document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("tabelaClientes");
    const filter = document.getElementById("filtroNome");
    const btnClear = document.getElementById("limparTudo");
    const isOnClientPage = !!table;

    function renderizarTabelaClientes(filtroTexto = "") {
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        const empresasClientes = JSON.parse(localStorage.getItem("empresasClientes")) || [];

        const todosClientes = clientes.concat(empresasClientes);

        table.innerHTML = "";

        todosClientes
            .filter(cliente =>
                (cliente.nome || cliente.razaoSocial || cliente.nomeFantasia || "")
                    .toLowerCase()
                    .includes(filtroTexto.toLowerCase())
            )
            .forEach((cliente, index) => {
                const nomeExibido = cliente.nome || cliente.razaoSocial || cliente.nomeFantasia || "";
                const documento = cliente.cpf || cliente.cnpj || "";
                const genero = cliente.genero || "-";
                const tipoConta = cliente.tipoConta || "Não informado";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${nomeExibido}</td>
                    <td>${documento}</td>
                    <td>${cliente.email || ""}</td>
                    <td>${cliente.telefone || ""}</td>
                    <td>${cliente.endereco || ""}, ${cliente.numero || ""} - ${cliente.cep || ""}</td>
                    <td>${genero}</td>
                    <td>${tipoConta}</td>
                    <td class="menu-coluna">
                        <div class="menu-container">
                            <span class="material-icons-outlined menu-toggle" data-index="${index}">more_vert</span>
                            <ul class="menu-opcoes hidden" id="menu-${index}">
                                <li onclick="excluirCliente(${index})">Excluir</li>
                            </ul>
                        </div>
                    </td>
                `;
                table.appendChild(tr);
            });

        document.querySelectorAll(".menu-toggle").forEach(toggle => {
            toggle.addEventListener("click", (e) => {
                e.stopPropagation();
                const index = toggle.getAttribute("data-index");
                const menu = document.getElementById(`menu-${index}`);
                menu.classList.toggle("hidden");

                document.querySelectorAll(".menu-opcoes").forEach(otherMenu => {
                    if (otherMenu !== menu) {
                        otherMenu.classList.add("hidden");
                    }
                });
            });
        });

        document.addEventListener("click", () => {
            document.querySelectorAll(".menu-opcoes").forEach(menu => {
                menu.classList.add("hidden");
            });
        });

        atualizarContadores();
    }

    window.excluirCliente = function (index) {
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        const empresasClientes = JSON.parse(localStorage.getItem("empresasClientes")) || [];

        if (index < clientes.length) {
            clientes.splice(index, 1);
            localStorage.setItem("clientes", JSON.stringify(clientes));
        } else {
            const idxEmpresa = index - clientes.length;
            empresasClientes.splice(idxEmpresa, 1);
            localStorage.setItem("empresasClientes", JSON.stringify(empresasClientes));
        }
        renderizarTabelaClientes(filter.value);
    };

    if (filter) {
        filter.addEventListener("input", () => renderizarTabelaClientes(filter.value));
    }

    if (btnClear) {
        btnClear.addEventListener("click", () => {
            if (confirm("Deseja apagar todos os cadastros?")) {
                localStorage.removeItem("clientes");
                localStorage.removeItem("empresasClientes");
                renderizarTabelaClientes();
            }
        });
    }


    function renderizarPedidosRecentesNaTabela() {
        const tabela = document.getElementById("tabela-pedidos");
        if (!tabela) return;

        const pedidos = JSON.parse(localStorage.getItem("historicoServicos")) || [];
        tabela.innerHTML = "";

        pedidos.slice(-5).reverse().forEach(pedido => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${pedido.nomeCliente || "Desconhecido"}</td>
                <td>${pedido.servico}</td>
                <td>${pedido.data || "-"}</td>
                <td>${pedido.hora || "-"}</td>
                <td>R$ ${pedido.precoFinal?.toFixed(2) || "0.00"}</td>
                <td>${pedido.status}</td>
            `;
            tabela.appendChild(tr);
        });
    }

    function renderizarNotificacoesRecentes() {
        const container = document.querySelector(".recent-updates");
        if (!container) return;

        const notificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];
        container.innerHTML = "";

        const titulo = document.createElement("h2");
        titulo.textContent = "Últimas atualizações";
        container.appendChild(titulo);

        if (notificacoes.length === 0) {
            const vazio = document.createElement("p");
            vazio.textContent = "Nenhuma atualização recente.";
            vazio.style.color = "#777";
            container.appendChild(vazio);
            return;
        }

        notificacoes.slice(-3).reverse().forEach(n => {
            const update = document.createElement("div");
            update.classList.add("update");

            update.innerHTML = `
                <div class="profile-photo">
                    <img src="assets/img/images.png" alt="">
                </div>
                <div class="message">
                    <p>${n.mensagem}</p>
                    <small class="text-muted">${n.hora}</small>
                </div>
            `;
            container.appendChild(update);
        });
    }

    function renderizarPedidosRecentes() {
        const pedidosContainer = document.querySelector(".order-list");
        if (!pedidosContainer) return;

        const reservas = JSON.parse(localStorage.getItem("historicoServicos")) || [];

        while (pedidosContainer.children.length > 4) {
            pedidosContainer.removeChild(pedidosContainer.lastChild);
        }

        reservas.forEach(reserva => {
            const dataDiv = document.createElement("div");
            const clienteDiv = document.createElement("div");
            const servicoDiv = document.createElement("div");
            const valorDiv = document.createElement("div");

            dataDiv.textContent = reserva.data || "-";
            clienteDiv.textContent = reserva.cliente || "-";
            servicoDiv.textContent = reserva.servico || "-";
            valorDiv.textContent = reserva.valor || "-";

            pedidosContainer.appendChild(dataDiv);
            pedidosContainer.appendChild(clienteDiv);
            pedidosContainer.appendChild(servicoDiv);
            pedidosContainer.appendChild(valorDiv);
        });
    }

    function atualizarContadores() {
    }

    if (isOnClientPage) {
        renderizarTabelaClientes();
    }

    renderizarPedidosRecentesNaTabela();
    renderizarNotificacoesRecentes();
    renderizarPedidosRecentes();
});
