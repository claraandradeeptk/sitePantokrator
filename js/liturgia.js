/* =====================================================
   LITURGIA DIÁRIA  |  js/liturgia.js
   Consulta https://liturgia.up.railway.app/v3/
   ===================================================== */
(function () {
  'use strict';

  var API = 'https://liturgia.up.railway.app/v3/';
  var MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  var MESES_CHEIOS = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  var CORES = {
    verde: '#2e9e5b',
    vermelho: '#c0392b',
    roxo: '#6f42a1',
    rosa: '#e07aa3',
    branco: '#ffffff'
  };
  var FONTE_MIN = 0.85, FONTE_MAX = 1.6, FONTE_PASSO = 0.1;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    pagina: document.querySelector('.lit-pagina'),
    dia: $('lit-data-dia'),
    mes: $('lit-data-mes'),
    ano: $('lit-data-ano'),
    abrirCal: $('lit-abrir-calendario'),
    cal: $('lit-calendario'),
    calTitulo: $('lit-cal-titulo'),
    calDias: $('lit-cal-dias'),
    calAnterior: $('lit-cal-anterior'),
    calProximo: $('lit-cal-proximo'),
    anterior: $('lit-dia-anterior'),
    proximo: $('lit-dia-proximo'),
    hoje: $('lit-hoje'),
    celebracoes: $('lit-celebracoes'),
    corNome: $('lit-cor-nome'),
    titulo: $('lit-titulo'),
    abas: $('lit-abas'),
    conteudo: $('lit-conteudo'),
    fonteMais: $('lit-fonte-mais'),
    fonteMenos: $('lit-fonte-menos')
  };

  var estado = { iso: null, dados: null, celebracao: 0, aba: 0, opcao: 0, pedido: 0 };
  var cache = {};
  var cal = { ano: 0, mes: 0 }; // mês exibido no calendário

  /* ---------- Datas (sempre no horário local do visitante) ---------- */
  function doisDigitos(n) { return (n < 10 ? '0' : '') + n; }

  function paraISO(d) {
    return d.getFullYear() + '-' + doisDigitos(d.getMonth() + 1) + '-' + doisDigitos(d.getDate());
  }

  function deISO(iso) {
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], 12); // meio-dia evita problemas de fuso
  }

  function somarDias(iso, n) {
    var d = deISO(iso);
    d.setDate(d.getDate() + n);
    return paraISO(d);
  }

  function dataInicial() {
    var param = new URLSearchParams(window.location.search).get('data');
    if (param && /^\d{4}-\d{2}-\d{2}$/.test(param)) return param;
    return paraISO(new Date());
  }

  /* ---------- Texto ---------- */
  function escapar(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Deixa em negrito os números de versículo colados ao texto (ex.: "29No dia seguinte")
  function formatarLinha(linha) {
    return escapar(linha).replace(
      /(^|[\s“"‘(.!?:;,”—])(\d{1,3})(?=[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ“"‘—(])/g,
      '$1<strong class="lit-versiculo">$2</strong> '
    );
  }

  function paragrafos(texto) {
    return String(texto || '')
      .split(/\n+/)
      .filter(function (l) { return l.trim() !== ''; })
      .map(function (l) { return '<p>' + formatarLinha(l.trim()) + '</p>'; })
      .join('');
  }

  /* ---------- Cabeçalho de data ---------- */
  function mostrarData(iso) {
    var d = deISO(iso);
    el.dia.textContent = d.getDate();
    el.mes.textContent = MESES[d.getMonth()];
    el.ano.textContent = d.getFullYear();
    cal.ano = d.getFullYear();
    cal.mes = d.getMonth();
    if (!el.cal.hidden) renderizarCalendario();
  }

  /* ---------- Calendário ---------- */
  function renderizarCalendario() {
    var primeiro = new Date(cal.ano, cal.mes, 1).getDay();
    var total = new Date(cal.ano, cal.mes + 1, 0).getDate();
    var hoje = paraISO(new Date());
    var celulas = Math.ceil((primeiro + total) / 7) * 7;
    var html = '';

    for (var i = 0; i < celulas; i++) {
      var n = i - primeiro + 1;
      if (n < 1 || n > total) {
        html += '<span class="lit-cal-vazio"></span>';
        continue;
      }
      var iso = cal.ano + '-' + doisDigitos(cal.mes + 1) + '-' + doisDigitos(n);
      html += '<button type="button" class="lit-cal-dia' + (iso === hoje ? ' lit-cal-hoje' : '') +
        '" data-iso="' + iso + '" aria-pressed="' + (iso === estado.iso) + '">' + n + '</button>';
    }

    el.calTitulo.textContent = MESES_CHEIOS[cal.mes] + ' ' + cal.ano;
    el.calDias.innerHTML = html;
  }

  function abrirCalendario() {
    var d = deISO(estado.iso);
    cal.ano = d.getFullYear();
    cal.mes = d.getMonth();
    renderizarCalendario();
    el.cal.hidden = false;
    el.abrirCal.setAttribute('aria-expanded', 'true');
  }

  function fecharCalendario() {
    el.cal.hidden = true;
    el.abrirCal.setAttribute('aria-expanded', 'false');
  }

  function mudarMes(n) {
    var d = new Date(cal.ano, cal.mes + n, 1);
    cal.ano = d.getFullYear();
    cal.mes = d.getMonth();
    renderizarCalendario();
  }

  /* ---------- Carregar da API ---------- */
  function carregar(iso) {
    estado.iso = iso;
    estado.celebracao = 0;
    estado.aba = 0;
    estado.opcao = 0;
    mostrarData(iso);

    try {
      history.replaceState(null, '', '?data=' + iso);
    } catch (e) { /* ignora */ }

    if (cache[iso]) {
      estado.dados = cache[iso];
      renderizar();
      return;
    }

    var pedido = ++estado.pedido;
    el.celebracoes.hidden = true;
    el.abas.innerHTML = '';
    el.titulo.textContent = 'Carregando liturgia...';
    el.corNome.textContent = '--';
    el.conteudo.innerHTML = '<p class="lit-aviso">Carregando liturgia...</p>';

    var d = deISO(iso);
    var url = API + '?dia=' + doisDigitos(d.getDate()) +
      '&mes=' + doisDigitos(d.getMonth() + 1) + '&ano=' + d.getFullYear();

    fetch(url)
      .then(function (resp) {
        return resp.json().catch(function () { return {}; }).then(function (json) {
          if (!resp.ok) {
            var erro = new Error(json.erro || 'Não foi possível carregar a liturgia.');
            erro.naoEncontrada = resp.status === 404;
            throw erro;
          }
          return json;
        });
      })
      .then(function (json) {
        if (pedido !== estado.pedido) return; // o visitante já trocou de data
        cache[iso] = json;
        estado.dados = json;
        renderizar();
      })
      .catch(function (erro) {
        if (pedido !== estado.pedido) return;
        mostrarErro(erro);
      });
  }

  function mostrarErro(erro) {
    estado.dados = null;
    el.celebracoes.hidden = true;
    el.abas.innerHTML = '';
    el.titulo.textContent = 'Liturgia indisponível';
    el.corNome.textContent = '--';
    el.pagina.style.removeProperty('--lit-cor-liturgica');

    var msg = erro.naoEncontrada
      ? escapar(erro.message)
      : 'Não foi possível carregar a liturgia. Verifique sua conexão e tente novamente.';

    el.conteudo.innerHTML =
      '<div class="lit-erro"><strong>Algo deu errado</strong>' + msg + '</div>';
  }

  /* ---------- Montagem da tela ---------- */
  function celebracaoAtual() {
    return estado.dados && estado.dados.celebracoes[estado.celebracao];
  }

  function renderizar() {
    var dados = estado.dados;
    if (!dados || !dados.celebracoes || !dados.celebracoes.length) {
      mostrarErro({ naoEncontrada: true, message: 'Nenhuma liturgia encontrada para esta data.' });
      return;
    }

    // Abre na celebração principal
    if (estado.celebracao === 0) {
      for (var i = 0; i < dados.celebracoes.length; i++) {
        if (dados.celebracoes[i].principal) { estado.celebracao = i; break; }
      }
    }

    renderizarCelebracoes();
    renderizarCabecalho();
    renderizarAbas();
    renderizarConteudo();
  }

  function renderizarCelebracoes() {
    var lista = estado.dados.celebracoes;
    if (lista.length < 2) {
      el.celebracoes.hidden = true;
      el.celebracoes.innerHTML = '';
      return;
    }
    el.celebracoes.hidden = false;
    el.celebracoes.innerHTML = lista.map(function (c, i) {
      return '<button type="button" class="lit-celebracao" data-indice="' + i +
        '" aria-pressed="' + (i === estado.celebracao) + '">' + escapar(c.liturgia) + '</button>';
    }).join('');
  }

  function renderizarCabecalho() {
    var c = celebracaoAtual();
    var cor = (c.cor || '').trim();
    el.titulo.textContent = c.liturgia || '';
    el.corNome.textContent = cor ? cor.toUpperCase() : '--';
    el.pagina.style.setProperty('--lit-cor-liturgica', CORES[cor.toLowerCase()] || CORES.verde);
  }

  function itensDasAbas() {
    var c = celebracaoAtual();
    var leituras = (c.leituras || []).slice().sort(function (a, b) { return a.ordem - b.ordem; });
    var itens = leituras.map(function (l) {
      return { rotulo: l.rotulo || 'Leitura', tipo: 'leitura', leitura: l };
    });
    if (temOracoes(c)) itens.push({ rotulo: 'Orações', tipo: 'oracoes' });
    return itens;
  }

  function temOracoes(c) {
    var o = c.oracoes || {}, a = c.antifonas || {};
    return !!(o.coleta || o.oferendas || o.comunhao || a.entrada || a.comunhao ||
      (o.extras && o.extras.length));
  }

  function renderizarAbas() {
    var itens = itensDasAbas();
    el.abas.innerHTML = itens.map(function (item, i) {
      return '<button type="button" role="tab" class="lit-aba" data-indice="' + i +
        '" aria-selected="' + (i === estado.aba) + '" tabindex="' + (i === estado.aba ? 0 : -1) + '">' +
        escapar(item.rotulo) + '</button>';
    }).join('');
  }

  function renderizarConteudo() {
    var itens = itensDasAbas();
    var item = itens[estado.aba];
    if (!item) {
      el.conteudo.innerHTML = '<p class="lit-aviso">Sem conteúdo para esta celebração.</p>';
      return;
    }
    el.conteudo.innerHTML = item.tipo === 'oracoes'
      ? htmlOracoes(celebracaoAtual())
      : htmlLeitura(item.leitura);
  }

  function htmlLeitura(leitura) {
    var opcoes = leitura.opcoes || [];
    if (!opcoes.length) return '<p class="lit-aviso">Texto indisponível.</p>';
    if (estado.opcao >= opcoes.length) estado.opcao = 0;
    var op = opcoes[estado.opcao];

    var html = '';
    if (opcoes.length > 1) {
      html += '<div class="lit-opcoes" role="group" aria-label="Versões da leitura">' +
        opcoes.map(function (o, i) {
          return '<button type="button" class="lit-opcao" data-opcao="' + i +
            '" aria-pressed="' + (i === estado.opcao) + '">Opção ' + (i + 1) + '</button>';
        }).join('') + '</div>';
    }

    var rotulo = escapar(leitura.rotulo) + (op.referencia ? ' (' + escapar(op.referencia) + ')' : '');
    html += '<h3 class="lit-rotulo">' + rotulo + '</h3>';
    if (op.titulo) html += '<p class="lit-chamada">' + escapar(op.titulo) + '</p>';
    if (op.refrao) html += '<p class="lit-refrao"><strong>Refrão:</strong> ' + escapar(op.refrao) + '</p>';
    html += paragrafos(op.texto);
    return html;
  }

  function htmlOracoes(c) {
    var o = c.oracoes || {}, a = c.antifonas || {};
    var blocos = [
      ['Antífona de entrada', a.entrada],
      ['Oração do dia (coleta)', o.coleta],
      ['Oração sobre as oferendas', o.oferendas],
      ['Antífona da comunhão', a.comunhao],
      ['Oração depois da comunhão', o.comunhao]
    ];
    (o.extras || []).forEach(function (x) { blocos.push([x.titulo, x.texto]); });

    return blocos.filter(function (b) { return b[1]; }).map(function (b) {
      return '<h3 class="lit-subtitulo">' + escapar(b[0]) + '</h3>' + paragrafos(b[1]);
    }).join('');
  }

  /* ---------- Eventos ---------- */
  function irPara(iso) {
    if (iso && iso !== estado.iso) carregar(iso);
  }

  el.anterior.addEventListener('click', function () { irPara(somarDias(estado.iso, -1)); });
  el.proximo.addEventListener('click', function () { irPara(somarDias(estado.iso, 1)); });
  el.hoje.addEventListener('click', function () { irPara(paraISO(new Date())); });

  el.abrirCal.addEventListener('click', function () {
    if (el.cal.hidden) abrirCalendario(); else fecharCalendario();
  });

  el.calAnterior.addEventListener('click', function () { mudarMes(-1); });
  el.calProximo.addEventListener('click', function () { mudarMes(1); });

  el.calDias.addEventListener('click', function (e) {
    var b = e.target.closest('.lit-cal-dia');
    if (!b) return;
    irPara(b.dataset.iso);
    fecharCalendario();
  });

  // Fecha ao clicar fora ou apertar Esc
  document.addEventListener('click', function (e) {
    if (el.cal.hidden) return;
    if (!el.cal.contains(e.target) && !el.abrirCal.contains(e.target)) fecharCalendario();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !el.cal.hidden) {
      fecharCalendario();
      el.abrirCal.focus();
    }
  });

  el.celebracoes.addEventListener('click', function (e) {
    var b = e.target.closest('.lit-celebracao');
    if (!b) return;
    estado.celebracao = +b.dataset.indice;
    estado.aba = 0;
    estado.opcao = 0;
    renderizarCelebracoes();
    renderizarCabecalho();
    renderizarAbas();
    renderizarConteudo();
  });

  el.abas.addEventListener('click', function (e) {
    var b = e.target.closest('.lit-aba');
    if (!b) return;
    estado.aba = +b.dataset.indice;
    estado.opcao = 0;
    renderizarAbas();
    renderizarConteudo();
  });

  // Navegação pelas abas com as setas do teclado
  el.abas.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var total = el.abas.children.length;
    estado.aba = (estado.aba + (e.key === 'ArrowRight' ? 1 : -1) + total) % total;
    estado.opcao = 0;
    renderizarAbas();
    renderizarConteudo();
    el.abas.children[estado.aba].focus();
  });

  el.conteudo.addEventListener('click', function (e) {
    var b = e.target.closest('.lit-opcao');
    if (!b) return;
    estado.opcao = +b.dataset.opcao;
    renderizarConteudo();
  });

  /* ---------- Tamanho da letra ---------- */
  var fonte = 1.05;
  try {
    var salva = parseFloat(localStorage.getItem('lit-fonte'));
    if (salva >= FONTE_MIN && salva <= FONTE_MAX) fonte = salva;
  } catch (e) { /* ignora */ }

  function aplicarFonte() {
    el.pagina.style.setProperty('--lit-fonte', fonte.toFixed(2) + 'rem');
    el.fonteMais.disabled = fonte >= FONTE_MAX - 0.001;
    el.fonteMenos.disabled = fonte <= FONTE_MIN + 0.001;
    try { localStorage.setItem('lit-fonte', fonte.toFixed(2)); } catch (e) { /* ignora */ }
  }

  el.fonteMais.addEventListener('click', function () {
    fonte = Math.min(FONTE_MAX, fonte + FONTE_PASSO);
    aplicarFonte();
  });
  el.fonteMenos.addEventListener('click', function () {
    fonte = Math.max(FONTE_MIN, fonte - FONTE_PASSO);
    aplicarFonte();
  });

  /* ---------- Início: abre na liturgia de hoje (ou na data do link) ---------- */
  aplicarFonte();
  carregar(dataInicial());
})();