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