document.getElementById("images").addEventListener("change", function (event) {
  console.log("preview script");

  const files = event.target.files;
  const preview = document.getElementById("preview");

  preview.innerHTML = "";

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const div = document.createElement("div");
    div.classList.add("image");
    div.style.backgroundImage = `url(${URL.createObjectURL(file)})`;

    preview.appendChild(div);
  }
});
