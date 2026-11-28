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

// ==========================================================================
// ABAS DE CONTEÚDO (Artigos / Formação / Oração / Notícia)
// A aba aberta acompanha o endereço:
//   #artigos  #formacao  #oracao  #noticia
// e cada oração tem o seu link direto, que abre a aba Oração e expande a oração:
//   #oracao-coroa-das-lagrimas  #oracao-terco-tap
//   #oracao-novena-teresinha    #oracao-novena-sjpii
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  var abas = Array.prototype.slice.call(document.querySelectorAll('.aba'));
  var paineis = Array.prototype.slice.call(document.querySelectorAll('.painel-aba'));
  var oracoes = Array.prototype.slice.call(document.querySelectorAll('.oracao'));
  var barra = document.getElementById('conteudos-abas');

  if (!abas.length || !barra) return;

  var nomes = abas.map(function (a) { return a.getAttribute('data-aba'); });

  function trocarEndereco(hash) {
    try {
      history.replaceState(null, '', hash);
    } catch (erro) { /* abrindo o arquivo direto do computador: ignora */ }
  }

  function ativar(nome) {
    abas.forEach(function (aba) {
      var ativa = aba.getAttribute('data-aba') === nome;
      aba.classList.toggle('ativa', ativa);
      aba.setAttribute('aria-selected', ativa ? 'true' : 'false');
      aba.setAttribute('tabindex', ativa ? '0' : '-1');
    });

    paineis.forEach(function (painel) {
      var ativo = painel.id === 'painel-' + nome;
      painel.hidden = !ativo;
      painel.classList.toggle('ativo', ativo);
    });
  }

  // descobre o que o endereço pede: uma aba ou uma oração específica
  function lerEndereco() {
    var id = window.location.hash.replace('#', '');
    if (!id) return null;

    if (nomes.indexOf(id) !== -1) return { aba: id, oracao: null };

    var alvo = document.getElementById(id);
    if (alvo && alvo.classList.contains('oracao')) return { aba: 'oracao', oracao: alvo };

    return null;
  }

  function aplicarEndereco() {
    var pedido = lerEndereco();
    if (!pedido) return false;

    ativar(pedido.aba);
    if (pedido.oracao) pedido.oracao.open = true;

    setTimeout(function () {
      (pedido.oracao || barra).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

    return true;
  }

  // ---------- clique nas abas ----------
  abas.forEach(function (aba) {
    aba.addEventListener('click', function () {
      var nome = aba.getAttribute('data-aba');
      ativar(nome);
      trocarEndereco('#' + nome);
    });
  });

  // ---------- teclado: setas, Home e End trocam de aba ----------
  barra.addEventListener('keydown', function (e) {
    var atual = abas.indexOf(document.activeElement);
    if (atual === -1) return;

    var destino = null;
    if (e.key === 'ArrowRight') destino = (atual + 1) % abas.length;
    if (e.key === 'ArrowLeft') destino = (atual - 1 + abas.length) % abas.length;
    if (e.key === 'Home') destino = 0;
    if (e.key === 'End') destino = abas.length - 1;

    if (destino !== null) {
      e.preventDefault();
      abas[destino].focus();
      abas[destino].click();
    }
  });

  // ---------- orações: abre uma de cada vez ----------
  // (o atributo name="oracoes" já faz isso nos navegadores novos;
  //  este código garante o mesmo nos mais antigos)
  oracoes.forEach(function (oracao) {
    oracao.addEventListener('toggle', function () {
      if (oracao.open) {
        oracoes.forEach(function (outra) {
          if (outra !== oracao) outra.open = false;
        });
        trocarEndereco('#' + oracao.id);

        // garante que o início da oração aberta fique visível
        setTimeout(function () {
          oracao.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
      } else if (window.location.hash === '#' + oracao.id) {
        trocarEndereco('#oracao');
      }
    });
  });

  // ---------- ao carregar a página (vindo do submenu ou de um link direto) ----------
  aplicarEndereco();

  // ---------- clicou num link do menu estando já nesta página ----------
  window.addEventListener('hashchange', function () {
    if (!aplicarEndereco()) return;

    var fecharMenu = document.querySelector('.menu-fechar');
    if (fecharMenu) fecharMenu.click(); // fecha a gaveta do menu
  });
});

// ==========================================================================
// ABA LENTE CATÓLICA - capas dos vídeos da playlist do YouTube
// Cada card mostra só a capa (thumbnail vinda do próprio YouTube) e leva
// para episodio.html?id=..., que mostra o vídeo e, embaixo, o título e a
// descrição (veja js/paginas/episodio.js). Essa página serve de base para
// qualquer vídeo: muda só o "id" no endereço.
//
// COMO FUNCIONA A LISTA
//   Com a chave da API do YouTube preenchida (YOUTUBE_API_KEY), a página lê a
//   playlist inteira sozinha e mostra TODOS os vídeos cujo título contém
//   FILTRO_TITULO (ignora maiúsculas e acentos). Vídeo novo na playlist aparece
//   sem mexer no código. A lista só é carregada quando a aba é aberta.
//
//   Sem a chave (ou se a API falhar), aparece a lista VIDEOS_RESERVA abaixo.
//
// COMO CRIAR A CHAVE (grátis):
//   1) console.cloud.google.com > criar projeto > "APIs e serviços" > Biblioteca
//   2) ativar "YouTube Data API v3"
//   3) Credenciais > Criar credenciais > Chave de API
//   4) restringir a chave: "Restrições de aplicativo" > Sites (referenciadores HTTP)
//      > colocar o endereço do site; "Restrições de API" > só YouTube Data API v3
//   5) colar a chave em YOUTUBE_API_KEY abaixo
//   (a chave fica visível no código da página; por isso a restrição do passo 4)
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  var grade = document.getElementById('gradeVideos');
  var painel = document.getElementById('painel-lente-catolica');
  var aba = document.getElementById('aba-lente-catolica');
  if (!grade || !painel) return;

  var PLAYLIST_ID = 'PLYnJwXZ8rtHxwDgIy5aG9MuHZ64td5rbJ';
  var YOUTUBE_API_KEY = '';                    // <- cole aqui a chave da API
  var FILTRO_TITULO = 'Prof. Raphael Tonon';   // só vídeos com isto no título ('' = todos)
  var HORAS_DE_CACHE = 6;                      // evita pedir a playlist toda vez

  // Lista de reserva (usada só sem a chave ou se a API falhar)
  // "descricao" é o texto que aparece em episodio.html, embaixo do vídeo.
  // Cole aqui a descrição de cada vídeo (a mesma que está no YouTube) - por
  // enquanto está vazia, então a página do episódio mostra só o título.
  var VIDEOS_RESERVA = [
    { id: 'ToBfL78FujQ', titulo: 'Os 7 SACRAMENTOS: meios da SUA SALVAÇÃO!', descricao: '' },
    { id: 'WWRm9Z57-ys', titulo: 'Sacramentos e Sacramentais: O QUE SÃO?', descricao: '' },
    { id: '4ZfhTDRnu_Q', titulo: 'MATRIMÔNIO CATÓLICO: esse SEGREDO MUDA TUDO!', descricao: '' },
    { id: 'vHJnVsGxXsw', titulo: 'A CRUZ, a MISSA e a VIDA CRISTÃ', descricao: '' },
    { id: 'jeGrvxzgkcM', titulo: 'CONCLAVE: o PAPA é escolhido por DEUS?', descricao: '' },
    { id: 'EuFPnVZr8Zo', titulo: 'COMUNICAÇÃO com os MORTOS: O que BÍBLIA DIZ?', descricao: '' },
    { id: 'lRzQtcUYeiQ', titulo: 'Entenda o PODER da EUCARISTIA em nós', descricao: '' },
    { id: 'bJQDmgMWH_k', titulo: 'O PURGATÓRIO e as SAGRADAS ESCRITURAS', descricao: '' }
  ];

  var iniciou = false;

  function normalizar(texto) {
    return (texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function mostrarAviso(titulo, texto) {
    grade.innerHTML = '';
    var aviso = document.createElement('div');
    aviso.className = 'aba-vazia';
    var forte = document.createElement('strong');
    forte.textContent = titulo;
    aviso.appendChild(forte);
    aviso.appendChild(document.createTextNode(texto));
    grade.appendChild(aviso);
  }

  function montar(videos) {
    grade.innerHTML = '';
    if (!videos.length) {
      mostrarAviso('Novos vídeos em breve', 'Estamos preparando este espaço. Volte em breve!');
      return;
    }

    videos.forEach(function (video) {
      var link = document.createElement('a');
      link.className = 'cartao-video';
      // Antes abria o vídeo direto no YouTube; agora abre a página do
      // episódio (episodio.html), que mostra o vídeo e, embaixo, o título
      // e a descrição. Como é a mesma aba, o cache desta lista (guardado
      // logo abaixo, em guardarCache) continua disponível lá para preencher
      // o texto sem precisar buscar tudo de novo.
      link.href = 'episodio.html?id=' + encodeURIComponent(video.id);
      link.title = video.titulo;                                  // aparece ao passar o mouse
      link.setAttribute('aria-label', 'Assistir: ' + video.titulo);
      link.setAttribute('data-titulo', video.titulo);             // pronto para a busca filtrar os cards

      var imagem = document.createElement('img');
      imagem.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(video.id) + '/hqdefault.jpg';
      imagem.alt = '';
      imagem.loading = 'lazy';

      link.appendChild(imagem);
      grade.appendChild(link);
    });
  }

  // lê a playlist inteira, 50 vídeos por vez
  function lerPlaylist(pagina, acumulado) {
    var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50' +
              '&playlistId=' + encodeURIComponent(PLAYLIST_ID) +
              '&key=' + encodeURIComponent(YOUTUBE_API_KEY) +
              (pagina ? '&pageToken=' + encodeURIComponent(pagina) : '');

    return fetch(url).then(function (resposta) {
      if (!resposta.ok) throw new Error('API do YouTube respondeu ' + resposta.status);
      return resposta.json();
    }).then(function (dados) {
      (dados.items || []).forEach(function (item) {
        var s = item.snippet || {};
        var id = s.resourceId && s.resourceId.videoId;
        if (!id || s.title === 'Private video' || s.title === 'Deleted video') return;
        // a própria playlist já traz a descrição do vídeo junto com o título
        acumulado.push({ id: id, titulo: s.title, descricao: s.description || '' });
      });
      return dados.nextPageToken ? lerPlaylist(dados.nextPageToken, acumulado) : acumulado;
    });
  }

  function filtrar(videos) {
    var filtro = normalizar(FILTRO_TITULO);
    if (!filtro) return videos;
    return videos.filter(function (v) { return normalizar(v.titulo).indexOf(filtro) !== -1; });
  }

  function lerCache() {
    try {
      var guardado = JSON.parse(sessionStorage.getItem('lenteCatolicaVideos'));
      if (guardado && Date.now() - guardado.quando < HORAS_DE_CACHE * 3600000) return guardado.videos;
    } catch (erro) { /* sem cache: segue em frente */ }
    return null;
  }

  function guardarCache(videos) {
    try {
      sessionStorage.setItem('lenteCatolicaVideos', JSON.stringify({ quando: Date.now(), videos: videos }));
    } catch (erro) { /* ignora */ }
  }

  function iniciar() {
    if (iniciou) return;
    iniciou = true;

    if (!YOUTUBE_API_KEY) {
      montar(VIDEOS_RESERVA);
      return;
    }

    var emCache = lerCache();
    if (emCache) {
      montar(filtrar(emCache));
      return;
    }

    mostrarAviso('Carregando vídeos…', '');
    lerPlaylist('', []).then(function (todos) {
      guardarCache(todos);
      montar(filtrar(todos));
    }).catch(function (erro) {
      console.warn('Lente Católica: não foi possível ler a playlist, usando a lista de reserva.', erro);
      montar(VIDEOS_RESERVA);
    });
  }

  // só carrega quando a aba está aberta (clique, link direto #lente-catolica ou botões do menu)
  function verificar() { if (!painel.hidden) iniciar(); }

  if (aba) aba.addEventListener('click', function () { setTimeout(verificar, 0); });
  window.addEventListener('hashchange', function () { setTimeout(verificar, 0); });
  verificar();
});