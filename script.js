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

// Starte die Musik automatisch, wenn das Spiel geladen wird
window.addEventListener('load', function() {
    music.play().catch(error => console.log("Autoplay verhindert, Benutzerinteraktion erforderlich."));
});

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

function initializeFruits() {
    apples = [];
    for (let i = 0; i < fruitAmount; i++) {
        apples.push({ x: getRandomInt(0, mapSize / grid), y: getRandomInt(0, mapSize / grid) });
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) * grid;
}

function resetGame() {
    if (score > highscore) {
        highscore = score;
        document.getElementById('scoreboard').children[0].textContent = 'Highscore: ' + highscore;
    }
    score = 0;
    document.getElementById('scoreboard').children[1].textContent = 'Score: ' + score;

    snake.x = 0;
    snake.y = 0;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    initializeFruits();
}

function drawGrid() {
    context.strokeStyle = '#b17a1d';
    context.lineWidth = 1;

    for (var x = 0; x < canvas.width; x += grid) {
        for (var y = 0; y < canvas.height; y += grid) {
            context.strokeRect(x, y, grid - 1, grid - 1);
        }
    }
}

function loop() {
    requestAnimationFrame(loop);
    if (++count < speed) {
        return;
    }
    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0 || snake.x >= mapSize || snake.y < 0 || snake.y >= mapSize) {
        resetGame();
        return;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Früchte zeichnen
    apples.forEach((apple) => {
        context.drawImage(fruitImages[fruitType], apple.x, apple.y, grid - 1, grid - 1);
    });

    // Snake zeichnen
    snake.cells.forEach(function (cell, index) {
        if (index === 0) {
            // Kopf der Schlange
            context.fillStyle = 'green';
            context.fillRect(cell.x, cell.y, grid, grid);

            // Border für den Kopf
            context.strokeStyle = 'black';
            context.lineWidth = 1;
            context.strokeRect(cell.x, cell.y, grid, grid);

            // Augen
            context.fillStyle = 'white';
            context.fillRect(cell.x + 10, cell.y + 15, 10, 10);
            context.fillRect(cell.x + 30, cell.y + 15, 10, 10);
        } else {
            // Körper
            context.fillStyle = 'green';
            context.strokeStyle = 'black';
            context.lineWidth = 1;
            context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
            context.strokeRect(cell.x, cell.y, grid - 1, grid - 1);
        }

        // Kollisionsprüfung mit Früchten
        apples.forEach((apple, index) => {
            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                score++;
                document.getElementById('scoreboard').children[1].textContent = 'Score: ' + score;
                apples[index] = { x: getRandomInt(0, mapSize / grid), y: getRandomInt(0, mapSize / grid) };
            }
        });

        // Kollision mit sich selbst
        for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
                return;
            }
        }
    });
}

document.addEventListener('keydown', function (e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

document.getElementById('speed').addEventListener('change', function () {
    let value = this.value;
    speed = value === 'normal' ? 10 : value === 'fast' ? 7 : 5;
});

document.getElementById('mapsize').addEventListener('change', function () {
    let value = this.value;
    mapSize = value === 'small' ? 400 : value === 'medium' ? 500 : 600;
    canvas.width = mapSize;
    canvas.height = mapSize;
    resetGame();
});

document.getElementById('fruit-amount').addEventListener('change', function () {
    fruitAmount = parseInt(this.value);
    initializeFruits();
});

document.getElementById('fruit').addEventListener('change', function () {
    fruitType = this.value;
});

initializeFruits();
requestAnimationFrame(loop);
