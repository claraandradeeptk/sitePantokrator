// ==========================================================================
// ARTIGOS E FORMAÇÕES - estrutura da busca
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const formBusca = document.getElementById('formBusca');
  const campoBusca = document.getElementById('campoBusca');

  if (!formBusca || !campoBusca) return;

  formBusca.addEventListener('submit', function (evento) {
    evento.preventDefault(); // impede o recarregamento da página ao apertar Enter

    const termo = campoBusca.value.trim();

    if (!termo) return;

    // ======================================================================
    // ESPAÇO PRONTO PARA A BUSCA REAL
    // Aqui é onde entra a lógica de verdade. Alguns caminhos possíveis:
    //
    // 1) Filtrar os cards que já estão nesta página:
    //    document.querySelectorAll('.cartao-artigo, .miniatura-conteudo')
    //      .forEach(card => { ... comparar card.dataset.titulo com "termo" ... });
    //
    // 2) Redirecionar para uma página de resultados:
    //    window.location.href = 'resultados.html?q=' + encodeURIComponent(termo);
    //
    // 3) Buscar num back-end/CMS e montar os cards dinamicamente:
    //    fetch('/api/buscar?q=' + encodeURIComponent(termo)).then(...)
    //
    // Por enquanto, só deixamos o log abaixo para confirmar que o campo
    // e o envio já estão funcionando corretamente.
    // ======================================================================
    console.log('Busca disparada para:', termo);
  });
});