// ==========================================================================
// PÁGINA DE EPISÓDIO (episodio.html) - serve de BASE para qualquer vídeo.
//
// Qual vídeo mostrar vem pelo endereço, por exemplo:
//   episodio.html?id=ToBfL78FujQ
// Esse "id" é o id do vídeo no YouTube. Cada card da aba Lente Católica
// (montado por artigos.js) já aponta para cá com o id certo.
//
// DE ONDE VÊM O TÍTULO E A DESCRIÇÃO (nesta ordem, o primeiro que der certo):
//   1) Do cache que a própria página de Conteúdos (artigos.js) deixa salvo
//      no navegador ao montar a lista de vídeos da playlist. É o caminho
//      normal: a pessoa clica num card em artigos.html e cai aqui.
//   2) Se não achar no cache e houver uma chave da API do YouTube (mesma
//      ideia da chave em artigos.js), busca os dados direto na API - cobre
//      o caso de alguém abrir o link do episódio direto, sem passar pelo
//      card (link compartilhado, favorito, etc.).
//   3) Sem chave, tenta só o título por "oEmbed" (não precisa de chave,
//      mas essa busca não traz a descrição do vídeo).
//   4) Se nada der certo, mostra um texto simples no lugar do título.
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {

  // Mesma playlist usada em artigos.js
  var PLAYLIST_ID = 'PLYnJwXZ8rtHxwDgIy5aG9MuHZ64td5rbJ';

  // Se você preencher a chave da API em artigos.js, cole a MESMA aqui.
  // Sem a chave, a página ainda funciona (vai pelo caminho 3 acima).
  var YOUTUBE_API_KEY = '';

  var elWrapper = document.getElementById('playerEpisodio');
  var elPlayer = document.getElementById('videoEpisodio');
  var elTitulo = document.getElementById('tituloEpisodio');
  var elDescricao = document.getElementById('descricaoEpisodio');

  if (!elPlayer || !elTitulo || !elDescricao) return;

  var id = new URLSearchParams(window.location.search).get('id');

  // ---------- sem id na URL: não há o que mostrar ----------
  if (!id) {
    if (elWrapper) elWrapper.style.display = 'none';
    elTitulo.textContent = 'Episódio não encontrado';
    elDescricao.innerHTML = '<p>Volte para a Lente Católica e escolha um episódio da lista.</p>';
    return;
  }

  // monta o player assim que se sabe o id
  // Parâmetros do player:
  //   cc_load_policy=1  -> já abre com a legenda ligada
  //   cc_lang_pref=pt   -> prefere a legenda em português
  //   hl=pt             -> menus do player em português
  //   rel=0             -> sugere só vídeos do mesmo canal no final
  // A legenda só aparece se o vídeo tiver legenda (inclusive a automática)
  // no YouTube; o botão CC do player continua permitindo ligar/desligar.
  elPlayer.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) +
                 '?list=' + encodeURIComponent(PLAYLIST_ID) +
                 '&rel=0&cc_load_policy=1&cc_lang_pref=pt&hl=pt';

  function preencherTexto(titulo, descricao) {
    elTitulo.textContent = titulo || 'Episódio';
    document.title = (titulo || 'Episódio') + ' | Pantokrator';

    elDescricao.innerHTML = '';
    if (!descricao) return; // sem descrição disponível: só fica o título

    // quebra a descrição em parágrafos (o YouTube separa por linhas em branco)
    descricao.split(/\n{2,}/).forEach(function (trecho) {
      var p = document.createElement('p');
      p.textContent = trecho.trim();
      elDescricao.appendChild(p);
    });
  }

  // ---------- 1) cache que artigos.js já deixou salvo ----------
  function lerDoCache() {
    try {
      var guardado = JSON.parse(sessionStorage.getItem('lenteCatolicaVideos'));
      var lista = guardado && guardado.videos;
      if (!lista) return null;
      var achado = lista.filter(function (v) { return v.id === id; })[0];
      return achado || null;
    } catch (erro) {
      return null;
    }
  }

  // ---------- 2) API oficial do YouTube (com chave) ----------
  function buscarNaApi() {
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet' +
              '&id=' + encodeURIComponent(id) +
              '&key=' + encodeURIComponent(YOUTUBE_API_KEY);

    return fetch(url).then(function (resposta) {
      if (!resposta.ok) throw new Error('API do YouTube respondeu ' + resposta.status);
      return resposta.json();
    }).then(function (dados) {
      var item = dados.items && dados.items[0];
      if (!item) throw new Error('Vídeo não encontrado na API');
      return { titulo: item.snippet.title, descricao: item.snippet.description };
    });
  }

  // ---------- 3) oEmbed do YouTube (sem chave, só o título) ----------
  function buscarOEmbed() {
    var url = 'https://www.youtube.com/oembed?format=json&url=' +
              encodeURIComponent('https://www.youtube.com/watch?v=' + id);

    return fetch(url).then(function (resposta) {
      if (!resposta.ok) throw new Error('oEmbed respondeu ' + resposta.status);
      return resposta.json();
    }).then(function (dados) {
      return { titulo: dados.title, descricao: '' };
    });
  }

  // ---------- segue a ordem 1 → 2/3 → aviso final ----------
  var doCache = lerDoCache();
  if (doCache) {
    preencherTexto(doCache.titulo, doCache.descricao);
    return;
  }

  elTitulo.textContent = 'Carregando episódio…';

  var primeiraTentativa = YOUTUBE_API_KEY ? buscarNaApi() : buscarOEmbed();

  primeiraTentativa
    .catch(function () {
      // se a API com chave falhar, ainda tenta o oEmbed (só título)
      return YOUTUBE_API_KEY ? buscarOEmbed() : Promise.reject();
    })
    .then(function (dados) {
      preencherTexto(dados.titulo, dados.descricao);
    })
    .catch(function (erro) {
      preencherTexto('Episódio', '');
      console.warn('Episódio: não foi possível carregar o título/descrição deste vídeo.', erro);
    });
});