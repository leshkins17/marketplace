import { fetchProfile } from "../sharedScripts/api/fetchProfile.js";
import { showLoggedOutUI, showLoggedInUI } from "./ui/updateUI.js";
import { elements } from "./ui/domElements.js";

export async function about() {

  const token = localStorage.getItem("token");
  const { header } = elements;

  try {
    if (!token) {
      await showLoggedOutUI(elements);
      return;
    }

    const data = await fetchProfile(token);
    const logoutBtn = await showLoggedInUI({ ...elements, data });

  } catch (err) {
    console.error("Auth failed:", err);
    localStorage.removeItem("token");
    await showLoggedOutUI(elements);
  }
}

about();

const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});