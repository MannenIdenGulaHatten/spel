export function createTargetSystem(canvas, ctx) {

  const targetTypes = [
    { size: 30, points: 10, src: 'images/larsonPrison.png' },
    { size: 100, points: 5, src: 'images/yahu.jpg' },
    { size: 40, points: -50, src: 'images/bombImage.png', isBomb: true } // bomben
  ];

  // preload images
  targetTypes.forEach(t => {
    const img = new Image();
    img.src = t.src;
    t.image = img;
  });

  const targets = [];

  function spawn(count = 1) {
    for (let i = 0; i < count; i++) {
      const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
      targets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type.size,
        points: type.points,
        image: type.image
      });
    }
  }

  function draw() {
    for (const t of targets) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      ctx.clip();

      ctx.drawImage(t.image, t.x - t.size, t.y - t.size, t.size * 2, t.size * 2);

      ctx.restore();
    }
  }

  function handleClick(x, y) {
    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      if (Math.hypot(x - t.x, y - t.y) < t.size) {
        targets.splice(i, 1);
        spawn(1); // replace clicked target
        return t.points;
      }
    }
    return 0;
  }

  return { spawn, draw, handleClick };
}
