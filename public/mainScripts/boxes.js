import { open, hide } from "./openhide.js";

function boxes(id) {
  const box = document.getElementById(id);
  const allBoxes = [
    document.getElementById("signinBox"),
    document.getElementById("signupBox"),
  ];

  const activeBox = allBoxes.find((b) => b.classList.contains("show"));

  if (activeBox && activeBox !== box) {
    hide(activeBox, () => open(box));
  } else if (activeBox === box) {
    hide(activeBox);
  } else {
    open(box);
  }
}

window.boxes = boxes;
