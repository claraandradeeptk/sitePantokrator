/* Cartões expansíveis da página de projetos */
(function () {
  var trilho = document.querySelector('.carrossel-trilho');
  if (!trilho) return;

  var cards = Array.prototype.slice.call(trilho.querySelectorAll('.card'));
  var reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fechar(card) {
    card.classList.remove('aberto');
    card.setAttribute('aria-expanded', 'false');
  }

  function abrir(card) {
    cards.forEach(function (c) { if (c !== card) fechar(c); });
    card.classList.add('aberto');
    card.setAttribute('aria-expanded', 'true');

    // Espera a animação de largura terminar e alinha o cartão aberto no trilho
    setTimeout(function () {
      trilho.scrollTo({
        left: card.offsetLeft - 8,
        behavior: reduzirMovimento ? 'auto' : 'smooth'
      });
    }, reduzirMovimento ? 0 : 520);
  }

  cards.forEach(function (card) {
    // Clique no cartão fechado abre; clique no "×" fecha
    card.addEventListener('click', function (e) {
      if (e.target.closest('.card-fechar')) {
        e.stopPropagation();
        fechar(card);
        card.focus();
        return;
      }
      if (!card.classList.contains('aberto')) abrir(card);
    });

    // Teclado: Enter/Espaço abre, Esc fecha
    card.addEventListener('keydown', function (e) {
      if (e.target !== card) return;
      if ((e.key === 'Enter' || e.key === ' ') && !card.classList.contains('aberto')) {
        e.preventDefault();
        abrir(card);
      } else if (e.key === 'Escape') {
        fechar(card);
      }
    });
  });

  // Setas do carrossel
  document.querySelectorAll('.carrossel-seta').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var direcao = botao.dataset.direcao === 'proximo' ? 1 : -1;
      trilho.scrollBy({
        left: direcao * 260,
        behavior: reduzirMovimento ? 'auto' : 'smooth'
      });
    });
  });
})();
/* ==========================================================================
   ONDE ESTAMOS — abre/fecha os cartões das casas de missão
   Clique ou Enter/Espaço alterna a classe "aberto", sincroniza o
   aria-expanded e troca o texto da dica (ver mais / ver menos).
   ========================================================================== */
(function () {
  var cartoes = document.querySelectorAll('.cartao-localidade');
  if (!cartoes.length) return;

  function alternar(cartao) {
    var aberto = cartao.classList.toggle('aberto');
    cartao.setAttribute('aria-expanded', aberto ? 'true' : 'false');

    var dica = cartao.querySelector('.dica-leia-mais');
    if (dica) dica.textContent = aberto ? 'Clique para ver menos' : 'Clique para ver mais';
  }

  cartoes.forEach(function (cartao) {
    cartao.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; // links (Instagram etc.) agem normalmente
      alternar(cartao);
    });

    cartao.addEventListener('keydown', function (e) {
      if (e.target !== cartao) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        alternar(cartao);
      }
    });
  });
})();