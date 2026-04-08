import { createCursor } from './cursor.js';
import { createTargetSystem } from './target.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const finalScoreText = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("startOverlay");
const endOverlay = document.getElementById("endOverlay");


document.addEventListener("pointerlockchange", () => {
  console.log("Pointer locked to:", document.pointerLockElement);
}); //Debug

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
let timerInterval;

function startTimer() {
  clearInterval(timerInterval);

  timeLeft = gameDuration; //

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft < 0) {
      timeLeft = 0;
    }

    if (timeLeft === 0) {
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
  if (document.pointerLockElement === canvas) return;

  canvas.requestPointerLock?.();
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

  overlay.style.display = "none";

  gameRunning = true;

  targets.spawnTargets(5);

  let bombCount = 0;
  if (difficulty === "Medium") bombCount = 1;
  else if (difficulty === "MEGA HARD") bombCount = 2;

  targets.spawnBombs(bombCount);

  startTimer();

  // viktigt tydligen
  canvas.requestPointerLock();

  animate(); 
}

// ---------------------------
// Click handling
// ---------------------------
canvas.addEventListener('click', (e) => {
  const pos = cursor.getPosition();
  const result = targets.handleClick(pos.x, pos.y);

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
  console.log("END GAME CALLED"); // debugger
  gameRunning = false;

  clearInterval(timerInterval);

  finalScoreText.textContent = `Score: ${score}`;

  endOverlay.style.display = "flex";

  requestAnimationFrame(() => {
    endOverlay.classList.add("show");
  });

  document.exitPointerLock();
}

restartBtn.addEventListener("click", () => {
  location.reload();
});

menuBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

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