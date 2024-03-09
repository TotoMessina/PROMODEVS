function startGame() {
    document.getElementById("startButton").style.display = "none"; // Ocultar el botón de "Jugar"

    // Variables de configuración
    const canvas = document.getElementById("pingPongCanvas");
    const ctx = canvas.getContext("2d");
    const paddleWidth = 120;
    const paddleHeight = 20;
    const ballRadius = 10;
    const powerUpWidth = 50;
    const powerUpHeight = 20;
    const powerUpSpeed = 2;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let ballSpeedX = 4;
    let ballSpeedY = -4;
    let isTouching = false; // Variable para detectar si se está tocando la paleta
    let touchX; // Posición X donde se toca la paleta
    let score = 0; // Contador de rebotes en la paleta
    let powerUpX = Math.random() * (canvas.width - powerUpWidth);
    let powerUpY = Math.random() * (canvas.height / 2 - powerUpHeight);
    let isMouseDown = false; // Variable para verificar si el botón del mouse está presionado
    let rightPressed = false;
    let leftPressed = false;

    // Variables del obstáculo
    let obstacleX = Math.random() * (canvas.width - paddleWidth);
    let obstacleY = 50;
    let obstacleWidth = 80;
    let obstacleHeight = 20;
    let obstacleSpeedX = 1;
    let obstacleSpeedY = 1;

    // Agregar eventos de escucha para el movimiento y clic del mouse
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    // Dibujar la pelota
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    // Dibujar la paleta
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    // Dibujar el potenciador
    function drawPowerUp() {
        ctx.beginPath();
        ctx.rect(powerUpX, powerUpY, powerUpWidth, powerUpHeight);
        ctx.fillStyle = "#FFFF00";
        ctx.fill();
        ctx.closePath();
    }

    // Dibujar el obstáculo
    function drawObstacle() {
        ctx.beginPath();
        ctx.rect(obstacleX, obstacleY, obstacleWidth, obstacleHeight);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath();
    }

    // Detectar colisiones y actualizar el contador
    function collisionDetection() {
        // Colisión con la paleta
        if (
            ballX > paddleX &&
            ballX < paddleX + paddleWidth &&
            ballY + ballRadius > canvas.height - paddleHeight
        ) {
            ballSpeedY = -ballSpeedY;
        }

        // Colisión con el potenciador
        if (
            ballX > powerUpX &&
            ballX < powerUpX + powerUpWidth &&
            ballY + ballRadius > powerUpY &&
            ballY - ballRadius < powerUpY + powerUpHeight
        ) {
            score++;
            resetPowerUp();
        }

        // Colisión con el obstáculo
        if (
            ballX > obstacleX &&
            ballX < obstacleX + obstacleWidth &&
            ballY + ballRadius > obstacleY &&
            ballY - ballRadius < obstacleY + obstacleHeight
        ) {
            ballSpeedX *= -1; // Cambiar la dirección de la pelota al chocar con el obstáculo
            ballSpeedY *= -1; // Cambiar la dirección de la pelota al chocar con el obstáculo
        }
    }

    // Reiniciar la posición del potenciador
    function resetPowerUp() {
        powerUpX = Math.random() * (canvas.width - powerUpWidth);
        powerUpY = Math.random() * (canvas.height / 2 - powerUpHeight);
    }

    // Mover el obstáculo
    function moveObstacle() {
        obstacleX += obstacleSpeedX;
        obstacleY += obstacleSpeedY;
        if (obstacleX + obstacleWidth > canvas.width || obstacleX < 0) {
            obstacleSpeedX = -obstacleSpeedX; // Invertir la dirección en el eje X cuando alcanza los bordes
        }
        if (obstacleY + obstacleHeight > canvas.height || obstacleY < 0) {
            obstacleSpeedY = -obstacleSpeedY; // Invertir la dirección en el eje Y cuando alcanza los bordes
        }
    }

    // Dibujar todo
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawPowerUp();
        drawObstacle();
        collisionDetection();
        moveObstacle();

        // Mostrar el contador de rebotes
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);

        // Mover la pelota
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Mover la paleta con el teclado
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        // Rebote en los bordes
        if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
            ballSpeedX = -ballSpeedX;
        }
        if (ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Game over si la pelota toca la parte inferior o el jugador alcanza 10 puntos
        if (ballY + ballRadius > canvas.height || score >= 10) {
            let message = score >= 10 ? "¡Felicidades, ganaste! Tu puntuación es: " + score : "Game Over. Tu puntuación es: " + score;
            document.getElementById("endMessageText").innerText = message;
            document.getElementById("endMessage").style.display = "block";
            clearInterval(interval); // Necesario para que no siga ejecutándose draw
        }
    }

    let interval = setInterval(draw, 10);
}

function restartGame() {
    document.location.reload();
}