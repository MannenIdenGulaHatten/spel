import { createCursor } from './cursor.js';
import { createTargetSystem } from './target.js';

const canvas = document.getElementById('menueCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let score = 0;

let selectedDifficulty = "Easy";

const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");

const buttons = [easyBtn, mediumBtn, hardBtn];

function setDifficulty(difficulty, button) {
    selectedDifficulty = difficulty;
    console.log("Selected difficulty:", selectedDifficulty);


    buttons.forEach(btn => btn.classList.remove("selected"));


    button.classList.add("selected");
}



easyBtn.addEventListener("click", () => setDifficulty("Easy", easyBtn));
mediumBtn.addEventListener("click", () => setDifficulty("Medium", mediumBtn));
hardBtn.addEventListener("click", () => setDifficulty("MEGA HARD", hardBtn));

// difficulty item management.
if (difficulty === "Easy") {
  bombAmount = 0;
} else if (difficulty === "Medium") {
  bombAmount = 1;
} else if (difficulty === "MEGA HARD") {
  bombAmount = 2;
}

// create systems
const cursor = createCursor(canvas, ctx);
const targets = createTargetSystem(canvas, ctx);

// spawn targets
targets.spawn(5);

// click handling
canvas.addEventListener('click', (e) => {
    const points = targets.handleClick(e.clientX, e.clientY);
    if (points) {
        score += points;
        console.log('Score:', score);
    }
});

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
