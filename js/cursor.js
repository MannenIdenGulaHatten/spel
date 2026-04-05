export function createCursor(canvas, ctx) {
  const radius = 5;
  const lerpSpeed = 0.8;

  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === canvas) {
      // Pointer lock mode (relative movement) (where did mouse move)
      mouseX += e.movementX;
      mouseY += e.movementY;
    } else {
      // Normal mode (absolute position) (mouse position)
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
  
    // keep cursor inside canvas
    mouseX = Math.max(0, Math.min(canvas.width, mouseX));
    mouseY = Math.max(0, Math.min(canvas.height, mouseY));
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
