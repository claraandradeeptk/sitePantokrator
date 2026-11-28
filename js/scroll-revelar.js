// ==========================================================================
// REVELAR AO ROLAR
// Qualquer elemento com a classe "revelar" ganha a classe "visivel"
// assim que entra na tela, disparando a transição definida no CSS.
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const elementos = document.querySelectorAll('.revelar');

  if (!elementos.length) return;

  // Navegadores muito antigos sem suporte: mostra tudo direto, sem animação
  if (!('IntersectionObserver' in window)) {
    elementos.forEach(function (el) {
      el.classList.add('visivel');
    });
    return;
  }

  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observador.unobserve(entrada.target); // anima só uma vez
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  elementos.forEach(function (el) {
    observador.observe(el);
  });
});