const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const preMenu = document.getElementById("preMenu");
    const postMenu = document.getElementById("postMenu");
    const countdownDiv = document.getElementById("countdown");

    const birdImg = new Image();
    birdImg.src = '../assets/imagesGame1/alfajor.png';

    const topPipeImg = new Image();
    topPipeImg.src = '../assets/imagesGame3/brazosup.png';

    const bottomPipeImg = new Image();
    bottomPipeImg.src = '../assets/imagesGame3/brazoinf.png';

    let birdY = canvas.height / 2;
    let velocity = 0;
    let gravity = 0.2;
    let pipeX = canvas.width;
    let pipeGap = 150;
    let pipeWidth = 50;
    let topPipeHeight = Math.random() * (canvas.height - pipeGap);
    let bottomPipeY = topPipeHeight + pipeGap;
    let score = 0;
    let gameOver = false;

    function drawBird() {
        ctx.drawImage(birdImg, 50, birdY, 20, 20); // Dibuja la imagen del pájaro
    }

    function drawPipes() {
        ctx.drawImage(topPipeImg, pipeX, 0, pipeWidth, topPipeHeight); // Dibuja la imagen del pilar superior
        ctx.drawImage(bottomPipeImg, pipeX, bottomPipeY, pipeWidth, canvas.height - bottomPipeY); // Dibuja la imagen del pilar inferior
    }

    function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 30);
    }

    function update() {
        if (gameOver) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBird();
        drawPipes();
        drawScore();

        birdY += velocity;
        velocity += gravity;

        pipeX -= 2;

        if (pipeX + pipeWidth < 0) {
            pipeX = canvas.width;
            topPipeHeight = Math.random() * (canvas.height - pipeGap);
            bottomPipeY = topPipeHeight + pipeGap;
            score++;
            if (score === 10) {
                endGame(true);
            }
        }

        if (birdY > canvas.height || birdY < 0 ||
            (50 >= pipeX && 50 <= pipeX + pipeWidth &&
            (birdY <= topPipeHeight || birdY >= bottomPipeY))) {
            endGame(false);
        }

        requestAnimationFrame(update);
    }

    function startGame() {
        preMenu.style.display = "none";
        countdownDiv.style.display = "block";
        countDown();
    }

    function countDown() {
        let count = 3;
        countdownDiv.innerText = count;
        const countdownInterval = setInterval(() => {
            count--;
            if (count === 0) {
                countdownDiv.innerText = "¡Go!";
                setTimeout(() => {
                    countdownDiv.style.display = "none";
                    canvas.style.display = "block";
                    canvas.addEventListener("click", jump);
                    update();
                    clearInterval(countdownInterval);
                }, 1000);
            } else {
                countdownDiv.innerText = count;
            }
        }, 1000);
    }

    function jump() {
        velocity = -5;
    }

    function endGame(won) {
        gameOver = true;
        canvas.style.display = "none";
        postMenu.innerHTML = `
            <p>${won ? "¡Ganaste!" : "¡Perdiste!"}</p>
            <p>Puntaje: ${score}</p>
            <button onclick="location.reload()">Volver a Jugar</button>
        `;
        postMenu.style.display = "block";
    }
