import { open, hide } from "../../sharedScripts/ui/openhide.js";

export async function showLoggedOutUI({
  loginBtn,
  signupBtn,
  header,
  main,
  btnBox,
  communicator,
}) {
  await Promise.all([
    open(loginBtn),
    open(signupBtn),
    open(header),
    open(main),
    open(btnBox),
    open(communicator),
  ]);
}

export async function showLoggedInUI({ header, main, btnBox, postBox, data }) {
  const logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutBtn";
  logoutBtn.textContent = "Logout";
  btnBox.appendChild(logoutBtn);

  const avatarUrl = data.avatar;

  const userIcon = document.createElement("div");
  userIcon.id = "userIcon";
  userIcon.style.backgroundImage = `url("${avatarUrl}")`;
  header.appendChild(userIcon);
  userIcon.addEventListener("click", () => {
    window.location.href = "/profile.html";
  });

  await Promise.all([
    hide(document.getElementById("loginBtn")),
    hide(document.getElementById("signupBtn")),
    hide(document.getElementById("communicator")),
  ]);

  await Promise.all([open(header), open(main), open(btnBox), open(postBox)]);

  return logoutBtn;
}
