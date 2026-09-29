const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const difficultySelect = document.getElementById('difficulty');
const mapSizeSelect = document.getElementById('mapSize');
const startBtn = document.getElementById('startBtn');

const gridSize = 20;
let tileCount = canvas.width / gridSize;

let score = 0;
let snakeX = 10;
let snakeY = 10;
let velocityX = 0;
let velocityY = 0;

let snakeBody = [];
let tailLength = 2;

let foodX = 5;
let foodY = 5;

let gameInterval = null;
let gameSpeed = 100;
let isGameRunning = false;

function initGame() {
  const size = parseInt(mapSizeSelect.value);
  canvas.width = size;
  canvas.height = size;
  tileCount = size / gridSize;

  gameSpeed = parseInt(difficultySelect.value);

  score = 0;
  scoreElement.textContent = score;
  snakeX = Math.floor(tileCount / 2);
  snakeY = Math.floor(tileCount / 2);
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  tailLength = 2;

  placeFood();

  if (gameInterval) clearInterval(gameInterval);
  isGameRunning = true;
  gameInterval = setInterval(drawGame, gameSpeed);
}

function drawGame() {
  changeSnakePosition();

  if (isGameOver()) {
    clearInterval(gameInterval);
    isGameRunning = false;
    showGameOver();
    return;
  }

  clearScreen();
  checkFoodCollision();
  drawFood();
  drawSnake();
}

function showGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Гра закінчена!", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "16px sans-serif";
  ctx.fillText(`Ваш результат: ${score}`, canvas.width / 2, canvas.height / 2 + 25);
}

function isGameOver() {
  if (velocityX === 0 && velocityY === 0) return false;

  if (snakeX < 0 || snakeX >= tileCount || snakeY < 0 || snakeY >= tileCount) {
    return true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeBody[i].x === snakeX && snakeBody[i].y === snakeY) {
      return true;
    }
  }

  return false;
}

function clearScreen() {
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = '#4eef90';
  for (let i = 0; i < snakeBody.length; i++) {
    let part = snakeBody[i];
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  }

  snakeBody.push({ x: snakeX, y: snakeY });
  while (snakeBody.length > tailLength) {
    snakeBody.shift();
  }

  ctx.fillStyle = '#22c55e';
  ctx.fillRect(snakeX * gridSize, snakeY * gridSize, gridSize - 2, gridSize - 2);
}

function changeSnakePosition() {
  snakeX += velocityX;
  snakeY += velocityY;
}

function drawFood() {
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
}

function placeFood() {
  foodX = Math.floor(Math.random() * tileCount);
  foodY = Math.floor(Math.random() * tileCount);
}

function checkFoodCollision() {
  if (foodX === snakeX && foodY === snakeY) {
    placeFood();
    tailLength++;
    score += 10;
    scoreElement.textContent = score;
  }
}

document.body.addEventListener('keydown', (event) => {
  if (!isGameRunning) return;

  if (event.keyCode === 38 && velocityY !== 1) { // Вгору
    velocityX = 0; velocityY = -1;
  }
  if (event.keyCode === 40 && velocityY !== -1) { // Вниз
    velocityX = 0; velocityY = 1;
  }
  if (event.keyCode === 37 && velocityX !== 1) { // Ліворуч
    velocityX = -1; velocityY = 0;
  }
  if (event.keyCode === 39 && velocityX !== -1) { // Праворуч
    velocityX = 1; velocityY = 0;
  }
});

difficultySelect.addEventListener('change', initGame);
mapSizeSelect.addEventListener('change', initGame);
startBtn.addEventListener('click', initGame);

initGame();
