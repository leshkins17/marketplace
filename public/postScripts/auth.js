import { open, hide } from "../sharedScripts/openhide.js";
import { API_URL } from "../sharedScripts/config.js";

export async function authPost() {
  console.log("auth script (home)");

  const token = localStorage.getItem("token");
  const header = document.getElementById("headerPost");
  const main = document.getElementById("mainPost");
  const buttonBox = document.getElementById("buttonBox");
  const signinBtn = document.getElementById("signinBtn");
  const signupBtn = document.getElementById("signupBtn");
  const postBox = document.getElementById("postBox");
  const communicator = document.getElementById("communicator");
  const signinForm = document.getElementById("signin");
  const signupForm = document.getElementById("signup");
  const postForm = document.getElementById("post");
  const paragraphs = signinForm.querySelectorAll("p");
  const oldLogout = document.getElementById("logoutBtn");
  const oldIcon = document.getElementById("userIcon");

  try {
    if (!token) {
      if (oldLogout) logoutBtn.remove();
      if (oldIcon) userIcon.remove();
      await Promise.all([
        open(signinBtn),
        open(signupBtn),
        open(header),
        open(main),
        open(buttonBox),
        open(communicator),
      ]);
    } else {
      const res0 = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res0.ok) {
        const logout = document.createElement("button");
        logout.id = "logoutBtn";
        logout.textContent = "Logout";
        buttonBox.appendChild(logout);

        const icon = document.createElement("img");
        icon.id = "userIcon";
        icon.src = "../images/user.png";
        header.appendChild(icon);

        logout.onclick = async () => {
          localStorage.removeItem("token");
          signinForm.reset();
          signupForm.reset();
          paragraphs.forEach((p) => p.remove());
          await Promise.all([
            hide(header),
            hide(main),
            hide(buttonBox),
            hide(postBox),
          ]);
          location.reload();
        };

        await Promise.all([
          hide(signinBtn),
          hide(signupBtn),
          hide(communicator),
        ]);
        await Promise.all([
          open(header),
          open(main),
          open(buttonBox),
          open(postBox),
        ]);
      } else {
        localStorage.removeItem("token");
        await Promise.all([
          open(header),
          open(main),
          open(buttonBox),
          open(communicator),
        ]);
      }
    }
  } catch (err) {
    console.error("Auth failed:", err);
    await Promise.all([
      open(header),
      open(main),
      open(buttonBox),
      open(communicator),
    ]);
  }
}
