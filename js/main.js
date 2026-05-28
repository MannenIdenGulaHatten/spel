/* global fetch */
import { createCursor } from './cursor.js';
import { createTargetSystem } from './target.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const finalScoreText = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("startOverlay");
const endOverlay = document.getElementById("endOverlay");

const API_URL = "https://spel-timo-1234324324.onrender.com";

const difficulty = (localStorage.getItem("difficulty") || "easy").toLowerCase();
const iceMode = localStorage.getItem("iceMode") === "true";

let score = 0;
let correctClicks = 0;
let gameRunning = false;
let timeLeft = 30;
let timerInterval;

const targets = createTargetSystem(canvas, ctx);
const cursor = createCursor(canvas, ctx, { iceMode });

// ---------------------------
// Resize
// ---------------------------
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ---------------------------
// TIMER
// ---------------------------
async function startTimer() {
  await fetch(`${API_URL}/start-timer?mode=${difficulty}`);
}

async function updateTimer() {
  const res = await fetch(`${API_URL}/timer`);
  const data = await res.json();

  timeLeft = data.timeLeft;

  if (timeLeft <= 0 && gameRunning) {
    endGame();
  }
}

// ---------------------------
// GAME START
// ---------------------------
overlay.addEventListener("click", startGame, { once: true });

function startGame() {
  overlay.style.display = "none";
  gameRunning = true;

  enterFullscreen();
  canvas.requestPointerLock();

  targets.spawnTargets(5);

  let bombCount = 0;
  if (difficulty === "medium") bombCount = 1;
  else if (difficulty === "megahard") bombCount = 2;

  targets.spawnBombs(bombCount);

  startTimer();
  timerInterval = setInterval(updateTimer, 1000);

  animate();
}

// ---------------------------
// FULLSCREEN
// ---------------------------
function enterFullscreen() {
  const elem = document.documentElement;
  elem.requestFullscreen?.();
}

// ---------------------------
// CLICK SYSTEM
// ---------------------------
canvas.addEventListener('click', () => {
  const pos = cursor.getPosition();
  const result = targets.handleClick(pos.x, pos.y);

  if (!result || result === 0) return;

  score += result.points;

  if (result.type === "target") {
    correctClicks++;
    targets.spawnTargets(1);

    if (correctClicks >= 3) {
      targets.respawnBombs();
      correctClicks = 0;
    }
  }
});

// ---------------------------
// DRAW UI
// ---------------------------
function drawScore() {
  ctx.fillStyle = 'green';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function drawTimer() {
  ctx.fillStyle = 'red';
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Time: ${timeLeft}`, canvas.width / 2, 30);
}

// ---------------------------
// END GAME
// ---------------------------
function endGame() {
  gameRunning = false;

  clearInterval(timerInterval);

  finalScoreText.textContent = `Score: ${score}`;

  saveScore(score);
  displayLeaderboard();

  endOverlay.style.display = "flex";
  requestAnimationFrame(() => endOverlay.classList.add("show"));

  document.exitPointerLock?.();
}

// ---------------------------
// LEADERBOARD
// ---------------------------
function saveScore(score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const list = document.getElementById("leaderboard");
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  list.innerHTML = "";

  leaderboard.forEach((scoreVal, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${scoreVal}`;

    if (scoreVal === score) {
      li.style.color = "yellow";
    }

    list.appendChild(li);
  });
}

// ---------------------------
// BUTTONS
// ---------------------------
restartBtn.addEventListener("click", () => location.reload());

menuBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// ---------------------------
// GAME LOOP
// ---------------------------
function animate() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  targets.draw();
  cursor.update();
  cursor.draw();

  drawScore();
  drawTimer();

  requestAnimationFrame(animate);
}