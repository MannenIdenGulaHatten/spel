import { createCursor } from './cursor.js';
import { createTargetSystem } from './target.js';

// canvas
const canvas = document.getElementById('menueCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// score
let score = 0;

// load difficulty
const savedDifficulty = localStorage.getItem("difficulty") || "Easy";
console.log("Loaded difficulty:", savedDifficulty);

// difficulty add bomb amount
function getBombAmount() {
  if (savedDifficulty === "Easy") {
    return 0;
  } else if (savedDifficulty === "Medium") {
    return 1;
  } else if (savedDifficulty === "MEGA HARD") {
    return 2;
  }
}

// create systems
const cursor = createCursor(canvas, ctx);
const targets = createTargetSystem(canvas, ctx, getBombAmount());

// spawn targets
targets.spawn(5);

// click handling
let correctClicks = 0;

canvas.addEventListener('click', (e) => {
  const result = targets.handleClick(e.clientX, e.clientY);

  if (result !== null) {
    score += result.points;

    if (result.type === "target") {
      correctClicks++;

      if (correctClicks >= 3) {
        targets.respawnBombs();
        correctClicks = 0;
      }
    }

    console.log("Score:", score);
  }
});

// draw score
function drawScore() {
  ctx.save();
  ctx.fillStyle = 'green';
  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 20, 20);
  ctx.restore();
}

// game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  targets.draw();
  cursor.update();
  cursor.draw();
  drawScore();

  requestAnimationFrame(animate);
}

animate();