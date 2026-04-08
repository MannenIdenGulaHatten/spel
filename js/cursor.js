export function createCursor(canvas, ctx) {
  const radius = 16; // controls size of image
  const lerpSpeed = 0.8;

  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  // Load image
  const img = new Image();
  img.src = "images/cursorimage.png";

  window.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === canvas) {
      mouseX += e.movementX;
      mouseY += e.movementY;
    } else {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    // Clamp inside canvas
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
    if (!img.complete) return; // wait for image

    ctx.drawImage(
      img,
      currentX - radius,
      currentY - radius,
      radius * 2,
      radius * 2
    );
  }

  return { update, draw };
}