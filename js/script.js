// ==========================================================================
// MENU EM GAVETA (abrir/fechar)
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const botaoMenu = document.querySelector('.botao-menu');
  const botaoFechar = document.querySelector('.menu-fechar');
  const menu = document.querySelector('.menu-principal');
  const fundo = document.querySelector('.menu-fundo');

  function abrirMenu() {
    botaoMenu.classList.add('ativo');
    menu.classList.add('aberto');
    fundo.classList.add('aberto');
    document.body.style.overflow = 'hidden';
  }

  function fecharMenu() {
    botaoMenu.classList.remove('ativo');
    menu.classList.remove('aberto');
    fundo.classList.remove('aberto');
    document.body.style.overflow = '';
  }

  if (botaoMenu && menu && fundo) {
    botaoMenu.addEventListener('click', function () {
      const estaAberto = menu.classList.contains('aberto');
      estaAberto ? fecharMenu() : abrirMenu();
    });

    if (botaoFechar) {
      botaoFechar.addEventListener('click', fecharMenu);
    }

    fundo.addEventListener('click', fecharMenu);

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') fecharMenu();
    });
  }

  // ========================================================================
  // DESTACA O LINK DA PÁGINA ATUAL NO MENU
  // ========================================================================
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
  const todosLinks = document.querySelectorAll('.menu-lista a');

  todosLinks.forEach(function (link) {
    const destino = link.getAttribute('href').split('/').pop();
    if (destino === paginaAtual) {
      link.classList.add('ativo');
    }
  });

  // ========================================================================
  // BOTÃO FLUTUANTE "VOLTAR AO TOPO"
  // (substitui os antigos links "Voltar para o início da página";
  //  aparece em qualquer página que carregue este script.js)
  // ========================================================================
  iniciarBotaoTopo();
});

function iniciarBotaoTopo() {
  // injeta o CSS do botão uma única vez
  if (!document.getElementById('estilo-botao-topo')) {
    const estilo = document.createElement('style');
    estilo.id = 'estilo-botao-topo';
    estilo.textContent = `
      .botao-topo-flutuante {
        position: fixed;
        right: 1.5rem;
        bottom: 1.5rem;
        z-index: 900;
        width: 46px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 50%;
        background-color: var(--cor-dourado, #E1A523);
        color: var(--cor-marinho, #143C4B);
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
        opacity: 0;
        visibility: hidden;
        transform: translateY(12px);
        transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s, background-color 0.25s ease;
      }

      .botao-topo-flutuante.visivel {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .botao-topo-flutuante:hover {
        background-color: var(--cor-vermelho, #82322D);
        color: var(--cor-branco, #FBF9F6);
      }

      .botao-topo-flutuante svg {
        width: 20px;
        height: 20px;
      }

      @media (max-width: 480px) {
        .botao-topo-flutuante {
          right: 1rem;
          bottom: 1rem;
          width: 42px;
          height: 42px;
        }
      }
    `;
    document.head.appendChild(estilo);
  }

  // cria o botão
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'botao-topo-flutuante';
  botao.setAttribute('aria-label', 'Voltar para o início da página');
  botao.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(botao);

  // mostra o botão só depois de rolar a página, esconde perto do topo
  function alternarVisibilidade() {
    botao.classList.toggle('visivel', window.scrollY > 400);
  }

  botao.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', alternarVisibilidade);
  alternarVisibilidade();
}