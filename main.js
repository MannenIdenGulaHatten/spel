const canvas = document.getElementById('menueCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// cursor size
const radius = 5;


let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let currentX = mouseX;
let currentY = mouseY;

function drawCursor(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  currentX += (mouseX - currentX) * 0.1;
  currentY += (mouseY - currentY) * 0.1;

  drawCursor(currentX, currentY);
  requestAnimationFrame(animate);
}

animate();
