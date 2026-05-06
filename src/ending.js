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

  if (config.ending.confetti && !confettiRunning) startConfetti();
}

function startConfetti() {
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

  function loop() {
    ctx.clearRect(0, 0, W, H);
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
    requestAnimationFrame(loop);
  }
  loop();
}
