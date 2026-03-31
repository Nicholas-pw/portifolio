/**
 * script.js — Portfolio Nicholas Elijah
 *
 * Funcionalidades:
 * 1. Número do WhatsApp (configurável)
 * 2. Header com efeito de scroll
 * 3. Menu mobile (hambúrguer)
 * 4. Animação de fade-in ao entrar no viewport (IntersectionObserver)
 * 5. Filtro de projetos por categoria
 * 6. Funções de envio ao WhatsApp
 * 7. Validação e submissão do formulário de contato
 * 8. Máscara de telefone
 * 9. Toast de notificação
 */


/* ─────────────────────────────────────────
   1. CONFIGURAÇÃO GLOBAL
   Altere apenas aqui para atualizar o
   número em todos os links do site.
   ───────────────────────────────────────── */
const WA_NUMBER = '5521992830426'; // Número no formato internacional (sem + ou espaços)


/* ─────────────────────────────────────────
   2. HEADER — EFEITO DE SCROLL
   Adiciona a classe .scrolled ao <header>
   quando o usuário rola a página para baixo.
   O CSS usa essa classe para aplicar sombra.
   ───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  // Adiciona ou remove .scrolled dependendo da posição do scroll
  header.classList.toggle('scrolled', window.scrollY > 20);
});


/* ─────────────────────────────────────────
   3. MENU MOBILE
   Abre/fecha o menu ao clicar no hambúrguer.
   A função closeMobile() é chamada também
   pelos links internos do menu mobile.
   ───────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

// Alterna a classe .open no menu ao clicar no botão hambúrguer
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

/**
 * Fecha o menu mobile.
 * Chamada inline nos links do menu via onclick="closeMobile()"
 */
function closeMobile() {
  mobileMenu.classList.remove('open');
}


/* ─────────────────────────────────────────
   4. FADE-IN AO SCROLL (IntersectionObserver)
   Observa todos os elementos com a classe
   .fade-in e adiciona .visible quando eles
   entram no viewport (pelo menos 7% visível).
   O CSS cuida da transição de opacidade/transform.
   ───────────────────────────────────────── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Não é necessário continuar observando após revelar
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.07 } // dispara quando 7% do elemento estiver visível
);

// Registra todos os elementos com .fade-in para serem observados
document.querySelectorAll('.fade-in').forEach((el) => {
  fadeObserver.observe(el);
});


/* ─────────────────────────────────────────
   5. FILTRO DE PROJETOS
   Filtra os cards de projeto por categoria
   usando o atributo data-category nos cards
   e data-filter nos botões de filtro.
   Usa data-hidden para ocultar/exibir via CSS.
   ───────────────────────────────────────── */
const filterButtons = document.querySelectorAll('.proj-filter');
const featuredProject = document.querySelector('.proj-featured');
const projectCards = document.querySelectorAll('.proj-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Remove o estado ativo de todos os botões
    filterButtons.forEach((f) => f.classList.remove('active'));
    // Ativa apenas o botão clicado
    btn.classList.add('active');

    const selectedFilter = btn.dataset.filter; // ex: "web", "mobile", "all"

    // Controla visibilidade do projeto destaque
    if (selectedFilter === 'all' || featuredProject.dataset.category === selectedFilter) {
      delete featuredProject.dataset.hidden; // remove o atributo para exibir
    } else {
      featuredProject.dataset.hidden = true; // adiciona para ocultar (via CSS)
    }

    // Controla visibilidade de cada card da grade
    projectCards.forEach((card) => {
      if (selectedFilter === 'all' || card.dataset.category === selectedFilter) {
        delete card.dataset.hidden;
      } else {
        card.dataset.hidden = true;
      }
    });
  });
});


/* ─────────────────────────────────────────
   6. WHATSAPP — FUNÇÕES DE ENVIO
   ───────────────────────────────────────── */

/**
 * Gera a URL do WhatsApp com a mensagem codificada.
 * @param {string} text - Texto da mensagem a ser enviada
 * @returns {string} URL completa para abrir o WhatsApp
 */
function buildWAUrl(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Chamada ao clicar em um card de SERVIÇO.
 * Pré-seleciona o serviço no formulário de contato
 * e rola suavemente até a seção de contato.
 * @param {string} serviceName - Nome do serviço (deve corresponder ao value do <option>)
 */
function openContactWithService(serviceName) {
  const select = document.getElementById('f-servico');

  // Tenta selecionar a opção correspondente ao serviço clicado
  if (select) {
    for (let option of select.options) {
      if (option.value === serviceName) {
        select.value = serviceName;
        break;
      }
    }
  }

  // Rola a página até a seção de contato
  document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });

  // Foca no campo de nome após a animação de scroll
  setTimeout(() => {
    document.getElementById('f-nome').focus();
  }, 600);
}

/**
 * Chamada ao clicar em um card de PROJETO.
 * Abre o WhatsApp com uma mensagem referenciando
 * o projeto específico que o usuário se interessou.
 * @param {string} projectName - Nome do projeto exibido no card
 */
function sendProjectWA(projectName) {
  const message =
`Olá, Nicholas! 👋

Vi seu portfólio e me interessei pelo projeto *${projectName}*.

Gostaria de conversar sobre algo semelhante para o meu negócio.

Pode me dar mais detalhes ou conversarmos sobre como seria um projeto assim?`;

  window.open(buildWAUrl(message), '_blank');
}


/* ─────────────────────────────────────────
   7. FORMULÁRIO DE CONTATO
   Valida os campos obrigatórios e monta
   uma mensagem formatada para o WhatsApp.
   ───────────────────────────────────────── */

