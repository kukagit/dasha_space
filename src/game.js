import { CONFIG } from "./config.js";
import { Dialog } from "./dialog.js";
import { PasswordModal } from "./password.js";
import { loadImage, drawSprite } from "./assets.js";
import { loadProgress, markTalkedTo, markFinished } from "./storage.js";

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.width = CONFIG.world.width;
    this.canvas.height = CONFIG.world.height;
    this.ctx.imageSmoothingEnabled = false;

    this.keys = new Set();
    this.player = {
      x: CONFIG.player.spawn.x,
      y: CONFIG.player.spawn.y,
      size: CONFIG.player.spriteSize,
      dir: "down",
    };
    this.npcs = CONFIG.npcs.map((n) => ({ ...n }));
    this.altar = CONFIG.altar;

    this.images = {};
    this.dialog = new Dialog();
    this.password = new PasswordModal();
    this.hintEl = document.getElementById("hint");

    this.running = false;
    this.busy = false;
    this.nearest = null;
    this.onWin = () => {};
    this._interactLockUntil = 0;

    this._bind();
  }

  _bind() {
    window.addEventListener("keydown", (e) => {
      if (e.target && e.target.tagName === "INPUT") return;
      this.keys.add(e.code);
      if (CONFIG.controls.interact.includes(e.code)) {
        if (e.repeat) return;
        if (this.busy) return;
        if (this.dialog.isOpen() || this.password.isOpen()) return;
        if (Date.now() < this._interactLockUntil) return;
        e.preventDefault();
        this._tryInteract();
      }
    });
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
    window.addEventListener("blur", () => this.keys.clear());
  }

  async start() {
    if (this.running) return;
    const promises = [];
    promises.push(
      loadImage(CONFIG.player.sprite)
        .then((img) => (this.images.player = img))
        .catch(() => {})
    );
    for (const npc of this.npcs) {
      promises.push(
        loadImage(npc.sprite)
          .then((img) => (this.images["npc" + npc.id] = img))
          .catch(() => {})
      );
    }
    if (CONFIG.world.backgroundImage) {
      promises.push(
        loadImage(CONFIG.world.backgroundImage)
          .then((img) => (this.images.bg = img))
          .catch(() => {})
      );
    }
    if (CONFIG.altar.sprite) {
      promises.push(
        loadImage(CONFIG.altar.sprite)
          .then((img) => (this.images.altar = img))
          .catch(() => {})
      );
    }
    await Promise.allSettled(promises);
    this.running = true;
    requestAnimationFrame(this._loop);
  }

  stop() {
    this.running = false;
  }

  _loop = () => {
    if (!this.running) return;
    this._update();
    this._render();
    requestAnimationFrame(this._loop);
  };

  _update() {
    if (this.busy) return;
    const speed = CONFIG.player.speed;
    let dx = 0,
      dy = 0;
    if (this._anyKey(CONFIG.controls.up)) dy -= 1;
    if (this._anyKey(CONFIG.controls.down)) dy += 1;
    if (this._anyKey(CONFIG.controls.left)) dx -= 1;
    if (this._anyKey(CONFIG.controls.right)) dx += 1;
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }
    if (dy < 0) this.player.dir = "up";
    else if (dy > 0) this.player.dir = "down";
    else if (dx < 0) this.player.dir = "left";
    else if (dx > 0) this.player.dir = "right";

    const half = this.player.size / 2;
    this.player.x = clamp(
      this.player.x + dx * speed,
      half,
      CONFIG.world.width - half
    );
    this.player.y = clamp(
      this.player.y + dy * speed,
      half,
      CONFIG.world.height - half
    );

    this.nearest = this._findNearestInteractable();
    if (this.nearest) {
      this.hintEl.textContent =
        this.nearest.kind === "altar"
          ? `${CONFIG.altar.promptHint} (E)`
          : `${this.nearest.target.name} — поговорить (E)`;
      this.hintEl.classList.remove("hidden");
    } else {
      this.hintEl.classList.add("hidden");
    }
  }

  _findNearestInteractable() {
    const r = CONFIG.interactRadius;
    let best = null;
    let bestDist = r * r;
    for (const npc of this.npcs) {
      const dx = npc.position.x - this.player.x;
      const dy = npc.position.y - this.player.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist) {
        bestDist = d2;
        best = { kind: "npc", target: npc };
      }
    }
    const a = this.altar;
    const dx = a.position.x - this.player.x;
    const dy = a.position.y - this.player.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestDist) best = { kind: "altar", target: a };
    return best;
  }

  _tryInteract() {
    if (!this.nearest) return;
    if (this.nearest.kind === "npc") {
      const npc = this.nearest.target;
      this.busy = true;
      this.dialog.open(npc.name, npc.dialog, () => {
        markTalkedTo(npc.id);
        this.busy = false;
        this._interactLockUntil = Date.now() + 500;
      });
    } else if (this.nearest.kind === "altar") {
      const progress = loadProgress();
      const allTalked = CONFIG.npcs.every((n) =>
        progress.talkedTo.includes(n.id)
      );
      if (!allTalked) {
        const remaining = CONFIG.npcs
          .filter((n) => !progress.talkedTo.includes(n.id))
          .map((n) => n.name)
          .join(", ");
        this.busy = true;
        this.dialog.open(
          "...",
          [`Сначала поговори со всеми.\nОсталось: ${remaining}`],
          () => {
            this.busy = false;
            this._interactLockUntil = Date.now() + 500;
          }
        );
        return;
      }
      this.busy = true;
      this.password.open(
        CONFIG.password.hint,
        this._normalizePassword.bind(this),
        this._getCorrectPassword(),
        () => {
          this.busy = false;
          this._interactLockUntil = Date.now() + 500;
          markFinished();
          this.running = false;
          this.onWin();
        },
        () => {
          this.busy = false;
          this._interactLockUntil = Date.now() + 500;
        }
      );
    }
  }

  _getCorrectPassword() {
    if (CONFIG.password.correct)
      return this._normalizePassword(CONFIG.password.correct);
    const concat = CONFIG.npcs
      .slice()
      .sort((a, b) => a.id - b.id)
      .map((n) => n.passwordPart)
      .join("");
    return this._normalizePassword(concat);
  }

  _normalizePassword(s) {
    let v = String(s);
    if (CONFIG.password.ignoreSpaces) v = v.replace(/\s+/g, "");
    if (!CONFIG.password.caseSensitive) v = v.toLowerCase();
    return v;
  }

  _anyKey(arr) {
    for (const k of arr) if (this.keys.has(k)) return true;
    return false;
  }

  _render() {
    const ctx = this.ctx;
    const W = CONFIG.world.width,
      H = CONFIG.world.height;
    if (this.images.bg) ctx.drawImage(this.images.bg, 0, 0, W, H);
    else {
      ctx.fillStyle = CONFIG.world.backgroundColor;
      ctx.fillRect(0, 0, W, H);
    }

    const a = this.altar;
    if (this.images.altar) {
      drawSprite(ctx, this.images.altar, a.position.x, a.position.y, a.size);
    } else {
      ctx.save();
      ctx.translate(a.position.x, a.position.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#000";
      ctx.fillRect(-a.size / 2, -a.size / 2, a.size, a.size);
      ctx.restore();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", a.position.x, a.position.y);
    }

    const progress = loadProgress();
    for (const npc of this.npcs) {
      const img = this.images["npc" + npc.id];
      const talked = progress.talkedTo.includes(npc.id);
      ctx.save();
      if (talked) ctx.globalAlpha = 0.55;
      if (img) drawSprite(ctx, img, npc.position.x, npc.position.y, npc.spriteSize);
      else {
        ctx.fillStyle = "#444";
        ctx.fillRect(
          npc.position.x - npc.spriteSize / 2,
          npc.position.y - npc.spriteSize / 2,
          npc.spriteSize,
          npc.spriteSize
        );
      }
      ctx.restore();
      if (talked) {
        ctx.fillStyle = "#0a0";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("✓", npc.position.x, npc.position.y - npc.spriteSize / 2 - 4);
      }
    }

    if (this.images.player)
      drawSprite(
        ctx,
        this.images.player,
        this.player.x,
        this.player.y,
        this.player.size
      );
    else {
      ctx.fillStyle = "#222";
      ctx.fillRect(
        this.player.x - this.player.size / 2,
        this.player.y - this.player.size / 2,
        this.player.size,
        this.player.size
      );
    }
  }
}
