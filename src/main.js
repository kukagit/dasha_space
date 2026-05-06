import { CONFIG } from "./config.js";
import { Game } from "./game.js";
import { loadProgress, clearProgress } from "./storage.js";
import { showEnding } from "./ending.js";

const screens = {
  intro: document.getElementById("intro"),
  game: document.getElementById("game"),
  ending: document.getElementById("ending"),
};

function showScreen(name) {
  for (const k in screens) {
    screens[k].classList.toggle("active", k === name);
  }
}

let game = null;
let bgm = null;

function startBgm() {
  if (!CONFIG.audio.bgm || bgm) return;
  bgm = new Audio(CONFIG.audio.bgm);
  bgm.loop = true;
  bgm.volume = CONFIG.audio.bgmVolume;
  bgm.play().catch(() => {});
}

function stopBgm() {
  if (bgm) {
    bgm.pause();
    bgm = null;
  }
}

async function startGame() {
  startBgm();
  showScreen("game");
  if (!game) {
    game = new Game(document.getElementById("game-canvas"));
    game.onWin = () => {
      stopBgm();
      showEnding(CONFIG, () => {
        clearProgress();
        location.reload();
      });
    };
  }
  await game.start();

  const progress = loadProgress();
  if (progress.finished) {
    stopBgm();
    game.stop();
    showEnding(CONFIG, () => {
      clearProgress();
      location.reload();
    });
  }
}

document.getElementById("intro-title").textContent = CONFIG.intro.title;
document.getElementById("intro-sub").textContent = CONFIG.intro.subtitle;
document.getElementById("start-btn").textContent = CONFIG.intro.startButton;

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", () => {
  clearProgress();
  alert("Прогресс сброшен.");
});
