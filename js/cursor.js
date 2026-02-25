export function createCursor(canvas, ctx) {
  const radius = 5;
  const lerpSpeed = 0.8;

  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  

  window.addEventListener('mousedown', () => {
    currentX = mouseX;
    currentY = mouseY;
  });
  

  function update() {
    currentX += (mouseX - currentX) * lerpSpeed;
    currentY += (mouseY - currentY) * lerpSpeed;
  }

  function draw() {
    ctx.beginPath();
    ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  return { update, draw };
}
