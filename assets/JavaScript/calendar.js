const currentDate = document.querySelector(".current-date"),
      daysTag = document.querySelector(".days"),
      prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const renderCalendar = () => {
    // Pega o usuário logado do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if(!usuarioLogado){
        console.error("Usuário não está logado.");
        return;
    }

    const chaveUsuario = `servicos_${usuarioLogado.email}`;
const historico = JSON.parse(localStorage.getItem(chaveUsuario)) || [];

    // Filtra só os serviços do usuário logado e que não estão concluídos e têm data
    const datasAgendadas = historico
      .filter(servico => 
          servico.usuarioId === usuarioLogado.id &&
          servico.status !== 'Concluído' && 
          servico.data)
      .map(servico => {
        const [ano, mes, dia] = servico.data.split("T")[0].split("-");
        return {
          dia: parseInt(dia),
          mes: parseInt(mes) - 1,
          ano: parseInt(ano)
        };
      });

    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";

    // Dias inativos do mês anterior
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    // Dias do mês atual
    for (let i = 1; i <= lastDateofMonth; i++) {
        const hoje = new Date();
        let isToday = (i === hoje.getDate() && currMonth === hoje.getMonth() && currYear === hoje.getFullYear()) ? "active" : "";

        // Marca datas agendadas só do usuário logado
        const temServico = datasAgendadas.some(d => d.dia === i && d.mes === currMonth && d.ano === currYear);
        const agendadoClass = temServico ? "scheduled" : "";

        liTag += `<li class="${isToday} ${agendadoClass}">${i}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
};

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0) {
            currMonth = 11;
            currYear -= 1;
        } else if (currMonth > 11) {
            currMonth = 0;
            currYear += 1;
        }

        renderCalendar();
    });
});
