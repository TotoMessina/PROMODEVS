const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 50;
const cols = Math.floor(canvas.width / tileSize);
const rows = Math.floor(canvas.height / tileSize);

const playerSpeed = 0.06;
const ghostSpeed = 0.03;

let player = {
    x: Math.floor(cols / 2),
    y: Math.floor(rows / 2),
    score: 0
};

let ghosts = [
    { x: Math.floor(cols / 4), y: Math.floor(rows / 4), image: '../assets/imagesGame5/shovel.png', pattern: 'horizontal', dx: ghostSpeed, dy: -ghostSpeed },
    { x: Math.floor(cols * 3 / 4), y: Math.floor(rows / 4), image: '../assets/imagesGame5/karen.png', pattern: 'counterclockwiseCircle', dx: ghostSpeed, dy: ghostSpeed },
    { x: Math.floor(cols / 4), y: Math.floor(rows * 3 / 4), image: '../assets/imagesGame5/Kkk.png', pattern: 'cross', dx: ghostSpeed, dy: ghostSpeed },
    { x: Math.floor(cols * 3 / 4), y: Math.floor(rows * 3 / 4), image: '../assets/imagesGame5/pol.png', pattern: 'horizontal', dx: ghostSpeed, dy: 0 }
];

let points = [];

const playerImage = new Image();
playerImage.src = '../assets/imagesGame5/nword.png';

const ghostImages = ghosts.map(ghost => {
    const image = new Image();
    image.src = ghost.image;
    return image;
});

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Eventos de clic para botones de dirección
document.getElementById('upButton').addEventListener('click', () => startMoving('Up'));
document.getElementById('leftButton').addEventListener('click', () => startMoving('Left'));
document.getElementById('downButton').addEventListener('click', () => startMoving('Down'));
document.getElementById('rightButton').addEventListener('click', () => startMoving('Right'));

function createPoints() {
    points = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (i % 2 === 0 && j % 2 === 0) {
                points.push({ x: i, y: j });
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc((point.x + 0.5) * tileSize, (point.y + 0.5) * tileSize, 2, 0, 2 * Math.PI);
        ctx.fill();
    });

    ctx.drawImage(playerImage, player.x * tileSize, player.y * tileSize, tileSize, tileSize);

    ghosts.forEach((ghost, index) => {
        ctx.drawImage(ghostImages[index], ghost.x * tileSize, ghost.y * tileSize, tileSize, tileSize);
    });

    ctx.fillText('Puntuación: ' + player.score, 10, 20);
}

function update() {
    playerMovement();

    ghosts.forEach(ghost => {
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

        if (ghost.x <= 0 || ghost.x >= cols - 1) ghost.dx *= -1;
        if (ghost.y <= 0 || ghost.y >= rows - 1) ghost.dy *= -1;
    });

    ghosts.forEach(ghost => {
        if (Math.abs(player.x - ghost.x) < 0.5 && Math.abs(player.y - ghost.y) < 0.5) {
            gameOver();
        }
    });

    points.forEach((point, index) => {
        if (Math.abs(player.x - point.x) < 0.5 && Math.abs(player.y - point.y) < 0.5) {
            player.score++;
            points.splice(index, 1);
        }
    });

    if (points.length === 0) {
        gameWin();
    }
}

function isWall(x, y) {
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);
    return (tileX < 0 || tileY < 0 || tileX >= cols || tileY >= rows);
}

function gameOver() {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = `<p>¡Perdiste! Vuelve a intentarlo.</p><button onclick="window.location.reload()">Reiniciar</button>`;
    messageElement.style.display = 'block';
    
    canvas.style.display = 'none';
    
    // Ocultar los botones de movimiento
    document.querySelectorAll('.controls button').forEach(button => {
        button.style.display = 'none';
    });
}

function gameWin() {
    showMessage('¡Ganaste! Canjea tu premio.');
    
    // Ocultar los botones de movimiento
    document.querySelectorAll('.controls button').forEach(button => {
        button.style.display = 'none';
    });
}

function showMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = `<p>${message}</p>`;
    messageElement.style.display = 'block';
    
    canvas.style.display = 'none';
}

const keyPressed = {};
function handleKeyDown(event) {
    keyPressed[event.key] = true;
}

function handleKeyUp(event) {
    keyPressed[event.key] = false;
}

function playerMovement() {
    if (keyPressed['ArrowUp'] && player.y > 0 && !isWall(player.x, player.y - playerSpeed)) player.y -= playerSpeed;
    if (keyPressed['ArrowRight'] && player.x < cols - 1 && !isWall(player.x + playerSpeed, player.y)) player.x += playerSpeed;
    if (keyPressed['ArrowDown'] && player.y < rows - 1 && !isWall(player.x, player.y + playerSpeed)) player.y += playerSpeed;
    if (keyPressed['ArrowLeft'] && player.x > 0 && !isWall(player.x - playerSpeed, player.y)) player.x -= playerSpeed;
}

function startMoving(direction) {
    keyPressed['Arrow' + direction] = true;
}

function stopMoving() {
    keyPressed['ArrowUp'] = false;
    keyPressed['ArrowRight'] = false;
    keyPressed['ArrowDown'] = false;
    keyPressed['ArrowLeft'] = false;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

function startGame() {
    startButton.style.display = 'none';
    document.getElementById('message').style.display = 'none';
    canvas.style.display = 'block';
    createPoints();
    gameLoop();
}