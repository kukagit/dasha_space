import { CONFIG } from "./config.js";

const KEY = CONFIG.storageKey;

export function loadProgress() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (v && typeof v === "object" && Array.isArray(v.talkedTo)) return v;
  } catch {}
  return { talkedTo: [], finished: false };
}

export function saveProgress(p) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function markTalkedTo(npcId) {
  const p = loadProgress();
  if (!p.talkedTo.includes(npcId)) p.talkedTo.push(npcId);
  saveProgress(p);
}

export function markFinished() {
  const p = loadProgress();
  p.finished = true;
  saveProgress(p);
}

export function clearProgress() {
  localStorage.removeItem(KEY);
}
