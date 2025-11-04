import { loadItems } from "./api/loadItems.js";
import { filterItems } from "./api/filterItems.js";

loadItems();

document.getElementById("searchMarket").addEventListener("input", filterItems);
document.getElementById("filter").addEventListener("change", filterItems);

const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});
