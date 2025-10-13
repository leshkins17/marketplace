function sign(id) {
  const box = document.getElementById(id);
  const allBoxes = [
    document.getElementById("signinBox"),
    document.getElementById("signupBox"),
  ];

  const activeBox = allBoxes.find((b) => b.classList.contains("visible"));

  if (activeBox && activeBox !== box) {
    closeBox(activeBox, () => openBox(box));
  } else if (activeBox === box) {
    closeBox(activeBox);
  } else {
    openBox(box);
  }
}

function openBox(box) {
  box.classList.add("visible");
  requestAnimationFrame(() => box.classList.add("show"));
}

function closeBox(box, callback) {
  box.classList.remove("show");
  box.addEventListener(
    "transitionend",
    () => {
      box.classList.remove("visible");
      if (callback) callback();
    },
    { once: true }
  );
}
