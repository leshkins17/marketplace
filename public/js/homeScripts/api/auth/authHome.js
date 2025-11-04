import { fetchProfile } from "../../../sharedScripts/api/fetchProfile.js";
import { showLoggedOutUI, showLoggedInUI } from "../../ui/updateUI.js";
import { elements } from "../../ui/domElements.js";
import { logout } from "../../../sharedScripts/api/auth/logout.js";

export async function authHome() {
  console.log("auth script (home)");

  const token = localStorage.getItem("token");
  const { header, title, main, btnBox, loginForm, signupForm } = elements;
  const paragraphs = loginForm.querySelectorAll("p");

  try {
    if (!token) {
      await showLoggedOutUI(elements);
      return;
    }

    const data = await fetchProfile(token);
    const logoutBtn = await showLoggedInUI({ ...elements, data });

    logoutBtn.onclick = () =>
      logout({
        header,
        main,
        btnBox,
        loginForm,
        signupForm,
        paragraphs,
      });
  } catch (err) {
    console.error("Auth failed:", err);
    localStorage.removeItem("token");
    await showLoggedOutUI(elements);
  }
}
