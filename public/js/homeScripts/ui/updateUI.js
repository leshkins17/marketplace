import { open, hide } from "../../sharedScripts/ui/openhide.js";
import { logout } from "../../sharedScripts/api/auth/logout.js";

export async function showLoggedOutUI({
  title,
  header,
  main,
  btnBox,
  loginBtn,
  signupBtn,
}) {
  title.textContent = "Marketplace";
  await Promise.all([
    open(header),
    open(main),
    open(btnBox),
    open(loginBtn),
    open(signupBtn),
  ]);
}

export async function showLoggedInUI({ title, header, main, btnBox, data }) {
  title.textContent = `Welcome, ${data.login}`;

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
  ]);
  await Promise.all([open(header), open(main), open(btnBox)]);

  return logoutBtn;
}
