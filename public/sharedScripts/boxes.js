import { open, hide } from "./openhide.js";

let currentBox = null;

export async function boxes(id) {
  const box = document.getElementById(id);

  if (currentBox) {
    await hide(currentBox);
  }

  await open(box);
  currentBox = box;
}

window.boxes = boxes;
