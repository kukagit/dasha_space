export class PasswordModal {
  constructor() {
    this.el = document.getElementById("password-modal");
    this.input = document.getElementById("password-input");
    this.hintEl = document.getElementById("password-hint");
    this.errorEl = document.getElementById("password-error");
    this.submitBtn = document.getElementById("password-submit");
    this.cancelBtn = document.getElementById("password-cancel");
    this.normalize = (s) => s;
    this.correct = "";
    this.onSuccess = null;
    this.onCancel = null;

    this.submitBtn.addEventListener("click", () => this._submit());
    this.cancelBtn.addEventListener("click", () => this._cancel());
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        this._submit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        this._cancel();
      }
    });
  }

  isOpen() {
    return !this.el.classList.contains("hidden");
  }

  open(hint, normalize, correct, onSuccess, onCancel) {
    this.hintEl.textContent = hint;
    this.normalize = normalize;
    this.correct = correct;
    this.onSuccess = onSuccess;
    this.onCancel = onCancel;
    this.input.value = "";
    this.errorEl.classList.add("hidden");
    this.el.classList.remove("hidden");
    setTimeout(() => this.input.focus(), 50);
  }

  _submit() {
    const v = this.normalize(this.input.value);
    if (v === this.correct) {
      this._close();
      const cb = this.onSuccess;
      this.onSuccess = null;
      this.onCancel = null;
      if (cb) cb();
    } else {
      this.errorEl.classList.remove("hidden");
      const inner = this.el.querySelector(".modal-inner");
      inner.classList.remove("shake");
      void inner.offsetWidth;
      inner.classList.add("shake");
    }
  }

  _cancel() {
    this._close();
    const cb = this.onCancel;
    this.onSuccess = null;
    this.onCancel = null;
    if (cb) cb();
  }

  _close() {
    this.el.classList.add("hidden");
  }
}
