// ==========================================================================
// CARROSSEL GENÉRICO
// Uso: <div class="carrossel" data-autoplay="5000" data-pontos="true">
//        <div class="carrossel-pista"> ...itens... </div>
//        <button class="carrossel-botao anterior">&#10094;</button>
//        <button class="carrossel-botao proximo">&#10095;</button>
//      </div>
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const carrosseis = document.querySelectorAll('.carrossel');

  carrosseis.forEach(function (carrossel) {
    const pista = carrossel.querySelector('.carrossel-pista');
    const itens = Array.from(pista.children);
    const botaoAnterior = carrossel.querySelector('.carrossel-botao.anterior');
    const botaoProximo = carrossel.querySelector('.carrossel-botao.proximo');
    const usaPontos = carrossel.dataset.pontos === 'true';
    const autoplay = parseInt(carrossel.dataset.autoplay, 10) || 0;

    // Quantos itens ficam visíveis por vez (para carrosséis tipo "cards lado a lado")
    const itensVisiveis = parseInt(carrossel.dataset.visiveis, 10) || 1;

    let indiceAtual = 0;
    const totalPassos = Math.max(itens.length - itensVisiveis + 1, 1);

    let containerPontos = null;
    if (usaPontos) {
      containerPontos = document.createElement('div');
      containerPontos.className = 'carrossel-pontos';
      for (let i = 0; i < totalPassos; i++) {
        const ponto = document.createElement('button');
        ponto.setAttribute('aria-label', 'Ir para o item ' + (i + 1));
        ponto.addEventListener('click', function () {
          irPara(i);
        });
        containerPontos.appendChild(ponto);
      }
      carrossel.insertAdjacentElement('afterend', containerPontos);
    }

    function atualizarPontos() {
      if (!containerPontos) return;
      const botoesPontos = containerPontos.querySelectorAll('button');
      botoesPontos.forEach(function (botao, i) {
        botao.classList.toggle('ativo', i === indiceAtual);
      });
    }

    function irPara(indice) {
      indiceAtual = (indice + totalPassos) % totalPassos;
      const larguraItem = itens[0].getBoundingClientRect().width;
      pista.style.transform = 'translateX(-' + (larguraItem * indiceAtual) + 'px)';
      atualizarPontos();
    }

    if (botaoProximo) {
      botaoProximo.addEventListener('click', function () {
        irPara(indiceAtual + 1);
      });
    }

    if (botaoAnterior) {
      botaoAnterior.addEventListener('click', function () {
        irPara(indiceAtual - 1);
      });
    }

    // Recalcula posição ao redimensionar a janela
    window.addEventListener('resize', function () {
      irPara(indiceAtual);
    });

    // Autoplay opcional (usado no hero)
    if (autoplay > 0) {
      setInterval(function () {
        irPara(indiceAtual + 1);
      }, autoplay);
    }

    irPara(0);
  });
});
