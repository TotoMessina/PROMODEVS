const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const centerX = canvas.width - 100;
const centerY = canvas.height / 2;
const radius = 40;

let isCharging = false;
let power = 0;
let maxPower = 100;
let angle = 0;
let score = 0;
let shotsLeft = 2;
let arrows = [];

const powerDisplay = document.getElementById("power");
const shotsLeftDisplay = document.getElementById("shotsLeft");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

// Dibuja el blanco
function drawTarget() {
  for (let i = 3; i >= 1; i--) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * i / 3, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? "white" : "red";
    ctx.fill();
  }
}

// Dibuja las flechas volando
function drawArrows() {
  arrows.forEach(arrow => {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.angle);
    ctx.fillStyle = "lime";
    ctx.fillRect(-10, -2, 20, 4);
    ctx.restore();
  });
}

// Actualiza posición de las flechas
function updateArrows() {
  arrows.forEach(arrow => {
    arrow.x += arrow.vx;
    arrow.y += arrow.vy;
  });

  // Detecta impacto
  arrows = arrows.filter(arrow => {
    const dx = arrow.x - centerX;
    const dy = arrow.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (arrow.x > canvas.width || arrow.y < 0 || arrow.y > canvas.height || dist < radius) {
      if (dist < radius) {
        const pts = Math.max(0, 100 - Math.floor((dist / radius) * 100));
        score += pts;
        scoreDisplay.textContent = score;
      }
      if (--shotsLeft > 0) {
        shotsLeftDisplay.textContent = shotsLeft;
      } else {
        shotsLeftDisplay.textContent = 0;
        restartBtn.style.display = "inline-block";
      }
      return false;
    }
    return true;
  });
}

// Bucle principal
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTarget();
  drawArrows();
  updateArrows();
  requestAnimationFrame(draw);
}

canvas.addEventListener("mousedown", e => {
  if (shotsLeft <= 0) return;
  isCharging = true;
  power = 0;
});

canvas.addEventListener("mouseup", e => {
  if (!isCharging || shotsLeft <= 0) return;
  isCharging = false;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  angle = Math.atan2(mouseY - centerY, mouseX - centerX);

  const velocity = Math.min(power, maxPower) / 5;
  arrows.push({
    x: 50,
    y: canvas.height / 2,
    vx: velocity * Math.cos(angle),
    vy: velocity * Math.sin(angle),
    angle: angle
  });

  power = 0;
  powerDisplay.textContent = power;
});

function chargePower() {
  if (isCharging && power < maxPower) {
    power += 1;
    powerDisplay.textContent = power;
  }
  setTimeout(chargePower, 30);
}

restartBtn.addEventListener("click", () => {
  score = 0;
  shotsLeft = 2;
  arrows = [];
  power = 0;
  scoreDisplay.textContent = score;
  shotsLeftDisplay.textContent = shotsLeft;
  restartBtn.style.display = "none";
});

chargePower();
draw();
