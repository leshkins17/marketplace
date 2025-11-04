import { open, hide } from "../../sharedScripts/ui/openhide.js";

export async function showLoggedOutUI({ header, main }) {
  await Promise.all([open(header), open(main)]);
}

export async function showLoggedInUI({ header, main, data }) {
  const token = localStorage.getItem("token");
  if (token) {
    const avatarUrl = data.avatar;

    const userIcon = document.createElement("div");
    userIcon.id = "userIcon";
    userIcon.style.backgroundImage = `url("${avatarUrl}")`;
    header.appendChild(userIcon);
    userIcon.addEventListener("click", () => {
      window.location.href = "/profile.html";
    });
  }

  await Promise.all([open(header), open(main)]);
}
