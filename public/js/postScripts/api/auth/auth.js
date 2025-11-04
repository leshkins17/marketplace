import { fetchProfile } from "../../../sharedScripts/api/fetchProfile.js";
import { elements } from "../../ui/domElements.js";
import { showLoggedOutUI, showLoggedInUI } from "../../ui/updateUI.js";
import { logout } from "../../../sharedScripts/api/auth/logout.js";

export async function authPost() {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      await showLoggedOutUI(elements);
      return;
    }

    const profile = await fetchProfile(token);
    const logoutBtn = await showLoggedInUI({
      ...elements,
      postBox: elements.postBox,
      data: profile,
    });

    logoutBtn.onclick = () => {
      logout({
        header: elements.header,
        main: elements.main,
        btnBox: elements.btnBox,
        postBox: elements.postBox,
        loginForm: elements.loginForm,
        signupForm: elements.signupForm,
      });
    };
  } catch (err) {
    console.error("Auth failed:", err);
    localStorage.removeItem("token");
    await showLoggedOutUI(elements);
  }
}
