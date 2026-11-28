// ==========================================================================
// ONDE ESTAMOS - troca o título e o texto da missão ao clicar nas setas,
// e abre/fecha os detalhes da missão ao clicar (ou dar Enter/Espaço) no card
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const cartao = document.querySelector('.cartao-missao');
  const tituloEl = document.getElementById('missaoTitulo');
  const textoEl = document.getElementById('missaoTexto');
  const botaoAnterior = document.querySelector('.seta-anterior');
  const botaoProximo = document.querySelector('.seta-proximo');

  if (!cartao || !tituloEl || !textoEl) return;

  // Edite os campos abaixo com o conteúdo real de cada missão.
  // Campos opcionais (localizacao, endereco, mapa, grupo, grupopjf,
  // grupoteen, email, telefone): se deixar em branco ('') a linha
  // correspondente simplesmente não aparece.
  const missoes = [
    {
      titulo: 'Sede Fundacional',
      texto: 'Na região central de Campinas se encontra nossa Sede Fundacional, chamada Casa São José da Divina Providência onde se realizam todos os nossos trabalhos de evangelização, tais como, Grupo de Oração para adultos, Jovens, adolescentes e crianças, Curso de Espiritualidade e Doutrina, atendimento pessoal pelo Plantão de Oração, Missas, Vésperas Solenes, toda a formação vocacional da Comunidade, e todos os trabalhos administrativos.',
      localizacao: 'Arquidiocese de Campinas (Origem da Comunidade)',
      endereco: 'Rua Culto à Ciência, 238 – Botafogo, Campinas – SP, CEP: 13020-060',
      mapa: 'https://www.google.com/maps/place/Comunidade+Cat%C3%B3lica+Pantokrator/data=!4m2!3m1!1s0x0:0xc13877013a297981?sa=X&ved=1t:2428&ictx=111',
      grupo: 'Grupo de Oração toda quinta-feira para adultos | às 20h | Paróquia Sagrado Coração de Jesus',
      grupopjf: 'Grupo de Oração quinzenal para jovens | às 20h | Auditório da Comunidade',
      grupoteen: 'Grupo de Oração toda quinta-feira para adolescentes | às 20h | Auditório da Comunidade',
      email: 'pantokrator@comptk.com',
      telefone: '(19) 99399-5793'
    },
    {
      titulo: 'Missão Morales',
      texto: 'A Casa de Missão Morales representa a expansão internacional da Comunidade Católica Pantokrator. Situada no distrito de Morales, na província e departamento de San Martín, no Peru, a missão está vinculada pastoralmente ao Centro Pastoral Santa Rosa de Lima, inserido na Prelazia de Moyobamba. Concretizando o carisma da comunidade — focado no anúncio da fidelidade a Deus e no ardor missionário —, a Missão Morales desenvolve ações voltadas principalmente para a formação e evangelização da juventude e de universitários locais. Grupo de Oração para Jovens: Encontros semanais de oração e espiritualidade realizados aos sábados, às 20h30.',
      localizacao: 'Arquidiose de Tarapoto',
      endereco: 'Jr. Augusto B. Leguia n° 355 – Morales – Peru',
      mapa: 'https://www.google.com/maps/place/Jr.+Augusto+B.+leguia+355,+Tarapoto+22201,+Peru/@-6.4767621,-76.3853831,17z/data=!3m1!4b1!4m5!3m4!1s0x91ba095f13580d59:0xfdc18b6516772a45!8m2!3d-6.4767621!4d-76.3828082?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D',
      email: 'pantokratorperu@gmail.com',
      telefone: '51993648197'
    },
    {
      titulo: 'Missão França',
      texto: 'A Casa de Missão em Bédarrides-Châteauneuf-du-Pape marca a presença internacional da Comunidade Católica Pantokrator no continente europeu. Inserida na Diocese de Avignon, na França, a obra missionária teve início em 2015 a convite de Dom Jean-Pierre Cattenoz (então arcebispo de Avignon). A missão atua diretamente no ecossistema paroquial local, oferecendo suporte pastoral e promovendo o anúncio do Evangelho, o acompanhamento das famílias e o apoio fraterno aos mais vulneráveis da região.',
      localizacao: 'Paróquia Saint Laurent - França',
      endereco: '12 rue Caroussières, 84370 - Bédarrides',
      mapa: 'https://www.google.com/maps/place/84370+B%C3%A9darrides,+Fran%C3%A7a/@44.0478066,4.8617424,13z/data=!3m1!4b1!4m10!1m2!2m1!1s12+rue+Caroussi%C3%A8res,+84370+-+B%C3%A9darrides!3m6!1s0x12b58d8d4bfc05bb:0x40819a5fd8fc620!8m2!3d44.0416533!4d4.8992618!15sCikxMiBydWUgQ2Fyb3Vzc2nDqHJlcywgODQzNzAgLSBCw6lkYXJyaWRlc5IBCGxvY2FsaXR54AEA!16zL20vMGMzYmI4?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D',
      email: 'france@comptk.com',
      telefone: '+33 6.89.26.22.48'
    },
    {
      titulo: 'Missão São José dos Campos',
      texto: 'A Casa de Missão em São José dos Campos é uma das frentes de evangelização da Comunidade Católica Pantokrator no estado de São Paulo, situada na Região Metropolitana do Vale do Paraíba. Vinculada pastoralmente à Diocese de São José dos Campos, a missão funciona como um polo de espiritualidade, acolhimento e formação cristã para adultos, jovens e crianças da cidade e arredores. A atuação da casa reflete o carisma da comunidade — que busca testemunhar a fidelidade a Deus e gerar frutos de santidade cotidiana —, oferecendo um espaço permanente para oração, vivência comunitária e aprofundamento na fé católica.',
      localizacao: 'Diocese de São José dos Campos – SP',
      endereco: 'Rua Dr. Sérgio Santos, 109-113 – Jardim Portugal, São José dos Campos – SP',
      mapa: 'https://www.google.com/maps/place/R.+Dr.+S%C3%A9rgio+Santos,+109+-+113+-+Jardim+Portugal,+S%C3%A3o+Jos%C3%A9+dos+Campos+-+SP,+12232-180/@-23.2584973,-45.8848322,17z/data=!3m1!4b1!4m6!3m5!1s0x94cdb539b604fc27:0xc1db960a3fed43ec!8m2!3d-23.2584973!4d-45.8822573!16s%2Fg%2F11csc4hcvy?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D',
      grupo: 'Grupo de Oração toda quinta-feira para adultos | às 20h | Comunidade Católica Pantokrator',
      email: 'pantokrator.sjc@pantokrator.org.br',
      telefone: '(12) 99139-7345'
    },
    {
      titulo: 'Missão em Santos',
      texto: 'A Casa de Missão em Santos representa a atuação da Comunidade Católica Pantokrator na Região Metropolitana da Baixada Santista. Inserida na Diocese de Santos, a missão desenvolve um trabalho focado na evangelização das famílias, jovens e adolescentes, promovendo encontros de oração, acompanhamento espiritual e eventos de formação cristã no bairro Marapé e regiões vizinhas. Grupo de Oração Principal: Encontro semanal aberto a toda a comunidade, realizado às segundas-feiras, às 20h, no Santuário São Judas Tadeu (Rua Saturnino de Brito, 112 – Marapé).',
      localizacao: 'Diocese de Santos – SP',
      endereco: 'Rua Alberto Veiga, 21 – Marapé, Santos – SP, CEP: 11070-030',
      mapa: 'https://www.google.com/maps/place/R.+Alberto+Veiga,+21+-+Marap%C3%A9,+Santos+-+SP,+11070-030/@-23.9524605,-46.3511914,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce035b52b6d0ef:0x7ff0cd6bc06ed9f4!8m2!3d-23.9524605!4d-46.3486165!16s%2Fg%2F11jsjp4zw5?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D',
      grupo: 'Grupo de Oração toda segunda-feira para adultos | às 20h | Paróquia São Judas Tadeu',
      email: 'santos@pantokrator.org.br',
      telefone: '(13) 3349-1954 / (13) 99139-8215'
    },
    {
      titulo: 'Missão em Jaguariúna',
      texto: 'A Casa de Missão em Jaguariúna é uma das frentes de evangelização da Comunidade Católica Pantokrator no interior do estado de São Paulo. Pertencente à Diocese de Amparo, a missão atua como um polo de evangelização, espiritualidade e vivência fraterna na Região Metropolitana de Campinas e no Circuito das Águas. Vinculada ao carisma El Shaddai-Pantokrator, a casa atua no acolhimento de fiéis, na promoção da vida de oração e no anúncio do amor de Deus, oferecendo encontros de formação cristã, acompanhamento e momentos comunitários para famílias, jovens e adultos da região.',
      localizacao: 'Diocese de Amparo – SP',
      endereco: 'Rua Osvaldo Tonini, 72 – Nova Jaguariúna, Jaguariúna – SP',
      mapa: 'https://www.google.com/maps/place/Rua+Osvaldo+Tonini,+72+-+Nova+Jaguari%C3%BAna,+Jaguari%C3%BAna+-+SP,+13919-396/@-22.7098105,-46.9861378,17z/data=!3m1!4b1!4m6!3m5!1s0x94c8e801a5f37d51:0x929ddc5a50a9f44!8m2!3d-22.7098105!4d-46.9835629!16s%2Fg%2F11c4mkc2qj?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D',
      email: 'jaguariuna@pantokrator.org.br',
      telefone: '(19) 97820-1017 / (19) 98176-1277'
    }
  ];

  let indice = 0;

  // Monta o HTML de dentro da caixa de texto: parágrafo principal
  // + linhas de contato (só as que tiverem conteúdo preenchido).
  // O link do mapa é montado logo depois do endereço, e só aparece
  // se a missão tiver tanto "endereco" quanto "mapa" preenchidos.
  function montarHtmlTexto(missao) {
    let html = '<p>' + missao.texto + '</p>';

    if (missao.localizacao) {
      html += '<p class="info-missao"><strong>Localização / Diocese:</strong> ' + missao.localizacao + '</p>';
    }

    if (missao.endereco) {
      html += '<p class="info-missao"><strong>Endereço:</strong> ' + missao.endereco + '</p>';
    }

    if (missao.mapa) {
      html += '<p class="info-missao link-mapa"><a href="' + missao.mapa + '" target="_blank" rel="noopener">Clique aqui para ver no mapa</a></p>';
    }

    if (missao.grupo) {
      html += '<p class="info-missao"><strong>Grupo de Oração:</strong> ' + missao.grupo + '</p>';
    }

    if (missao.grupopjf) {
      html += '<p class="info-missao"><strong>Grupo de Oração (Jovens):</strong> ' + missao.grupopjf + '</p>';
    }

    if (missao.grupoteen) {
      html += '<p class="info-missao"><strong>Grupo de Oração (Adolescentes):</strong> ' + missao.grupoteen + '</p>';
    }

    if (missao.email) {
      html += '<p class="info-missao"><strong>E-mail:</strong> ' + missao.email + '</p>';
    }

    if (missao.telefone) {
      html += '<p class="info-missao"><strong>Telefone / WhatsApp:</strong> ' + missao.telefone + '</p>';
    }

    return html;
  }

  // Abre ou fecha os detalhes do card atual, alternando a classe "aberto"
  // e mantendo o aria-expanded sincronizado para leitores de tela.
  function alternarCartao() {
    const aberto = cartao.classList.toggle('aberto');
    cartao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  }

  function fecharCartao() {
    cartao.classList.remove('aberto');
    cartao.setAttribute('aria-expanded', 'false');
  }

  function mostrar(novoIndice) {
    cartao.classList.add('trocando'); // some suavemente...

    setTimeout(function () {
      indice = (novoIndice + missoes.length) % missoes.length;
      const missao = missoes[indice];

      tituloEl.textContent = missao.titulo;
      textoEl.innerHTML = montarHtmlTexto(missao);

      fecharCartao(); // toda vez que troca de missão, o card volta fechado
      cartao.classList.remove('trocando'); // ...e reaparece com o novo conteúdo
    }, 200);
  }

  botaoProximo.addEventListener('click', function () {
    mostrar(indice + 1);
  });

  botaoAnterior.addEventListener('click', function () {
    mostrar(indice - 1);
  });

  // Clique no card abre/fecha os detalhes. Se o clique foi num link
  // (por exemplo, o link do mapa), deixa o link agir normalmente sem
  // alternar o card.
  cartao.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    alternarCartao();
  });

  // Acessibilidade por teclado: com o card focado, Enter ou Espaço
  // também abrem/fecham os detalhes.
  cartao.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      alternarCartao();
    }
  });

  // Renderiza a primeira missão assim que a página carrega, usando o
  // mesmo array acima. Assim o HTML não precisa ter nenhum conteúdo
  // "fixo" duplicado — tudo vem sempre daqui, de um lugar só.
  tituloEl.textContent = missoes[0].titulo;
  textoEl.innerHTML = montarHtmlTexto(missoes[0]);
});