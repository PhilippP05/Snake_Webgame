// Spielfeld und Kontext abrufen
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 50;
var count = 0;
var score = 0;
var highscore = 0;
var speed = 10;
var fruitType = 'apple';
var mapSize = 500;
var fruitAmount = 1;

var music = document.getElementById('background-music');

// Startvariable für das Spiel
var gameStarted = false;

// Snake Objekt
var snake = {
    x: 0,
    y: 0,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

// Früchte laden
var fruitImages = {
    apple: new Image(),
    banana: new Image(),
    orange: new Image()
};

fruitImages.apple.src = "fruits/apple.png";
fruitImages.banana.src = "fruits/banana.png";
fruitImages.orange.src = "fruits/orange.png";

var apples = [];

// Startbildschirm anzeigen
function showStartScreen() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("Drücke eine Pfeiltaste zum Starten", canvas.width / 2, canvas.height / 2);
}

// Spiel zurücksetzen und erneut starten
function resetGame() {
    snake.x = 0;
    snake.y = 0;
    snake.dx = grid;
    snake.dy = 0;
    snake.cells = [];
    snake.maxCells = 4;
    score = 0;
    apples = [];
    initializeFruits();
    gameStarted = false;
    showStartScreen();
}

// Startbildschirm anzeigen, wenn das Spiel geladen wird
window.onload = function() {
    showStartScreen();
};

// Tastendruck-Ereignislistener hinzufügen
document.addEventListener('keydown', function(e) {
    if (!gameStarted && (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        gameStarted = true;
        requestAnimationFrame(loop);
    }

    // Bewegung nur zulassen, wenn das Spiel gestartet ist
    if (gameStarted) {
        if (e.key === "ArrowLeft" && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        } else if (e.key === "ArrowUp" && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        } else if (e.key === "ArrowRight" && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        } else if (e.key === "ArrowDown" && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        }
    }
});

// Spielschleife
function loop() {
    if (!gameStarted) {
        return; // Stoppe das Spiel, wenn es nicht gestartet ist
    }

    requestAnimationFrame(loop);
    if (++count < speed) {
        return;
    }
    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    // Kollision mit Wänden oder sich selbst
    if (snake.x < 0 || snake.y < 0 || snake.x >= canvas.width || snake.y >= canvas.height) {
        resetGame();
        return;
    }

    // Zeichenprozess für Snake und Früchte hier einfügen...

    // Falls Game Over, dann erneut Startbildschirm anzeigen
    if (!gameStarted) {
        showStartScreen();
    }
}
