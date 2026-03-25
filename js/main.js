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
console.log("Easy button found:", easyBtn); //
const mediumBtn = document.getElementById("mediumBtn");
console.log("medium button found:", easyBtn); //
const hardBtn = document.getElementById("hardBtn");
console.log("hard button found:", easyBtn); //

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
function getBombAmount() {
  if (selectedDifficulty === "Easy") {
    return 0;
  } else if (selectedDifficulty === "Medium") {
    return 1;
  } else if (selectedDifficulty === "MEGA HARD") {
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

        if (result.type === "target") {   // correct clicks = not bombs... so if not bomb 3 time reset bomb place so they dont stay stuck.
            correctClicks++;

            if (correctClicks >= 3) {
                targets.respawnBombs();
                correctClicks = 0;
            }
        }

        console.log("Score:", score);
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
