import { open, hide } from "../../sharedScripts/ui/openhide.js";
import { logout } from "../../sharedScripts/api/auth/logout.js";

export async function showLoggedOutUI({
  header,
}) {
  await Promise.all([
    open(header),
  ]);
}

export async function showLoggedInUI({ header, data }) {
  const avatarUrl = data.avatar;

  const userIcon = document.createElement("div");
  userIcon.id = "userIcon";
  userIcon.style.backgroundImage = `url("${avatarUrl}")`;
  header.appendChild(userIcon);
  userIcon.addEventListener("click", () => {
    window.location.href = "/profile.html";
  });

  await Promise.all([open(header)]);
}
