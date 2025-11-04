import { fetchItem } from "../../sharedScripts/api/fetchItem.js";
import { updateItem } from "../api/updateItem.js";
import { populateForm, readFormValues } from "../ui/form.js";
import { showLoggedInUI } from "../ui/updateUI.js";
import { elements } from "../ui/domElements.js";
import { fetchProfile } from "../../sharedScripts/api/fetchProfile.js";

export async function editItem() {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");
  const form = document.getElementById("editForm");
  const token = localStorage.getItem("token");
  const profile = await fetchProfile(token);

  if (!itemId) {
    alert("No item ID provided");
    window.location.href = "/market";
    return;
  }

  try {
    const item = await fetchItem(itemId);
    populateForm(form, item);
    showLoggedInUI({ ...elements, data: profile });
  } catch (err) {
    alert(err.message);
    window.location.href = "/market";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedItem = readFormValues(form);

    try {
      const res = await updateItem(itemId, updatedItem, token);
      if (res.ok) {
        alert("Item updated successfully");
        window.location.href = `/template.html?id=${itemId}`;
      } else {
        const msg = await res.text();
        alert(`Failed to update item: ${msg}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update item due to network error");
    }
  });
}
