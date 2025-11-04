import { renderItems } from "../ui/renderItems.js";
import { allItems } from "./itemsData.js";

export function filterItems() {
  const search = document.getElementById("searchMarket").value.toLowerCase();
  const category = document.getElementById("filter").value.toLowerCase();

  const filtered = allItems.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search);
    const matchCategory =
      category === "" || item.category.toLowerCase() === category;
    return matchSearch && matchCategory;
  });

  renderItems(filtered);
}
