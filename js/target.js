export function createTargetSystem(canvas, ctx) {

  // ---------------------------
  // Target definitions
  // ---------------------------
  const targetTypes = [
    { size: 30, points: 10, src: 'images/larsonPrison.png', isBomb: false },
    { size: 100, points: 5, src: 'images/yahu.jpg', isBomb: false }
  ];

  const bombTypes = [
    { size: 40, points: -50, src: 'images/bombImage.png', isBomb: true }
  ];

  // preload images
  [...targetTypes, ...bombTypes].forEach(t => {
    const img = new Image();
    img.src = t.src;
    t.image = img;
  });

  const targets = [];
  const bombs = [];

  // ---------------------------
  // Helpers
  // ---------------------------
  function isOverlapping(x, y, size, objects) {
    for (const obj of objects) {
      const dist = Math.hypot(x - obj.x, y - obj.y);
      if (dist < size + obj.size) return true;
    }
    return false;
  }

  function getRandomPosition(size) {
    const padding = size;
    return {
      x: padding + Math.random() * (canvas.width - padding * 2),
      y: padding + Math.random() * (canvas.height - padding * 2)
    };
  }

  // ---------------------------
  // Spawn targets
  // ---------------------------
  function spawnTargets(count = 5) {
    let attempts = 0;

    while (targets.length < count && attempts < 200) {
      attempts++;

      const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
      const pos = getRandomPosition(type.size);

      if (isOverlapping(pos.x, pos.y, type.size, [...targets, ...bombs])) continue;

      targets.push({
        x: pos.x,
        y: pos.y,
        size: type.size,
        points: type.points,
        image: type.image,
        isBomb: false
      });
    }
  }

  // ---------------------------
  // Spawn bombs
  // ---------------------------
  function spawnBombs(count = 0) {
    bombs.length = 0;
    let attempts = 0;

    while (bombs.length < count && attempts < 200) {
      attempts++;

      const type = bombTypes[0];
      const pos = getRandomPosition(type.size);

      if (isOverlapping(pos.x, pos.y, type.size, [...targets, ...bombs])) continue;

      bombs.push({
        x: pos.x,
        y: pos.y,
        size: type.size,
        points: type.points,
        image: type.image,
        isBomb: true
      });
    }
  }

  // ---------------------------
  // Draw everything
  // ---------------------------
  function draw() {
    const allObjects = [...targets, ...bombs];

    for (const obj of allObjects) {
      if (!obj.image.complete) continue;

      ctx.save();
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
      ctx.clip();

      ctx.drawImage(
        obj.image,
        obj.x - obj.size,
        obj.y - obj.size,
        obj.size * 2,
        obj.size * 2
      );

      ctx.restore();
    }
  }

  // ---------------------------
  // Click detection (IMPORTANT)
  // ---------------------------
  function handleClick(x, y) {

    // check targets first
    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];

      if (Math.hypot(x - t.x, y - t.y) < t.size) {
        targets.splice(i, 1);

        // spawn ONE replacement (not reset to 5)
        spawnTargets(targets.length + 1);

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

    return null;
  }

  // ---------------------------
  // Move bombs
  // ---------------------------
  function respawnBombs() {
    for (const b of bombs) {
      const pos = getRandomPosition(b.size);
      b.x = pos.x;
      b.y = pos.y;
    }
  }

  // ---------------------------
  return {
    spawnTargets,
    spawnBombs,
    draw,
    handleClick,
    respawnBombs
  };
}