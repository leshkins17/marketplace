import { openGrid, hide } from "../../sharedScripts/ui/openhide.js";

export async function showLoggedOutUI({ main }) {
  await Promise.all([openGrid(main)]);
}

export async function showLoggedInUI({ main, data }) {
  const token = localStorage.getItem("token");
  if (token) {
    const avatarUrl = data.avatar;

    const userIcon = document.createElement("div");
    userIcon.id = "userIcon";
    userIcon.style.backgroundImage = `url("${avatarUrl}")`;
    main.appendChild(userIcon);
    userIcon.addEventListener("click", () => {
      window.location.href = "/profile.html";
    });
  }
  await Promise.all([openGrid(main)]);
}
