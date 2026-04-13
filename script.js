/* ============================================================
   1. CONFIGURAÇÕES INICIAIS E ESTADO GLOBAL
   ============================================================ */
let menuCompleto = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    // Contexto global para acesso em outras funções
    menuCompleto = data.cardapio;
    window.dataLoja = data;

    // Renderização inicial da Vitrine (Espetinhos de Minas)
    renderMenu(menuCompleto);

    // Inicialização do Sistema de Chat (MinasBot)
    initChatSystem();
  } catch (error) {
    console.error("Erro crítico ao carregar dados:", error);
  }
});

/* ============================================================
   2. MOTOR DE RENDERIZAÇÃO (UI GENERATION)
   ============================================================ */
function renderMenu(itens) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = itens
    .map(
      (item) => `
        <div class="product-card cat-${item.categoria}">
            <span class="card-badge">${item.categoria}</span>
            <div class="product-img-wrapper">
                <img src="${item.imagem}" class="product-img" alt="${item.nome}" loading="lazy">
            </div>
            <div class="product-info">
                <h4>${item.nome}</h4>
                <p>${item.descricao}</p>
                <div class="price-tag">R$ ${item.preco.toFixed(2).replace(".", ",")}</div>
            </div>
        </div>
    `,
    )
    .join("");
}

/* ============================================================
   3. SISTEMA DE FILTROS E NAVEGAÇÃO
   ============================================================ */
function filterMenu(categoria, event) {
  // 1. Atualização visual das Tabs (iFood Style)
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  if (event) event.currentTarget.classList.add("active");

  // 2. Lógica de filtragem do Array
  const filtrados =
    categoria === "todos"
      ? menuCompleto
      : menuCompleto.filter((i) => i.categoria === categoria);

  renderMenu(filtrados);
}

/* ============================================================
   4. CHAT IA (MINASBOT 🔥) - LÓGICA E INTERAÇÃO
   ============================================================ */
function initChatSystem() {
  const chatContainer = document.getElementById("chat-container");
  const chatToggle = document.getElementById("chat-toggle");
  const closeChatBtn = document.getElementById("close-chat");
  const sendBtn = document.getElementById("send-query");
  const userInput = document.getElementById("user-query");
  const chatMsgs = document.getElementById("chat-msgs");

  /* --- Funcionalidade: Abertura e Fechamento --- */
  const openChat = () => {
    chatContainer.classList.remove("chat-closed");
    chatContainer.classList.add("chat-open");
    userInput.focus();
  };

  const closeChat = (e) => {
    if (e) e.stopPropagation(); // Impede que o clique no X dispare abertura
    chatContainer.classList.remove("chat-open");
    chatContainer.classList.add("chat-closed");
  };

  // Listeners de Controle
  chatToggle?.addEventListener("click", openChat);
  closeChatBtn?.addEventListener("click", closeChat);

  /* --- Funcionalidade: Fluxo de Mensagens --- */
  const sendMessage = () => {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Adiciona mensagem do usuário (Direita)
    appendMessage("user", text);
    userInput.value = "";

    // 2. Feedback Visual: Bot digitando
    showTypingIndicator();

    // 3. Resposta com Delay UX (Simulando Processamento)
    setTimeout(() => {
      removeTypingIndicator();
      const response = processBotLogic(text);
      appendMessage("bot", response);
    }, 1200);
  };

  /* --- Auxiliares de Interface (Visual) --- */
  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${sender}-msg`;
    msgDiv.textContent = text;
    chatMsgs.appendChild(msgDiv);

    // Scroll automático suave para o final
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function showTypingIndicator() {
    const div = document.createElement("div");
    div.className = "msg bot-msg typing-indicator";
    div.id = "typing-temp";
    div.innerHTML = "<span>.</span><span>.</span><span>.</span>";
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function removeTypingIndicator() {
    document.getElementById("typing-temp")?.remove();
  }

  /* ============================================================
   4. CHAT IA (MINASBOT 🔥) - LÓGICA E INTERAÇÃO REFINADA
   ============================================================ */

  function processBotLogic(input) {
    const msg = input.toLowerCase();

    // 1. Início de Pedido / Saudação
    if (
      msg.includes("pedir") ||
      msg.includes("boa noite") ||
      msg.includes("quero espetinho")
    ) {
      return "Que prazer te atender! 😊 Hoje estamos trabalhando com os seguintes sabores: Carne Bovina Premium, Frango com Bacon e Queijo Coalho. Qual vai ser?";
    }

    // 2. Escolha de Opção (Primeira opção / Carne)
    if (
      msg.includes("primeira opção") ||
      msg.includes("primeira opcao") ||
      msg.includes("dois da primeira")
    ) {
      return "Excelente escolha! Carne Bovina Premium é a nossa campeã. 🔥 Deseja acompanhamento de nosso molho especial e um queijinho?";
    }

    // 3. Confirmação de Acompanhamentos
    if (msg === "sim" || msg.includes("sim quero") || msg.includes("aceito")) {
      return "Você vai adorar! 😍 O pedido ficou em R$ 89,00. Nosso entregador receberá o pagamento na maquininha (Cartão ou Pix). Posso confirmar?";
    }

    // 4. Agradecimento e Finalização
    if (
      msg.includes("obrigado") ||
      msg.includes("obrigada") ||
      msg.includes("confirmado")
    ) {
      return "Nós do Espetinho de Minas desejamos uma ótima refeição! 🥩 Em breve seu pedido chegará quentinho.";
    }

    // --- Respostas Padrão de Informação (Mantidas) ---
    if (msg.includes("cardápio") || msg.includes("menu")) {
      return "Com certeza! 🔥 Veja nossas opções na vitrine logo atrás!";
    }

    if (msg.includes("onde") || msg.includes("local") || msg.includes("jf")) {
      return "Estamos em Juiz de Fora, MG! 🚚 Atendemos nos melhores pontos da cidade.";
    }

    return "Legal! Sou o Queijinho. Como posso ajudar seu churrasco hoje? 🥩";
  }

  /* --- Eventos Globais do Chat --- */
  sendBtn?.addEventListener("click", sendMessage);

  userInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Fechar ao apertar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chatContainer.classList.contains("chat-open")) {
      closeChat();
    }
  });
}
/* --- FIM DO SCRIPT --- */
