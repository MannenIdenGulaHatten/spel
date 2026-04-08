import { createCursor } from './cursor.js';
import { createTargetSystem } from './target.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById("startOverlay");

// ---------------------------
// Resize canvas
// ---------------------------
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);


// ---------------------------
// Timer
// ---------------------------
let gameDuration = 30; // seconds
let timeLeft = gameDuration;
let gameRunning = false;

function startTimer() {
  const timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function drawTimer() {
  ctx.save();
  ctx.fillStyle = 'red';
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Time: ${timeLeft}`, canvas.width / 2, 30);
  ctx.restore();
}

// ---------------------------
// Fullscreen + pointer lock
// ---------------------------
function enterFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
}

function lockPointer() {
  if (canvas.requestPointerLock) {
    canvas.requestPointerLock();
  }
}

// ---------------------------
// Score & difficulty
// ---------------------------
let score = 0;
let correctClicks = 0;

const difficulty = localStorage.getItem("difficulty") || "Easy";
console.log("Loaded difficulty:", difficulty);

// ---------------------------
// Systems
// ---------------------------
const targets = createTargetSystem(canvas, ctx);
const cursor = createCursor(canvas, ctx);

// ---------------------------
// Start game (overlay click)
// ---------------------------
overlay.addEventListener("click", startGame, { once: true });

function startGame() {
  enterFullscreen();
  lockPointer();

  overlay.style.display = "none";

  // spawn targets
  targets.spawnTargets(5);

  let bombCount = 0;
  if (difficulty === "Medium") bombCount = 1;
  else if (difficulty === "MEGA HARD") bombCount = 2;

  targets.spawnBombs(bombCount);

  startTimer();
  animate(); 
}

// ---------------------------
// Click handling
// ---------------------------
canvas.addEventListener('click', (e) => {
  const result = targets.handleClick(e.clientX, e.clientY);

  if (result && result !== 0) {
    score += result.points;

    if (result.type === "target") {
      correctClicks++;

      targets.spawnTargets(1);

      if (correctClicks >= 3) {
        targets.respawnBombs();
        correctClicks = 0;
      }
    }

    console.log("Score:", score);
  }
});

// ---------------------------
// Draw score
// ---------------------------
function drawScore() {
  ctx.save();
  ctx.fillStyle = 'green';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.restore();
}

// ---------------------------
// End game
// ---------------------------

function endGame() {
  gameRunning = false;

  console.log("Game Over! Final Score:", score);

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000); // 2 seconds
}

// ---------------------------
// Game loop
// ---------------------------
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  targets.draw();
  cursor.update();
  cursor.draw();

  drawScore();
  drawTimer();

  requestAnimationFrame(animate);
}