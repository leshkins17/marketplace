export function open(box) {
  box.classList.remove("hide");
  requestAnimationFrame(() => box.classList.add("show"));
}

export function hide(box, callback) {
  box.classList.remove("show");
  box.addEventListener(
    "transitionend",
    () => {
      box.classList.add("hide");
      if (callback) callback();
    },
    { once: true }
  );
}
