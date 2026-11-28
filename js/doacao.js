// ==========================================================================
// MODAL "FAÇA SUA DOAÇÃO"
// Abre com qualquer elemento que tenha o atributo data-abrir-doacao
// (o botão "Doar" da barra de apoio já vem com esse atributo).
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  var fundo = document.getElementById('doacaoFundo');
  if (!fundo) return;

  var fechar = document.getElementById('doacaoFechar');

  function abrirModal() {
    fundo.classList.add('aberto');
    document.body.style.overflow = 'hidden';
  }

  function fecharModal() {
    fundo.classList.remove('aberto');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-abrir-doacao]').forEach(function (botao) {
    botao.addEventListener('click', abrirModal);
  });

  fechar.addEventListener('click', fecharModal);

  fundo.addEventListener('click', function (evento) {
    if (evento.target === fundo) fecharModal();
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') fecharModal();
  });

  // alterna o método de pagamento selecionado (cartão / boleto / pix)
  document.querySelectorAll('.doacao-metodo').forEach(function (botao) {
    botao.addEventListener('click', function () {
      document.querySelectorAll('.doacao-metodo').forEach(function (b) {
        b.classList.remove('ativo');
      });
      botao.classList.add('ativo');
    });
  });

  // alterna o valor de doação selecionado (R$20 / R$60 / R$80 / Outro)
  document.querySelectorAll('.doacao-valor').forEach(function (botao) {
    botao.addEventListener('click', function () {
      document.querySelectorAll('.doacao-valor').forEach(function (b) {
        b.classList.remove('ativo');
      });
      botao.classList.add('ativo');
    });
  });
});