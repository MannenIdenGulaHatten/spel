export function createCursor(canvas, ctx, options = {}) {
  const iceMode = options.iceMode || false;
  const radius = 16;
  let lerpSpeed;

  if (iceMode) {
    lerpSpeed = 0.05; // slippery
  } else {
    lerpSpeed = 1; // normal
  }

  // Logical mouse position (target)
  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;

  // Rendered cursor position (smoothed)
  let currentX = mouseX;
  let currentY = mouseY;

  // Load cursor image
  const img = new Image();
  img.src = "images/cursorimage.png";

  // Mouse movement handler
  window.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === canvas) {
      // Pointer lock mode (FPS-style)
      mouseX += e.movementX;
      mouseY += e.movementY;
    } else {
      // Normal mode
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    // Clamp inside canvas
    mouseX = Math.max(0, Math.min(canvas.width, mouseX));
    mouseY = Math.max(0, Math.min(canvas.height, mouseY));
  });

  // Update smooth cursor position
  function update() {
    currentX += (mouseX - currentX) * lerpSpeed;
    currentY += (mouseY - currentY) * lerpSpeed;
  }

  // Draw cursor
  function draw() {
    if (!img.complete) return;

    ctx.drawImage(
      img,
      currentX - radius,
      currentY - radius,
      radius * 2,
      radius * 2
    );
  }

  function getPosition() {
    return {
      x: currentX,
      y: currentY
    };
  }

  function setLerpSpeed(speed) {
    lerpSpeed = speed;
  }

  return {
    update,
    draw,
    getPosition,
    setLerpSpeed
  };
}
