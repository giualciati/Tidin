function adicionarNotificacao(mensagem) {
    const notificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];
    const novaNotificacao = {
        mensagem,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    notificacoes.push(novaNotificacao);
    localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
}
function mostrarNotificacoes() {
    const notificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];
    const container = document.getElementById("containerNotificacoes");

    while (container.children.length > 1) {
        container.removeChild(container.lastChild);
    }

    if (notificacoes.length === 0) {
        const vazio = document.createElement("p");
        vazio.textContent = "Nenhuma atualização recente.";
        vazio.style.color = "#777";
        container.appendChild(vazio);
        return;
    }

    notificacoes.slice(-5).reverse().forEach(noti => {  
        const updateDiv = document.createElement("div");
        updateDiv.classList.add("update");

        const profilePhotoDiv = document.createElement("div");
        profilePhotoDiv.classList.add("profile-photo");
        const img = document.createElement("img");
        img.src = "assets/img/images.png";
        img.alt = "profile";
        profilePhotoDiv.appendChild(img);

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        const p = document.createElement("p");
        p.innerHTML = `<b>Admin</b> - ${noti.mensagem}`;

        const small = document.createElement("small");
        small.classList.add("text-muted");
        small.textContent = noti.hora;

        messageDiv.appendChild(p);
        messageDiv.appendChild(small);

        updateDiv.appendChild(profilePhotoDiv);
        updateDiv.appendChild(messageDiv);

        container.appendChild(updateDiv);
    });
}

document.addEventListener("DOMContentLoaded", mostrarNotificacoes);