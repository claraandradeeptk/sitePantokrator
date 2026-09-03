// Controla o abrir/fechar de cada cartão em ".grade-localidades"
// (página Onde Estamos). Cada cartão é independente dos outros.
document.querySelectorAll('.cartao-localidade').forEach((cartao) => {
  const dica = cartao.querySelector('.dica-leia-mais');

  function alternar() {
    const aberto = cartao.classList.toggle('aberto');
    cartao.setAttribute('aria-expanded', String(aberto));
    if (dica) {
      dica.textContent = aberto ? 'Clique para ver menos' : 'Clique para ver mais';
    }
  }

  cartao.addEventListener('click', alternar);

  cartao.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      alternar();
    }
  });
});