/**
 * Valida um campo individual do formulário.
 * Adiciona/remove a classe .has-error no grupo pai,
 * o que faz o CSS exibir a mensagem de erro.
 *
 * @param {string} groupId - ID do elemento .form-group (ex: "group-nome")
 * @param {boolean} condition - true = válido, false = inválido
 * @returns {boolean} Resultado da validação
 */
function validateField(groupId, condition) {
  const group = document.getElementById(groupId);
  if (!group) return true; // campo não existe, ignora

  if (condition) {
    group.classList.remove('has-error'); // campo válido
    return true;
  } else {
    group.classList.add('has-error'); // campo inválido — CSS mostra o erro
    return false;
  }
}

/**
 * Handler do submit do formulário.
 * 1. Previne o comportamento padrão (reload)
 * 2. Coleta os valores dos campos
 * 3. Valida os campos obrigatórios
 * 4. Monta a mensagem formatada
 * 5. Abre o WhatsApp com a mensagem
 *
 * @param {Event} e - Evento de submit do formulário
 */
function handleFormSubmit(e) {
  e.preventDefault(); // evita o reload da página

  // ── Coleta dos valores ──
  const nome      = document.getElementById('f-nome').value.trim();
  const empresa   = document.getElementById('f-empresa').value.trim();
  const whatsapp  = document.getElementById('f-whatsapp').value.trim();
  const email     = document.getElementById('f-email').value.trim();
  const servico   = document.getElementById('f-servico').value;
  const prazo     = document.getElementById('f-prazo').value;
  const descricao = document.getElementById('f-descricao').value.trim();

  // ── Validação dos campos obrigatórios ──
  // Retorna false se algum campo falhar; acumula todos os erros de uma vez
  let isValid = true;
  isValid = validateField('group-nome',      nome.length >= 2)       && isValid;
  isValid = validateField('group-whatsapp',  whatsapp.length >= 8)   && isValid;
  isValid = validateField('group-servico',   servico !== '')          && isValid;
  isValid = validateField('group-descricao', descricao.length >= 10) && isValid;

  // Se algum campo falhou, exibe toast de erro e para aqui
  if (!isValid) {
    showToast('Preencha todos os campos obrigatórios (*).', 'error');
    return;
  }

  // ── Montagem da mensagem formatada ──
  // Usa separadores visuais para organizar as informações no WhatsApp
  let msg = `Olá, Nicholas! 👋 Vi seu portfólio e quero conversar sobre um projeto.\n\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👤 *DADOS DO CLIENTE*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `• Nome: ${nome}\n`;
  if (empresa)  msg += `• Empresa: ${empresa}\n`;   // só adiciona se preenchido
  msg += `• WhatsApp: ${whatsapp}\n`;
  if (email)    msg += `• E-mail: ${email}\n`;       // só adiciona se preenchido

  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📋 *DETALHES DO PROJETO*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `• Tipo: ${servico}\n`;
  if (prazo)    msg += `• Prazo desejado: ${prazo}\n`; // só adiciona se selecionado

  msg += `\n📝 *DESCRIÇÃO:*\n${descricao}\n`;
  msg += `\nAguardo seu retorno!`;

  // ── Abre o WhatsApp ──
  window.open(buildWAUrl(msg), '_blank');

  // ── Feedback visual ──
  showToast('WhatsApp aberto! Confirme o envio da mensagem. 🚀', 'success');
}

// Vincula o handler ao evento submit do formulário
document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);

// Limpa o estado de erro assim que o usuário começa a digitar/selecionar
// (melhora a experiência ao corrigir campos inválidos)
['f-nome', 'f-whatsapp', 'f-servico', 'f-descricao'].forEach((fieldId) => {
  const el = document.getElementById(fieldId);
  if (!el) return;

  el.addEventListener('input', () => {
    // Converte o id do campo para o id do grupo (ex: f-nome → group-nome)
    const groupId = 'group-' + fieldId.replace('f-', '');
    const group = document.getElementById(groupId);
    if (group) group.classList.remove('has-error');
  });
});


/* ─────────────────────────────────────────
   8. MÁSCARA DE TELEFONE
   Formata o campo de WhatsApp automaticamente
   enquanto o usuário digita:
   Ex: 21999990000 → (21) 99999-0000
   ───────────────────────────────────────── */
document.getElementById('f-whatsapp').addEventListener('input', function () {
  // Remove tudo que não for dígito e limita a 11 caracteres
  let digits = this.value.replace(/\D/g, '').slice(0, 11);

  // Aplica máscara progressiva: (XX) XXXXX-XXXX
  if (digits.length > 2)  digits = '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
  if (digits.length > 10) digits = digits.slice(0, 10) + '-' + digits.slice(10);

  this.value = digits;
});


/* ─────────────────────────────────────────
   9. TOAST DE NOTIFICAÇÃO
   Exibe uma notificação temporária no
   canto inferior direito da tela.
   Remove automaticamente após 4 segundos.
   ───────────────────────────────────────── */

/**
 * Exibe um toast de notificação.
 * @param {string} message - Texto a exibir no toast
 * @param {'success'|'error'} type - Tipo: define a cor do ícone
 */
function showToast(message, type = 'success') {
  const toast   = document.getElementById('toast');
  const icon    = document.getElementById('toastIcon');
  const msgEl   = document.getElementById('toastMsg');

  // Define o texto da mensagem
  msgEl.textContent = message;

  // Define a classe de estilo (success = verde, error = vermelho)
  toast.className = `toast ${type}`;

  // Troca o SVG do ícone conforme o tipo
  if (type === 'success') {
    // Ícone de check (✓)
    icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
  } else {
    // Ícone de alerta (!)
    icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="12" y1="20" x2="12.01" y2="20"/>';
  }

  // Força um reflow antes de adicionar .show para a transição CSS funcionar
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove o toast após 4 segundos
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}