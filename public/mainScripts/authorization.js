import { open, hide } from "./openhide.js";
import { API_URL } from "./config.js";

export async function authorization() {
  const token = localStorage.getItem("token");
  const header = document.getElementById("headerHome");
  const title = document.getElementById("titleHome");
  const mainHome = document.getElementById("mainHome");
  const signinBox = document.getElementById("signinBox");
  const signinForm = document.getElementById("signin");
  const signupForm = document.getElementById("signup");
  const paragraphs = signinForm.querySelectorAll("p");

  const logoutBtn = document.getElementById("logoutBtn");
  const userIcon = document.getElementById("userIcon");
  if (logoutBtn) logoutBtn.remove();
  if (userIcon) userIcon.remove();

  if (!token) {
    open(mainHome);
    title.textContent = "Marketplace";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const user = await res.json();
      hide(signinBox, () => {
        hide(mainHome, () => {
          title.classList.remove("show");
          title.textContent = `Welcome, ${user.login}!`;
          title.classList.add("show");

          const logout = document.createElement("button");
          const icon = document.createElement("img");

          logout.id = "logoutBtn";
          logout.textContent = "Logout";

          icon.id = "userIcon";
          icon.src = "./images/user.png";

          header.appendChild(logout);
          header.appendChild(icon);

          logout.onclick = () => {
            localStorage.removeItem("token");

            signinForm.reset();
            signupForm.reset();
            paragraphs.forEach((p) => p.remove());

            authorization();
          };
        });
      });
    } else {
      localStorage.removeItem("token");
      open(mainHome);
      title.textContent = "Marketplace";
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  }
}
