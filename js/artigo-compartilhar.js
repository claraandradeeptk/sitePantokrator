/* ==========================================================================
   COMPARTILHAR - monta os links dos ícones de compartilhamento
   Uso: qualquer página com <div class="compartilhar"> contendo links
   <a data-rede="facebook|x|linkedin|whatsapp|telegram|email">
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var blocos = document.querySelectorAll('.compartilhar');
  if (!blocos.length) return; // página sem ícones: não faz nada

  var url = encodeURIComponent(window.location.href);
  var titulo = encodeURIComponent(document.title);

  var links = {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
    x:        'https://twitter.com/intent/tweet?url=' + url + '&text=' + titulo,
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
    whatsapp: 'https://wa.me/?text=' + titulo + '%20' + url,
    telegram: 'https://t.me/share/url?url=' + url + '&text=' + titulo,
    email:    'mailto:?subject=' + titulo + '&body=' + url
  };

  blocos.forEach(function (bloco) {
    bloco.querySelectorAll('a[data-rede]').forEach(function (a) {
      var rede = a.getAttribute('data-rede');
      if (links[rede]) a.href = links[rede];
    });
  });
});