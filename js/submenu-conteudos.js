// ==========================================================================
// SUBMENU "CONTEÚDOS" (menu em gaveta)
// Incluir em todas as páginas que tenham o menu com o submenu:
//   <script src="../js/submenu-conteudos.js"></script>
// (ou colar este código no final do script.js e não incluir este arquivo)
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.menu-item-submenu').forEach(function (item) {
    var botao = item.querySelector('.menu-submenu-botao');
    if (!botao) return;

    function definir(aberto) {
      item.classList.toggle('aberto', aberto);
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    }

    botao.addEventListener('click', function () {
      definir(!item.classList.contains('aberto'));
    });

    // já abre o submenu quando a pessoa está na página de conteúdos
    if (/artigos\.html$/.test(window.location.pathname)) {
      definir(true);
    }
  });
});