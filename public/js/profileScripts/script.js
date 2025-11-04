import { getUser, updateUser, addMoney, deleteAccount } from "./api/userApi.js";
import { getCart } from "./api/cartApi.js";
import { getPurchases } from "./api/purchasesApi.js";
import { renderUserData, renderCart, renderPurchases } from "./ui/profileUI.js";
import { showLoggedInUI } from "./ui/updateUI.js";
import { elements } from "./ui/domElements.js";

const token = localStorage.getItem("token");
if (!token) window.location.href = "/home.html";

async function loadProfile() {
  try {
    const data = await getUser(token);
    renderUserData(data.user);

    const items = await getCart(token);
    renderCart(items);

    const purchases = await getPurchases(token);
    renderPurchases(purchases);

    await showLoggedInUI(elements);
  } catch (err) {
    console.error(err);
    alert("Failed to load profile");
  }
}

document.getElementById("addMoneyBtn").addEventListener("click", async () => {
  const amount = Number(document.getElementById("addMoneyAmount").value);
  try {
    await addMoney(token, amount);
    loadProfile();
  } catch (err) {
    alert(err.message);
  }
});

const form = document
  .getElementById("editProfileForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("login").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const file = document.getElementById("avatar").files[0];

    const formData = new FormData();
    if (login) formData.append("login", login);
    if (email) formData.append("email", email);
    if (password) formData.append("password", password);
    if (file) formData.append("avatar", file);

    await fetch("/api/user/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  });

document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteAccount(token);
        localStorage.removeItem("token");
        window.location.href = "/home.html";
      } catch (err) {
        alert(err.message);
      }
    }
  });
loadProfile();

const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});
