export function createTargetSystem(canvas, ctx) {

  const targetTypes = [
    { size: 30, points: 10, src: 'images/larsonPrison.png', isBomb: false },
    { size: 100, points: 5, src: 'images/yahu.jpg', isBomb: false }
  ];

  const bombTypes = [
    { size: 40, points: -50, src: 'images/bombImage.png', isBomb: true }
  ];

  // preload all images
  [...targetTypes, ...bombTypes].forEach(t => {
    const img = new Image();
    img.src = t.src;
    t.image = img;
  });

  const targets = [];
  const bombs = [];

  function isOverlapping(x, y, size, objects) { // function so that targets dont overlap
    for (const obj of objects) {
      const dist = Math.hypot(x - obj.x, y - obj.y);
      if (dist < size + obj.size) {
        return true; // overlap
      }
    }
    return false;
  }

  function spawnTargets(count = 5) {
    let attempts = 0;
    // always spawn exactly 'count' targets
    while (targets.length < count && attempts < 100) {
      attempts++;
      const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
      const padding = type.size;

      const x = padding + Math.random() * (canvas.width - padding * 2);
      const y = padding + Math.random() * (canvas.height - padding * 2);

    // check against BOTH targets and bombs
    if (isOverlapping(x, y, type.size, [...targets, ...bombs])) {
      continue; // try again
    }

      targets.push({
        x,
        y,
        size: type.size,
        points: type.points,
        image: type.image,
        isBomb: false
      });
    }
  }

  function spawnBombs(count = 0) {
    // remove existing bombs
    bombs.length = 0;
    let attempts = 0;

    for (let i = 0; i < count && attempts < 100; i++) {
      attempts++;
      const type = bombTypes[Math.floor(Math.random() * bombTypes.length)];
      const padding = type.size;

      const x = padding + Math.random() * (canvas.width - padding * 2);
      const y = padding + Math.random() * (canvas.height - padding * 2);

      if (isOverlapping(x, y, type.size, [...targets, ...bombs])) {
        i--; // retry this bomb
        continue;
      }

      bombs.push({
        x,
        y,
        size: type.size,
        points: type.points,
        image: type.image,
        isBomb: true
      });
    }
  }

  function draw() {
    const allObjects = [...targets, ...bombs];
    for (const t of allObjects) {
      if (!t.image.complete) continue; // skip if image not loaded
      ctx.save();
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(t.image, t.x - t.size, t.y - t.size, t.size * 2, t.size * 2);
      ctx.restore();
    }
  }

  function handleClick(x, y) {
    // check targets first
    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      if (Math.hypot(x - t.x, y - t.y) < t.size) {
        targets.splice(i, 1);
        spawnTargets(5); // replace clicked target
        return { points: t.points, type: "target" };
      }
    }

    // check bombs
    for (let i = bombs.length - 1; i >= 0; i--) {
      const b = bombs[i];
      if (Math.hypot(x - b.x, y - b.y) < b.size) {
        return { points: b.points, type: "bomb" };
      }
    }

    return 0;
  }

  function respawnBombs() {
    bombs.forEach(b => {
      const padding = b.size;
      b.x = padding + Math.random() * (canvas.width - padding * 2);
      b.y = padding + Math.random() * (canvas.height - padding * 2);
    });
  }

  return { 
    spawnTargets, 
    spawnBombs, 
    draw, 
    handleClick, 
    respawnBombs 
  };
}