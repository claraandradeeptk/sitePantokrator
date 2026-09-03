// ==========================================================================
// CARROSSEL DE EVENTOS - item central maior, loop infinito de verdade
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const carrossel = document.querySelector('.carrossel-eventos');
  if (!carrossel) return;

  const janela = carrossel.querySelector('.ce-janela');
  const pista = carrossel.querySelector('.ce-pista');
  const botaoAnterior = carrossel.querySelector('.ce-anterior');
  const botaoProximo = carrossel.querySelector('.ce-proximo');

  const itensOriginais = Array.from(pista.children);
  const total = itensOriginais.length;

  // Clona o primeiro e o último item para permitir o loop suave
  const cloneUltimo = itensOriginais[total - 1].cloneNode(true);
  const clonePrimeiro = itensOriginais[0].cloneNode(true);
  pista.insertBefore(cloneUltimo, itensOriginais[0]);
  pista.appendChild(clonePrimeiro);

  // Pista agora é: [cloneUltimo, item0, item1, ..., itemN, clonePrimeiro]
  let indice = 1; // começa no item0 real
  let animando = false;

  function atualizarClasseAtiva() {
    Array.from(pista.children).forEach(function (item, i) {
      item.classList.toggle('ativo', i === indice);
    });
  }

  function posicionar(comTransicao) {
    const todos = Array.from(pista.children);
    const larguraItem = todos[0].getBoundingClientRect().width;
    const larguraJanela = janela.getBoundingClientRect().width;
    const deslocamento = (larguraJanela / 2) - (larguraItem * (indice + 0.5));

    pista.style.transition = comTransicao ? 'transform 0.4s ease' : 'none';
    pista.style.transform = 'translateX(' + deslocamento + 'px)';
    atualizarClasseAtiva();
  }

  function saltarSeForClone() {
    const todos = Array.from(pista.children);

    if (indice === todos.length - 1) {
      // parou no clonePrimeiro -> volta pro item0 real, sem transição
      indice = 1;
      posicionar(false);
      pista.getBoundingClientRect(); // força o navegador a aplicar o "sem transição" antes do próximo clique
    } else if (indice === 0) {
      // parou no cloneUltimo -> vai pro itemN real, sem transição
      indice = total;
      posicionar(false);
      pista.getBoundingClientRect();
    }

    animando = false;
  }

  // Só reage à transição da PRÓPRIA pista, ignorando transições dos itens filhos
  pista.addEventListener('transitionend', function (evento) {
    if (evento.target !== pista) return;
    if (evento.propertyName !== 'transform') return;
    saltarSeForClone();
  });

  botaoProximo.addEventListener('click', function () {
    if (animando) return;
    animando = true;
    indice++;
    posicionar(true);
  });

  botaoAnterior.addEventListener('click', function () {
    if (animando) return;
    animando = true;
    indice--;
    posicionar(true);
  });

  window.addEventListener('resize', function () {
    posicionar(false);
  });

  posicionar(false);
});