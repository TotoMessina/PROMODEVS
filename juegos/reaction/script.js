const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const playArea = document.getElementById('play-area');
const result = document.getElementById('result');
const livesDisplay = document.getElementById('lives');

let startTime;
let reactionTimes = [];
let round = 0;
const totalRounds = 10;
let lives = 3;
let timeoutId = null;
let active = false;
let isTargetReal = true;

function updateLives() {
  livesDisplay.textContent = '❤️'.repeat(lives);
}

function endGame() {
  playArea.innerHTML = '';
  const avg = reactionTimes.length
    ? reactionTimes.reduce((a, b) => a + b) / reactionTimes.length
    : 0;

  result.innerHTML = `
    <p>¡Juego terminado!</p>
    <p>Tiempos de reacción: ${reactionTimes.join(' ms, ')} ms</p>
    <p>Promedio: ${Math.round(avg)} ms</p>
  `;
  restartBtn.style.display = 'inline-block';
}

function showTarget() {
  if (lives <= 0 || round >= totalRounds) return;

  active = true;
  isTargetReal = Math.random() < 0.7; // 70% chance de objetivo real

  const target = document.createElement(isTargetReal ? 'img' : 'div');
  target.classList.add('target');

  const x = Math.random() * (playArea.clientWidth - 70);
  const y = Math.random() * (playArea.clientHeight - 70);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  if (isTargetReal) {
    target.src = 'img/ades.png'; // Cambiá por tu imagen
    target.alt = 'objetivo';
    target.classList.add('real');
  } else {
    target.classList.add('bait');
    target.textContent = '✖'; // icono de cebo
    target.style.background = 'red';
  }

  playArea.innerHTML = '';
  playArea.appendChild(target);
  startTime = Date.now();

  timeoutId = setTimeout(() => {
    if (active && isTargetReal) {
      failRound();
    } else {
      // si era bait y no se hizo clic, no pasa nada
      nextRound();
    }
  }, 1500);
}

function failRound() {
  clearTimeout(timeoutId);
  active = false;
  playArea.innerHTML = '';
  lives--;
  updateLives();

  if (lives > 0 && round < totalRounds) {
    setTimeout(spawnTarget, 1000);
  } else {
    endGame();
  }
}

function nextRound() {
  clearTimeout(timeoutId);
  active = false;
  playArea.innerHTML = '';
  round++;
  if (round < totalRounds && lives > 0) {
    setTimeout(spawnTarget, Math.random() * 1000 + 300);
  } else {
    endGame();
  }
}

playArea.addEventListener('click', (e) => {
  const target = e.target;

  if (!active) return;

  if (target.classList.contains('real')) {
    const reactionTime = Date.now() - startTime;
    reactionTimes.push(reactionTime);
    nextRound();
  } else if (target.classList.contains('bait')) {
    failRound(); // clic en el objetivo falso
  } else {
    failRound(); // clic en cualquier otra parte
  }
});

startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  result.textContent = '';
  round = 0;
  lives = 3;
  reactionTimes = [];
  updateLives();
  spawnTarget();
});

restartBtn.addEventListener('click', () => {
  restartBtn.style.display = 'none';
  result.textContent = '';
  round = 0;
  lives = 3;
  reactionTimes = [];
  updateLives();
  spawnTarget();
});

homeBtn.addEventListener('click', () => {
  window.location.href = "../index.html";
});

function spawnTarget() {
  showTarget();
}
