document.addEventListener("DOMContentLoaded", () => {
    // === PRESTADORES ===
    const tabelaPrestadores = document.getElementById("tabelaPrestadores");
    const filtroNomePrestador = document.getElementById("filtroNomePrestador");
    const limparPrestadores = document.getElementById("limparPrestadores");


    function renderizarTabelaPrestadores(filtroTexto = "") {
        if (!tabelaPrestadores) return;

        const prestadores = JSON.parse(localStorage.getItem("prestadores")) || [];
        tabelaPrestadores.innerHTML = "";

        prestadores
            .filter(prestador =>
                prestador.nome?.toLowerCase().includes(filtroTexto.toLowerCase())
            )
            .forEach((prestador, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${prestador.nome || ""}</td>
                    <td>${prestador.cpfcnpj || ""}</td>
                    <td>${prestador.email || ""}</td>
                    <td>${prestador.telefone || ""}</td>
                    <td>${prestador.especialidade || ""}</td>
                    <td class="menu-coluna">
                        <div class="menu-container">
                            <span class="material-icons-outlined menu-toggle-prestador" data-index="${index}">more_vert</span>
                            <ul class="menu-opcoes hidden" id="menu-prestador-${index}">
                                <li onclick="excluirPrestador(${index})">Excluir</li>
                            </ul>
                        </div>
                    </td>
                `;
                tabelaPrestadores.appendChild(tr);
            });

        // Ativa menus de três pontos
        document.querySelectorAll(".menu-toggle-prestador").forEach(toggle => {
            toggle.addEventListener("click", (e) => {
                e.stopPropagation();
                const index = toggle.getAttribute("data-index");
                const menu = document.getElementById(`menu-prestador-${index}`);
                if (menu) {
                    menu.classList.toggle("hidden");

                    document.querySelectorAll(".menu-opcoes").forEach(otherMenu => {
                        if (otherMenu !== menu) {
                            otherMenu.classList.add("hidden");
                        }
                    });
                }
            });
        });

        // Fecha menus se clicar fora
        document.addEventListener("click", () => {
            document.querySelectorAll(".menu-opcoes").forEach(menu => {
                menu.classList.add("hidden");
            });
        });
    }

    if (filtroNomePrestador) {
        filtroNomePrestador.addEventListener("input", () => renderizarTabelaPrestadores(filtroNomePrestador.value));
    }

    if (limparPrestadores) {
        limparPrestadores.addEventListener("click", () => {
            if (confirm("Deseja apagar todos os prestadores?")) {
                localStorage.removeItem("prestadores");
                renderizarTabelaPrestadores();
            }
        });
    }

    window.excluirPrestador = function (index) {
        let prestadores = JSON.parse(localStorage.getItem("prestadores")) || [];
        prestadores.splice(index, 1);
        localStorage.setItem("prestadores", JSON.stringify(prestadores));
        renderizarTabelaPrestadores(filtroNomePrestador ? filtroNomePrestador.value : "");
    };

    function atualizarContadorPrestadoresNaDashboard() {
    const linhas = document.querySelectorAll("#tabelaPrestadores tr");
    localStorage.setItem("totalPrestadores", linhas.length);
}

    renderizarTabelaPrestadores();
    atualizarContadorPrestadoresNaDashboard();


    // === Sidebar toggle - comum para todas as páginas ===
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".sidebar header .material-icons-outlined");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("close");
            toggleBtn.textContent = sidebar.classList.contains("close")
                ? "chevron_right"
                : "chevron_left";
        });
    }
});
