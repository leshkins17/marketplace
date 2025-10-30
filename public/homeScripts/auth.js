import { open, hide } from "../sharedScripts/openhide.js";
import { API_URL } from "../sharedScripts/config.js";

export async function authHome() {
  console.log("auth script (home)");

  const token = localStorage.getItem("token");
  const header = document.getElementById("headerHome");
  const title = document.getElementById("titleHome");
  const main = document.getElementById("mainHome");
  const buttonBox = document.getElementById("buttonBox");
  const signinBtn = document.getElementById("signinBtn");
  const signupBtn = document.getElementById("signupBtn");
  const signinForm = document.getElementById("signin");
  const signupForm = document.getElementById("signup");
  const paragraphs = signinForm.querySelectorAll("p");

  try {
    if (!token) {
      title.textContent = "Marketplace";
      await Promise.all([
        open(signinBtn),
        open(signupBtn),
        open(header),
        open(main),
        open(buttonBox),
      ]);
    } else {
      const res = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        title.textContent = `Welcome, ${data.decoded.login}`;

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

          await Promise.all([hide(header), hide(main), hide(buttonBox)]);
          location.reload();
        };

        await Promise.all([hide(signinBtn), hide(signupBtn)]);

        await Promise.all([open(header), open(main), open(buttonBox)]);
      } else {
        localStorage.removeItem("token");
        title.textContent = "Marketplace";
        await Promise.all([open(header), open(main), open(buttonBox)]);
      }
    }
  } catch (err) {
    console.error("Auth failed:", err);
    title.textContent = "Marketplace";
    await Promise.all([open(header), open(main), open(buttonBox)]);
  }
}
