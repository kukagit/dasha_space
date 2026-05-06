let confettiRunning = false;
let endingAudio = null;

export function showEnding(config, onRestart) {
  const screens = ["intro", "game", "ending"];
  for (const s of screens) {
    document.getElementById(s).classList.toggle("active", s === "ending");
  }

  document.getElementById("ending-title").textContent = config.ending.title;
  document.getElementById("ending-message").textContent = config.ending.message;

  const img = document.getElementById("ending-img");
  if (config.ending.image) {
    img.src = config.ending.image;
    img.style.display = "";
    img.onerror = () => {
      img.style.display = "none";
    };
  } else {
    img.style.display = "none";
  }

  const restart = document.getElementById("ending-restart");
  restart.onclick = () => onRestart && onRestart();

  if (config.ending.music) {
    if (endingAudio) {
      endingAudio.pause();
      endingAudio = null;
    }
    endingAudio = new Audio(config.ending.music);
    endingAudio.volume = config.audio.endingVolume;
    endingAudio.play().catch(() => {});
  }

  if (config.ending.confetti && !confettiRunning) startConfetti(config);
}

function startConfetti(config) {
  confettiRunning = true;
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const colors = ["#ff5577", "#ffaa55", "#55aaff", "#aaff55", "#aa55ff", "#ffdd55"];
  const N = 140;
  const pieces = Array.from({ length: N }, () => ({
    x: Math.random() * W,
    y: -Math.random() * H,
    vx: -1 + Math.random() * 2,
    vy: 2 + Math.random() * 3,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vr: -0.1 + Math.random() * 0.2,
  }));

  // --- Падающие картинки ---
  const imgSrcs = (config && config.ending && config.ending.fallingImages) || [];
  const imgInterval = (config && config.ending && config.ending.fallingInterval) || 3000;
  const speedDiv = (config && config.ending && config.ending.fallingSpeedDivisor) || 3;
  const imgSize = (config && config.ending && config.ending.fallingSize) || 96;

  const imgs = imgSrcs.map((src) => {
    const im = new Image();
    im.src = src;
    return im;
  });
  const fallingPieces = [];
  let lastSpawn = -Infinity;

  function spawnFallingImage() {
    if (!imgs.length) return;
    const im = imgs[Math.floor(Math.random() * imgs.length)];
    fallingPieces.push({
      img: im,
      x: Math.random() * W,
      y: -imgSize,
      vx: (-1 + Math.random() * 2) / speedDiv,
      vy: (2 + Math.random() * 3) / speedDiv,
      size: imgSize,
      rot: (Math.random() - 0.5) * 0.4,
      vr: (-0.05 + Math.random() * 0.1) / speedDiv,
    });
  }

  function loop(t) {
    ctx.clearRect(0, 0, W, H);

    // Конфетти
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > H + 20) {
        p.y = -20;
        p.x = Math.random() * W;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      ctx.restore();
    }

    // Спавн новой картинки раз в imgInterval мс
    if (imgs.length && t - lastSpawn >= imgInterval) {
      spawnFallingImage();
      lastSpawn = t;
    }

    // Обновляем и рисуем падающие картинки
    for (let i = fallingPieces.length - 1; i >= 0; i--) {
      const p = fallingPieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > H + p.size) {
        fallingPieces.splice(i, 1);
        continue;
      }
      if (p.img.complete && p.img.naturalWidth) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
