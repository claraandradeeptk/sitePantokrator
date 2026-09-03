document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.carrossel-livros').forEach(function (carrossel) {
    var janela = carrossel.querySelector('.cl-janela');
    var pista = carrossel.querySelector('.cl-pista');
    var itens = pista.querySelectorAll('.cl-item');
    var botaoAnterior = carrossel.querySelector('.cl-seta.anterior');
    var botaoProximo = carrossel.querySelector('.cl-seta.proximo');
    var pontosContainer = carrossel.parentElement.querySelector('.carrossel-pontos.livros-pontos');

    var pagina = 0;

    function itensPorPagina() {
      var largura = window.innerWidth;
      if (largura <= 560) return 1;
      if (largura <= 860) return 2;
      return 3;
    }

    function totalPaginas() {
      return Math.max(1, Math.ceil(itens.length / itensPorPagina()));
    }

    function criarPontos() {
      if (!pontosContainer) return;
      pontosContainer.innerHTML = '';
      var total = totalPaginas();
      for (var i = 0; i < total; i++) {
        (function (indice) {
          var ponto = document.createElement('button');
          ponto.setAttribute('aria-label', 'Ir para a página ' + (indice + 1));
          if (indice === pagina) ponto.classList.add('ativo');
          ponto.addEventListener('click', function () {
            irParaPagina(indice);
          });
          pontosContainer.appendChild(ponto);
        })(i);
      }
    }

    function atualizarPontos() {
      if (!pontosContainer) return;
      pontosContainer.querySelectorAll('button').forEach(function (p, i) {
        p.classList.toggle('ativo', i === pagina);
      });
    }

    function mover() {
      var deslocamento = pagina * janela.clientWidth;
      pista.style.transform = 'translateX(-' + deslocamento + 'px)';
      atualizarPontos();
    }

    function irParaPagina(indice) {
      var total = totalPaginas();
      pagina = Math.max(0, Math.min(indice, total - 1));
      mover();
    }

    if (botaoAnterior) {
      botaoAnterior.addEventListener('click', function () {
        var total = totalPaginas();
        pagina = (pagina - 1 + total) % total;
        mover();
      });
    }

    if (botaoProximo) {
      botaoProximo.addEventListener('click', function () {
        var total = totalPaginas();
        pagina = (pagina + 1) % total;
        mover();
      });
    }

    window.addEventListener('resize', function () {
      pagina = Math.min(pagina, totalPaginas() - 1);
      criarPontos();
      mover();
    });

    criarPontos();
    mover();
  });
});