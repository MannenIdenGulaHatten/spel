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

// create systems
const cursor = createCursor(canvas, ctx);
const targets = createTargetSystem(canvas, ctx);

// spawn initial targets
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
