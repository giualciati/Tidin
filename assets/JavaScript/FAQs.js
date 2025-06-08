document.addEventListener("DOMContentLoaded", () => {
  const faqItems = [
    {
      pergunta: "Quais serviços a Tidin oferece?",
      resposta: "A Tidin oferece serviços de limpeza residencial, comercial, pós-obra, organização de ambientes e passadoria, com profissionais treinados e agendamentos flexíveis.",
    },
    {
      pergunta: "Como faço para cancelar um serviço?",
      resposta: "Você pode cancelar um serviço com até 5 dias de antecedência da data agendada. Solicitações fora desse prazo podem estar sujeitas a cobrança parcial.",
    },
    {
      pergunta: "Receberei reembolso ao cancelar um serviço?",
      resposta: "Sim. Reembolsos são processados em até 10 dias úteis após a confirmação do cancelamento, de acordo com nossa política de cancelamento.",
    },
    {
      pergunta: "Os profissionais da Tidin são confiáveis?",
      resposta: "Sim. Todos os profissionais passam por uma rigorosa seleção, treinamentos específicos e avaliações constantes para garantir a melhor experiência.",
    },
    {
      pergunta: "A Tidin atende empresas?",
      resposta: "Sim. Atendemos tanto residências quanto ambientes corporativos, oferecendo planos recorrentes e personalizados para empresas.",
    }
  ];

  const container = document.getElementById("faq-container");

  faqItems.forEach((item) => {
    const faqItem = document.createElement("div");
    faqItem.className = "faq-item";

    const question = document.createElement("div");
    question.className = "faq-question";
    question.innerHTML = `<h3>${item.pergunta}</h3><span class="arrow">+</span>`;

    const answer = document.createElement("div");
    answer.className = "faq-answer";
    answer.innerHTML = `<p>${item.resposta}</p>`;

    question.addEventListener("click", () => {
      const isExpanded = answer.classList.contains("expanded");
      answer.classList.toggle("expanded");

      // Atualiza o ícone +/−
      const arrow = question.querySelector(".arrow");
      arrow.textContent = isExpanded ? "+" : "−";
    });

    faqItem.appendChild(question);
    faqItem.appendChild(answer);
    container.appendChild(faqItem);
  });
});
