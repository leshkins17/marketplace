import { renderItems } from "../ui/renderItems.js";
import { allItems } from "./itemsData.js";
import { showLoggedOutUI, showLoggedInUI } from "../ui/updateUI.js";
import { elements } from "../ui/domElements.js";
import { fetchProfile } from "../../sharedScripts/api/fetchProfile.js";

export async function loadItems() {
  const token = localStorage.getItem("token");
  const mainMarket = document.getElementById("mainMarket");
  const dataUser = token ? await fetchProfile(token) : "";

  try {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error("Failed to load items");
    const data = await res.json();
    allItems.length = 0;
    allItems.push(...data);
    renderItems(allItems);
    await showLoggedInUI({ ...elements, data: dataUser });
  } catch (err) {
    console.error(err);
    mainMarket.innerHTML =
      "<p>Failed to load items. Please try again later.</p>";
    await showLoggedInUI({ ...elements, dataUser });
  }
}
