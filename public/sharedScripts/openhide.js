const activeTransitions = new WeakMap();

export function open(x) {
  return new Promise((resolve) => {
    const prev = activeTransitions.get(x);
    if (prev) clearTimeout(prev);

    x.classList.remove("hide", "show");
    x.style.display = "flex";

    void x.offsetWidth;

    requestAnimationFrame(() => {
      x.classList.add("show");

      const done = () => {
        activeTransitions.delete(x);
        resolve();
      };

      const timeout = setTimeout(done, 800);
      activeTransitions.set(x, timeout);

      x.addEventListener(
        "transitionend",
        (e) => {
          if (e.target === x) {
            clearTimeout(timeout);
            done();
          }
        },
        { once: true }
      );
    });
  });
}

export function hide(x) {
  return new Promise((resolve) => {
    const prev = activeTransitions.get(x);
    if (prev) clearTimeout(prev);

    x.classList.remove("hide", "show");

    x.classList.add("hide");

    const done = () => {
      x.style.display = "none";
      activeTransitions.delete(x);
      resolve();
    };

    const timeout = setTimeout(done, 800);
    activeTransitions.set(x, timeout);

    x.addEventListener(
      "transitionend",
      (e) => {
        if (e.target === x) {
          clearTimeout(timeout);
          activeTransitions.delete(x);
          done();
        }
      },
      { once: true }
    );
  });
}
