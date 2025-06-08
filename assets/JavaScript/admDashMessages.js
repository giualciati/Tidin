let usuarioSelecionado = null;

function formatarEmail(chave) {
  const partes = chave.split('_');
  if (partes.length >= 3) {
    return `${partes[0]}@${partes[1]}.${partes.slice(2).join('.')}`;
  }
  return chave;
}

function carregarUsuarios() {
  const lista = document.getElementById("userList");
  const dbRef = window.ref(window.db, 'mensagensSuporte');
  const visualizacoesRef = window.ref(window.db, 'visualizacoesAdmin');

  window.onValue(dbRef, snapshot => {
    const data = snapshot.val() || {};

    window.onValue(visualizacoesRef, visSnap => {
      const visualizacoes = visSnap.val() || {};
      lista.innerHTML = '';

      Object.keys(data).forEach(chaveEmail => {
        const mensagens = Object.values(data[chaveEmail]);
        const ultimaVisualizacao = new Date(visualizacoes[chaveEmail] || 0);

        let naoLidas = 0;
        mensagens.forEach(msg => {
          if (msg.remetente !== "admin" && new Date(msg.data) > ultimaVisualizacao) {
            naoLidas++;
          }
        });

        const emailOriginal = formatarEmail(chaveEmail);

        const li = document.createElement("li");
        li.classList.add("user-item");
        li.innerHTML = `
          ${emailOriginal}
          ${naoLidas > 0 ? `<span class="badge">${naoLidas}</span>` : ""}
        `;
        li.onclick = () => selecionarUsuario(chaveEmail);
        lista.appendChild(li);
      });
    });
  });
}

function selecionarUsuario(chaveEmail) {
  usuarioSelecionado = chaveEmail;
  const emailOriginal = formatarEmail(chaveEmail);

  const placeholder = document.getElementById("chatPlaceholder");
  const chatMessages = document.getElementById("chatMessages");
  const chatHeader = document.getElementById("chatHeader");

  chatHeader.innerHTML = `Chat com ${emailOriginal} <button class="close-btn" onclick="fecharChat()">×</button>`;
  placeholder.style.display = "none";
  chatMessages.style.display = "flex";

  carregarMensagens(chaveEmail);

  const itens = document.querySelectorAll("#userList li");
  itens.forEach(li => li.classList.remove("active"));
  [...itens].find(li => li.textContent.includes(emailOriginal))?.classList.add("active");

  document.querySelector(".chat-section").classList.add("open");
}

function carregarMensagens(chaveEmail) {
  const chat = document.getElementById("chatMessages");
  const chatRef = window.ref(window.db, `mensagensSuporte/${chaveEmail}`);

  window.onValue(chatRef, snapshot => {
    chat.innerHTML = '';
    const mensagens = snapshot.val() || {};

    const mensagensOrdenadas = Object.values(mensagens).sort((a, b) => new Date(a.data) - new Date(b.data));

    mensagensOrdenadas.forEach(msg => {
      const div = document.createElement("div");
      div.classList.add(msg.remetente === "admin" ? "mensagem-admin" : "mensagem-user");
      div.textContent = msg.texto;
      chat.appendChild(div);
    });

    chat.scrollTop = chat.scrollHeight;
  });

  const visualizacaoRef = window.ref(window.db, `visualizacoesAdmin/${chaveEmail}`);
  window.set(visualizacaoRef, new Date().toISOString());
}

function fecharChat() {
  document.getElementById("chatMessages").style.display = "none";
  document.getElementById("chatPlaceholder").style.display = "flex";
  document.getElementById("chatHeader").textContent = "Selecione um usuário";
}

function enviarMensagem() {
  const input = document.getElementById("chatInput");
  const texto = input.value.trim();
  if (!texto || !usuarioSelecionado) return;

  const mensagensRef = window.ref(window.db, `mensagensSuporte/${usuarioSelecionado}`);

  window.push(mensagensRef, {
    remetente: "admin",
    texto: texto,
    data: new Date().toISOString()
  });

  input.value = "";
}

window.addEventListener("DOMContentLoaded", carregarUsuarios);
