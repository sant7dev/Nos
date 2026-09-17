const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function abrirPagina(nome) {
  $$('.page').forEach((page) => page.classList.toggle('active', page.id === nome));
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.page === nome));
  $('#main-nav').classList.remove('open');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle span').textContent = 'Menu';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('[data-page]').forEach((item) => item.addEventListener('click', () => abrirPagina(item.dataset.page)));

$('#menu-toggle').addEventListener('click', () => {
  const aberto = $('#main-nav').classList.toggle('open');
  $('#menu-toggle').setAttribute('aria-expanded', String(aberto));
  $('#menu-toggle span').textContent = aberto ? 'Fechar' : 'Menu';
});

function atualizarContador() {
  const inicio = new Date(relacionamento.inicio);
  const agora = new Date();
  let segundos = Math.max(0, Math.floor((agora - inicio) / 1000));
  const dias = Math.floor(segundos / 86400); segundos %= 86400;
  const horas = Math.floor(segundos / 3600); segundos %= 3600;
  const minutos = Math.floor(segundos / 60);
  $('#counter').textContent = `${dias} dias, ${horas}h e ${minutos}min`;
}
atualizarContador();
setInterval(atualizarContador, 60000);

function midia(src, extra = '') {
  const ehVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(src);
  if (ehVideo) {
    return `<div class="photo ${extra} video-photo"><video src="${src}" controls muted loop playsinline preload="metadata" aria-label="Vídeo nosso"></video></div>`;
  }
  return `<div class="photo ${extra}" style="background-image:url('${src}')" role="img" aria-label="Foto nossa"></div>`;
}
$('#home-photos').innerHTML = fotosHome.map((foto, i) => midia(foto, i === 0 ? 'principal' : '')).join('');

$('#timeline').innerHTML = momentos.map((momento) => `
  <article class="moment">
    ${midia(momento.video || momento.imagem)}
    <time>${momento.data}</time>
    <h3>${momento.titulo}</h3>
    <p>${momento.descricao}</p>
  </article>`).join('');

$('#love-list').innerHTML = coisasQueAmo.map((item) => `<div class="love-item">${item}</div>`).join('');
$('#tastes-list').innerHTML = gostosDela.map((item) => `<div class="taste"><b>${item.categoria}</b><span>${item.valor}</span></div>`).join('');

function iniciarMemoria() {
  const cartas = [...fotosMemoria, ...fotosMemoria]
    .map((imagem, indice) => ({ imagem, par: indice % fotosMemoria.length }))
    .sort(() => Math.random() - 0.5);
  let primeira = null;
  let bloqueado = false;
  let pares = 0;
  let jogadas = 0;
  const area = $('#memory-game');

  area.innerHTML = `<div class="memory-status"><span>Pares: <strong id="memory-pairs">0/${fotosMemoria.length}</strong></span><span>Tentativas: <strong id="memory-moves">0</strong></span></div><div class="memory-grid">${cartas.map((carta, indice) => `<button class="memory-card-button" data-index="${indice}" data-pair="${carta.par}" aria-label="Carta de memória"><span class="memory-card-inner"><span class="memory-face memory-front">♥</span><span class="memory-face memory-back"><img src="${carta.imagem}" alt="Foto nossa"></span></span></button>`).join('')}</div>`;

  $$('.memory-card-button').forEach((carta) => carta.addEventListener('click', () => {
    if (bloqueado || carta.classList.contains('flipped') || carta.classList.contains('matched')) return;
    carta.classList.add('flipped');
    if (!primeira) { primeira = carta; return; }
    jogadas++;
    $('#memory-moves').textContent = jogadas;
    const segunda = carta;
    if (primeira.dataset.pair === segunda.dataset.pair) {
      primeira.classList.add('matched'); segunda.classList.add('matched'); pares++;
      $('#memory-pairs').textContent = `${pares}/${fotosMemoria.length}`;
      primeira = null;
      if (pares === fotosMemoria.length) setTimeout(() => { area.insertAdjacentHTML('beforeend', '<p class="feedback">Você encontrou todas as nossas memórias ❤️</p><button class="memory-restart">Jogar novamente</button>'); $('.memory-restart').addEventListener('click', iniciarMemoria); }, 350);
    } else {
      bloqueado = true;
      setTimeout(() => { primeira.classList.remove('flipped'); segunda.classList.remove('flipped'); primeira = null; bloqueado = false; }, 850);
    }
  }));
}
iniciarMemoria();

$('#months').innerHTML = textosMensais.map((item, index) => `<button class="month" data-month="${index}">${item.mes}</button>`).join('');
$$('.month').forEach((button) => button.addEventListener('click', () => {
  $$('.month').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  $('#letter').innerHTML = `<p>${textosMensais[Number(button.dataset.month)].texto}</p>`;
}));

$('#open-surprise').addEventListener('click', () => {
  $('#surprise-content').hidden = false;
  $('#surprise-content').innerHTML = `<h3>${surpresa.titulo}</h3><p>${surpresa.texto}</p>`;
  $('#open-surprise').textContent = 'Aberta ♥';
  $('#open-surprise').disabled = true;
});

const playlistLink = $('#playlist-link' );

playlistLink.href = playlist.link;
$('#playlist-title').textContent = playlist.titulo;
$('#playlist-description').textContent = playlist.descricao;
