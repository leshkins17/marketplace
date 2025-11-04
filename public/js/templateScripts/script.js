import { fetchItem } from "../sharedScripts/api/fetchItem.js";
import { fetchProfile } from "../sharedScripts/api/fetchProfile.js";
import { renderItem } from "./ui/renderItem.js";
import { renderImages } from "./ui/renderImages.js";
import { renderBtns } from "./ui/renderBtns.js";
import { showLoggedInUI } from "./ui/updateUI.js";
import { elements } from "./ui/domElements.js";
import { buyAndCart } from "./api/buyAndCart.js";

(async function template() {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  const token = localStorage.getItem("token");

  const profile = token ? await fetchProfile(token) : "";

  if (!itemId) {
    document.body.innerHTML = "<h2>Item not found.</h2>";
    await showLoggedInUI({ ...elements, data: profile });
    return;
  }

  try {
    const item = await fetchItem(itemId);
    renderItem(item);
    renderImages(item.images, "imagesItem");

    const token = localStorage.getItem("token");
    let currentUserId = null;

    if (token) {
      try {
        const profile = await fetchProfile(token);
        currentUserId = profile.id;
      } catch {
        console.warn("Could not fetch profile");
      }
    }
    renderBtns(item, currentUserId, token);
    await showLoggedInUI({ ...elements, data: profile });
  } catch (err) {
    console.error("Error loading item:", err);
    document.body.innerHTML = "<h2>Error loading item.</h2>";
    await showLoggedInUI({ ...elements, data: profile });
  }

  await buyAndCart();

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector("nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
})();
