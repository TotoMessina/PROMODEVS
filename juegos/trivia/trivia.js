const triviaData = [
  {
    question: "¿Cuál es la capital de Argentina?",
    options: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
    answer: "Buenos Aires"
  },
  {
    question: "¿En qué año se fundó Google?",
    options: ["1995", "1998", "2000", "2002"],
    answer: "1998"
  },
  {
    question: "¿Cuál es el color principal del logo de Instagram?",
    options: ["Azul", "Rojo", "Multicolor", "Rosa"],
    answer: "Multicolor"
  },
  {
    question: "¿Qué planeta es conocido como el Planeta Rojo?",
    options: ["Venus", "Marte", "Júpiter", "Saturno"],
    answer: "Marte"
  },
  {
    question: "¿Cuál es el animal más rápido del mundo?",
    options: ["Leopardo", "Águila", "Guepardo", "Halcon peregrino"],
    answer: "Guepardo"
  },
  {
    question: "¿Qué lenguaje de programación se usa para el desarrollo web frontend?",
    options: ["Python", "JavaScript", "C++", "Java"],
    answer: "JavaScript"
  },
  {
    question: "¿Cuál es el océano más grande del mundo?",
    options: ["Atlántico", "Índico", "Pacífico", "Ártico"],
    answer: "Pacífico"
  },
  {
    question: "¿En qué país nació el fútbol?",
    options: ["España", "Inglaterra", "Italia", "Brasil"],
    answer: "Inglaterra"
  }
];

const startBtn = document.getElementById('startTriviaBtn');
const triviaForm = document.getElementById('triviaForm');
const questionContainer = document.getElementById('questionContainer');
const triviaResult = document.getElementById('triviaResult');
const playTriviaAgainBtn = document.getElementById('playTriviaAgainBtn');
const goTriviaHomeBtn = document.getElementById('goTriviaHomeBtn');
const resultActions = document.getElementById('resultActions');

let selectedQuestions = [];
let currentIndex = 0;
let userAnswers = [];

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startTrivia() {
  selectedQuestions = shuffleArray([...triviaData]).slice(0, 5);
  currentIndex = 0;
  userAnswers = [];

  startBtn.classList.add('hidden');
  triviaResult.classList.add('hidden');
  resultActions.classList.add('hidden');
  triviaForm.classList.remove('hidden');

  showQuestion(currentIndex);
}

function showQuestion(index) {
  questionContainer.innerHTML = '';

  const q = selectedQuestions[index];

  const questionTitle = document.createElement('p');
  questionTitle.textContent = `${index + 1}. ${q.question}`;
  questionTitle.style.fontWeight = '700';
  questionTitle.style.fontSize = '1.1rem';
  questionTitle.style.marginBottom = '14px';
  questionTitle.style.textShadow = '0 0 6px #ff66ff';

  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('options');

  q.options.forEach(option => {
    const optionLabel = document.createElement('label');

    const optionInput = document.createElement('input');
    optionInput.type = 'radio';
    optionInput.name = 'answer';
    optionInput.value = option;

    optionLabel.appendChild(optionInput);
    optionLabel.appendChild(document.createTextNode(option));
    optionsDiv.appendChild(optionLabel);
  });

  questionContainer.appendChild(questionTitle);
  questionContainer.appendChild(optionsDiv);
}

function checkAnswer(e) {
  e.preventDefault();
  
  const selectedOption = triviaForm.querySelector('input[name="answer"]:checked');

  if (!selectedOption) {
    triviaResult.textContent = "Por favor seleccioná una opción.";
    triviaResult.style.color = '#ff4d6d';
    triviaResult.classList.remove('hidden');
    return;
  }

  triviaResult.classList.add('hidden');

  userAnswers.push(selectedOption.value);

  currentIndex++;

  if (currentIndex < selectedQuestions.length) {
    showQuestion(currentIndex);
  } else {
    finishTrivia();
  }
}

function finishTrivia() {
  triviaForm.classList.add('hidden');
  let allCorrect = true;

  for(let i = 0; i < selectedQuestions.length; i++) {
    if (userAnswers[i] !== selectedQuestions[i].answer) {
      allCorrect = false;
      break;
    }
  }

  triviaResult.classList.remove('hidden');
  resultActions.classList.remove('hidden');

  if (allCorrect) {
    triviaResult.textContent = "¡Felicitaciones! Respondiste todo bien.";
    triviaResult.style.color = '#8affb3';
  } else {
    triviaResult.textContent = "Algunas respuestas están incorrectas. Intentá de nuevo.";
    triviaResult.style.color = '#ff4d6d';
  }
}

const backToMenuBtn = document.getElementById('backToMenuBtn');

backToMenuBtn.addEventListener('click', () => {
  location.reload();
});


startBtn.addEventListener('click', startTrivia);
triviaForm.addEventListener('submit', checkAnswer);
playTriviaAgainBtn.addEventListener('click', startTrivia);
goTriviaHomeBtn.addEventListener('click', () => location.reload());
