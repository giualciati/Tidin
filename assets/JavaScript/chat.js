import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAlAgHF1GQbikZIzOBRGa0QxB6mMymEdKE",
    authDomain: "supportchat-41635.firebaseapp.com",
    databaseURL: "https://supportchat-41635-default-rtdb.firebaseio.com",
    projectId: "supportchat-41635",
    storageBucket: "supportchat-41635.appspot.com",
    messagingSenderId: "948605471154",
    appId: "1:948605471154:web:9ef5c32e90e5c4af11bcab",
    measurementId: "G-TMXZSNZ858"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  let usuarioChat = null;

  const chatBody = document.getElementById("chatBody");
  const chatToggle = document.getElementById("chatToggle");
  const chatHeaderToggle = document.getElementById("chatHeaderToggle");
  const formularioInicial = document.getElementById("formularioInicial");
  const chatConversa = document.getElementById("chatConversa");
  const mensagensChat = document.getElementById("mensagensChat");
  const inputMensagem = document.getElementById("inputMensagem");
  const btnEnviarMensagem = document.getElementById("btnEnviarMensagem");

  function sanitizeEmail(email) {
    return email.replace(/[.@]/g, "_");
  }

  if (chatBody) chatBody.style.display = "none";
  if (chatToggle) chatToggle.textContent = "+";

  
  if (chatHeaderToggle && chatBody && chatToggle) {
    chatHeaderToggle.addEventListener("click", () => {
      const aberto = chatBody.style.display !== "none";
      chatBody.style.display = aberto ? "none" : "flex";
      chatToggle.textContent = aberto ? "+" : "−";
    });
  } else {
    console.warn("Chat: Elementos não encontrados no DOM.");
  }

  formularioInicial.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nomeUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();
    const tipo = document.getElementById("tipoUsuario").value;

    if (!nome || !email || !tipo) {
      alert("Preencha todos os campos para iniciar o chat.");
      return;
    }

    usuarioChat = { nome, email, tipo };

    formularioInicial.style.display = "none";
    chatConversa.style.display = "flex";

    escutarMensagens();
  });

  btnEnviarMensagem.addEventListener("click", () => {
    const texto = inputMensagem.value.trim();
    if (!texto || !usuarioChat) return;

    const caminhoChat = `mensagensSuporte/${sanitizeEmail(usuarioChat.email)}`;
    const mensagensRef = ref(db, caminhoChat);

    push(mensagensRef, {
      remetente: usuarioChat.nome,
      texto,
      data: new Date().toISOString()
    }).then(() => {
      inputMensagem.value = "";
    }).catch((error) => {
      console.error("Erro ao enviar mensagem:", error);
    });
  });

  function escutarMensagens() {
    if (!usuarioChat) return;

    const caminhoChat = `mensagensSuporte/${sanitizeEmail(usuarioChat.email)}`;
    const mensagensRef = ref(db, caminhoChat);

    onValue(mensagensRef, (snapshot) => {
      const mensagens = snapshot.val() || {};
      mensagensChat.innerHTML = "";

      Object.values(mensagens).forEach(msg => {
  const div = document.createElement("div");
  div.classList.add(msg.remetente === usuarioChat.nome ? "mensagem-user" : "mensagem-admin");
  div.textContent = msg.texto;
  mensagensChat.appendChild(div);
});

      mensagensChat.scrollTop = mensagensChat.scrollHeight;
    });
  }
});
