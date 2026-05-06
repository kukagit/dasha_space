import { CONFIG } from "./config.js";

export class Dialog {
  constructor() {
    this.el = document.getElementById("dialog");
    this.nameEl = document.getElementById("dialog-name");
    this.textEl = document.getElementById("dialog-text");
    this.lines = [];
    this.idx = 0;
    this.charIdx = 0;
    this.full = "";
    this.timer = null;
    this.onClose = null;
    this.charSpeed = 18;

    document.addEventListener("keydown", (e) => {
      if (this.el.classList.contains("hidden")) return;
      if (CONFIG.controls.interact.includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        this._advance();
      }
    });
  }

  isOpen() {
    return !this.el.classList.contains("hidden");
  }

  open(name, lines, onClose) {
    this.nameEl.textContent = name;
    this.lines = lines;
    this.idx = 0;
    this.onClose = onClose;
    this.el.classList.remove("hidden");
    this._renderLine();
  }

  _renderLine() {
    this.full = this.lines[this.idx];
    this.charIdx = 0;
    this.textEl.textContent = "";
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.charIdx++;
      this.textEl.textContent = this.full.slice(0, this.charIdx);
      if (this.charIdx >= this.full.length) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }, this.charSpeed);
  }

  _advance() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.textEl.textContent = this.full;
      return;
    }
    this.idx++;
    if (this.idx >= this.lines.length) this._close();
    else this._renderLine();
  }

  _close() {
    this.el.classList.add("hidden");
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const cb = this.onClose;
    this.onClose = null;
    if (cb) cb();
  }
}
