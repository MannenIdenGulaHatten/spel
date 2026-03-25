import { createCursor } from './cursor.js';
import { createTargetSystem } from './target.js';

// ---------------------------
// Canvas setup
// ---------------------------
const canvas = document.getElementById('menueCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ---------------------------
// Score & difficulty
// ---------------------------
let score = 0;

// get difficulty from menu
const difficulty = localStorage.getItem("difficulty") || "Easy";
console.log("Loaded difficulty:", difficulty);

// ---------------------------
// Create targets system
// ---------------------------
const targets = createTargetSystem(canvas, ctx);

// spawn targets (always a fixed number)
targets.spawnTargets(5);

// spawn bombs based on difficulty
let bombCount = 0;
if (difficulty === "Medium") bombCount = 1;
else if (difficulty === "MEGA HARD") bombCount = 2;

targets.spawnBombs(bombCount);

// ---------------------------
// Cursor system
// ---------------------------
const cursor = createCursor(canvas, ctx);

// ---------------------------
// Click handling
// ---------------------------
let correctClicks = 0;

canvas.addEventListener('click', (e) => {
  const result = targets.handleClick(e.clientX, e.clientY);

  if (result !== null && result !== 0) {
    score += result.points;

    if (result.type === "target") {
      correctClicks++;

      targets.spawnTargets(1);

      // every 3 correct clicks, respawn bombs
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
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 20, 20);
  ctx.restore();
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

  requestAnimationFrame(animate);
}

animate();