const canvas = document.getElementById('menueCanvas');
const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;




const targets = [
  { size: 20, points: 10, src: 'images/larsonPrison.png' },
];





const radius = 5; //cursor storlek
const lerpSpeed = 0.8; // hur tight den är med musen

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

let currentX = mouseX;
let currentY = mouseY;
// gör så att musen föjer "musen" vart du än är
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// om du klickar så är musen där du klickar
window.addEventListener('mousedown', () => {
  currentX = mouseX;
  currentY = mouseY;
});
// målar
function drawCursor(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  currentX += (mouseX - currentX) * lerpSpeed;
  currentY += (mouseY - currentY) * lerpSpeed;

  drawCursor(currentX, currentY);
  requestAnimationFrame(animate);
}

animate();
