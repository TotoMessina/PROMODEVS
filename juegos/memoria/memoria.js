const cardsArray = [
  { symbol: '🌸' },
  { symbol: '🎇' },
  { symbol: '🕹️' },
  { symbol: '🔮' },
  { symbol: '🚀' },
  { symbol: '👾' },
  { symbol: '💾' },
  { symbol: '🎧' },
];

const game = document.querySelector('.memory-game');
const triesDisplay = document.getElementById('tries');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

let flippedCards = [];
let matchedCards = [];
let tries = 0;
let timer = 60; // 60 segundos
let intervalId;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createCards() {
  const doubled = [...cardsArray, ...cardsArray];
  const shuffled = shuffle(doubled);

  shuffled.forEach((cardObj) => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.symbol = cardObj.symbol;

    card.innerHTML = `
      <div class="front">${cardObj.symbol}</div>
      <div class="back">?</div>
    `;

    card.addEventListener('click', flipCard);
    game.appendChild(card);
  });
}

function flipCard() {
  if (
    flippedCards.length === 2 ||
    flippedCards.includes(this) ||
    matchedCards.includes(this)
  ) return;

  this.classList.add('flip');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    tries++;
    triesDisplay.textContent = tries;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    matchedCards.push(...flippedCards);
    flippedCards = [];

    if (matchedCards.length === cardsArray.length * 2) {
      clearInterval(intervalId);
      setTimeout(showWinModal, 300);
    }
  } else {
    setTimeout(() => {
      flippedCards.forEach(card => card.classList.remove('flip'));
      flippedCards = [];
    }, 1000);
  }
}

function startTimer() {
  timer = 60;
  timerDisplay.textContent = formatTime(timer);

  intervalId = setInterval(() => {
    timer--;
    timerDisplay.textContent = formatTime(timer);

    if (timer <= 0) {
      clearInterval(intervalId);
      endGame();
    }
  }, 1000);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function endGame() {
  // Bloquea las cartas y muestra alerta de tiempo acabado
  const allCards = document.querySelectorAll('.memory-card');
  allCards.forEach(card => card.removeEventListener('click', flipCard));
  alert('Se acabó el tiempo ⏳ ¡Intentá otra vez!');
}

const winModal = document.getElementById('winModal');
const goHomeBtn = document.getElementById('goHomeBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

function showWinModal() {
  winModal.classList.remove('hidden');
  clearInterval(intervalId);
  // Bloquear cartas para que no se puedan seguir clickeando
  const allCards = document.querySelectorAll('.memory-card');
  allCards.forEach(card => card.removeEventListener('click', flipCard));
}

function hideWinModal() {
  winModal.classList.add('hidden');
}

goHomeBtn.addEventListener('click', () => {
  // Redirige a la página de inicio
  window.location.href = '../../index.html'; 
});

playAgainBtn.addEventListener('click', () => {
  hideWinModal();
  restartGame();
});


function restartGame() {
  tries = 0;
  triesDisplay.textContent = tries;
  flippedCards = [];
  matchedCards = [];
  game.innerHTML = '';
  createCards();
  startTimer();
}

restartBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  restartGame();
});

restartGame();
