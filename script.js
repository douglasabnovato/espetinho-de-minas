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

    // Renderização inicial: Carrega todos os produtos
    renderMenu(menuCompleto);

    // Inicializa os componentes de interface
    setupChat();
  } catch (error) {
    console.error("Erro crítico ao carregar data.json:", error);
  }
});
/* --- FIM INICIALIZAÇÃO --- */

/* ============================================================
   2. MOTOR DE RENDERIZAÇÃO (UI GENERATION)
   ============================================================ */
function renderMenu(itens) {
  const grid = document.getElementById("product-grid");

  // Mapeia o JSON para o HTML dos cards (Estilo iFood)
  grid.innerHTML = itens
    .map(
      (item) => `
    <div class="product-card cat-${item.categoria}">
        <span class="card-badge">${item.categoria}</span>
        <div class="product-img-wrapper">
            <img src="${item.imagem}" class="product-img" alt="${item.nome}" loading="lazy">
        </div>
        <div class="product-info">
            <div>
                <h4>${item.nome}</h4>
                <p>${item.descricao}</p>
            </div>
            <div class="price-tag">
                R$ ${item.preco.toFixed(2).replace(".", ",")}
            </div>
        </div>
    </div>
  `,
    )
    .join("");
}
/* --- FIM RENDERIZAÇÃO --- */

/* ============================================================
   3. SISTEMA DE FILTROS E NAVEGAÇÃO
   ============================================================ */
function filterMenu(categoria) {
  // 1. Atualiza visualmente os botões (Tabs)
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Usa o target do evento atual para adicionar a classe active
  if (event) {
    event.target.classList.add("active");
  }

  // 2. Lógica de filtragem do Array
  if (categoria === "todos") {
    renderMenu(menuCompleto);
  } else {
    const filtrados = menuCompleto.filter((i) => i.categoria === categoria);
    renderMenu(filtrados);
  }
}
/* --- FIM FILTROS --- */

/* ============================================================
   4. CHAT IA (WIDGET E LÓGICA DE RESPOSTA)
   ============================================================ */
function setupChat() {
  const toggle = document.getElementById("chat-toggle");
  const container = document.getElementById("chat-container");
  const input = document.getElementById("user-query");
  const send = document.getElementById("send-query");

  // Abrir/Fechar Janela
  toggle.onclick = () => container.classList.toggle("chat-closed");

  // Envio de mensagem
  send.onclick = () => {
    const query = input.value.trim();
    if (!query) return;

    appendMsg("user", query);
    input.value = "";

    // Simula tempo de resposta da "IA"
    setTimeout(() => {
      const resposta = processarIA(query.toLowerCase());
      appendMsg("bot", resposta);
    }, 600);
  };

  // Atalho: Enviar com a tecla Enter
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") send.click();
  });

  // Adicione isso dentro da função setupChat()
  const closeBtn = document.getElementById("close-chat");

  closeBtn.onclick = () => {
    container.classList.add("chat-closed");
  };
}

function appendMsg(sender, text) {
  const msgs = document.getElementById("chat-msgs");
  const div = document.createElement("div");
  div.className = `msg ${sender}-msg`;
  div.innerText = text;
  msgs.appendChild(div);

  // Auto-scroll para a última mensagem
  msgs.scrollTop = msgs.scrollHeight;
}

function processarIA(query) {
  const data = window.dataLoja;

  // Base de Conhecimento Dinâmica (vinda do data.json)
  if (
    query.includes("cartão") ||
    query.includes("aceita") ||
    query.includes("pagar")
  ) {
    return data.empresa.faq.cartao;
  }

  if (
    query.includes("combo") ||
    query.includes("promo") ||
    query.includes("oferta")
  ) {
    return "O Combo Especial é: 3 clássicos por apenas R$ 20,00! 🔥";
  }

  if (
    query.includes("onde") ||
    query.includes("local") ||
    query.includes("endereço")
  ) {
    return "Estamos em Juiz de Fora! O Food Truck circula pelos melhores pontos da cidade.";
  }

  return `Olá! Sou o assistente do Espetinho de Minas. Como posso ajudar você hoje?`;
}
/* --- FIM CHAT IA --- */
