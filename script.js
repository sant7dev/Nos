const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function abrirPagina(nome) {
  $$('.page').forEach((page) => page.classList.toggle('active', page.id === nome));
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.page === nome));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('[data-page]').forEach((item) => item.addEventListener('click', () => abrirPagina(item.dataset.page)));

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

function imagemComFallback(src, extra = '') {
  return `<div class="photo ${extra}" style="background-image:url('${src}')" role="img" aria-label="Foto nossa"></div>`;
}
$('#home-photos').innerHTML = fotosHome.map((foto, i) => imagemComFallback(foto, i === 0 ? 'principal' : '')).join('');

$('#timeline').innerHTML = momentos.map((momento) => `
  <article class="moment">
    ${imagemComFallback(momento.imagem)}
    <time>${momento.data}</time>
    <h3>${momento.titulo}</h3>
    <p>${momento.descricao}</p>
  </article>`).join('');

$('#love-list').innerHTML = coisasQueAmo.map((item) => `<div class="love-item">${item}</div>`).join('');
$('#tastes-list').innerHTML = gostosDela.map((item) => `<div class="taste"><b>${item.categoria}</b><span>${item.valor}</span></div>`).join('');

let perguntaAtual = 0;
let pontos = 0;
function mostrarPergunta() {
  if (perguntaAtual >= perguntas.length) {
    $('#quiz').innerHTML = `<span class="quiz-count">resultado final</span><h3>Você fez ${pontos} de ${perguntas.length} pontos.</h3><p class="feedback">Mas a verdade é que você sempre acerta meu coração ❤️</p><button class="next-button" id="restart">Jogar novamente</button>`;
    $('#restart').addEventListener('click', () => { perguntaAtual = 0; pontos = 0; mostrarPergunta(); });
    return;
  }
  const atual = perguntas[perguntaAtual];
  $('#quiz').innerHTML = `<span class="quiz-count">pergunta ${perguntaAtual + 1} de ${perguntas.length}</span><h3>${atual.pergunta}</h3><div class="answers">${atual.alternativas.map((a, i) => `<button class="answer" data-answer="${i}">${a}</button>`).join('')}</div><div id="quiz-feedback"></div>`;
  $$('.answer').forEach((button) => button.addEventListener('click', () => responder(Number(button.dataset.answer), atual)));
}
function responder(escolha, atual) {
  $$('.answer').forEach((button) => { button.disabled = true; if (Number(button.dataset.answer) === atual.correta) button.classList.add('selected'); });
  const acertou = escolha === atual.correta;
  if (acertou) pontos++;
  $('#quiz-feedback').innerHTML = `<p class="feedback">${acertou ? 'Acertou! ' : 'Quase! '}${atual.feedback}</p><button class="next-button" id="next">${perguntaAtual === perguntas.length - 1 ? 'Ver resultado' : 'Próxima'}</button>`;
  $('#next').addEventListener('click', () => { perguntaAtual++; mostrarPergunta(); });
}
mostrarPergunta();

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
