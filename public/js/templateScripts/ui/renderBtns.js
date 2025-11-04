import { deleteItem } from "../api/deleteItem.js";

export function renderBtns(item, currentUserId, token) {
  const buySection = document.getElementById("buySection");
  if (!currentUserId || currentUserId !== item.author_id) return;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.id = "editBtn";
  editBtn.onclick = () => {
    window.location.href = `/edit.html?id=${item.id}`;
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.id = "deleteBtn";
  deleteBtn.onclick = async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      const ok = await deleteItem(item.id, token);
      if (ok) window.location.href = "/market";
      else alert("Failed to delete item");
    }
  };

  buySection.append(editBtn, deleteBtn);
}
