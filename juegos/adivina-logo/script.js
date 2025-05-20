let currentLogo = 0;
let shuffledLogos = [];

const logoImg = document.getElementById('logo-img');
const userAnswer = document.getElementById('user-answer');
const submitBtn = document.getElementById('submit-btn');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadLogo() {
  const logo = shuffledLogos[currentLogo];
  logoImg.src = logo.img;
  logoImg.style.filter = 'blur(8px)'; // Aplica blur al cargar
  logoImg.style.display = 'block';
  userAnswer.style.display = 'inline-block';
  submitBtn.style.display = 'inline-block';
  userAnswer.value = '';
  feedback.textContent = '';
  nextBtn.style.display = 'none';
}

submitBtn.addEventListener('click', () => {
  const respuesta = userAnswer.value.trim().toLowerCase();
  const correcta = shuffledLogos[currentLogo].answer;

  if (respuesta === correcta) {
    logoImg.style.filter = 'none'; // Quita el blur
    feedback.textContent = '¡Correcto!';
    feedback.style.color = 'lime';
    nextBtn.style.display = 'inline-block';
  } else {
    feedback.textContent = 'Incorrecto. Intenta de nuevo.';
    feedback.style.color = 'red';
  }
});

nextBtn.addEventListener('click', () => {
  currentLogo++;
  if (currentLogo < shuffledLogos.length) {
    loadLogo();
  } else {
    feedback.textContent = '¡Juego completado!';
    logoImg.style.display = 'none';
    userAnswer.style.display = 'none';
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block'; // Mostrar botón de reinicio
  }
});

restartBtn.addEventListener('click', () => {
  location.reload(); // Reinicia la página
});

window.onload = () => {
  shuffledLogos = shuffle([...logos]); // copia y mezcla
  loadLogo();
};
