const mainMarket = document.getElementById("mainMarket");
const searchInput = document.getElementById("searchMarket");
const filterSelect = document.getElementById("filter");

let allItems = [];

async function loadItems() {
  try {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error("Failed to load items");
    allItems = await res.json();
    renderItems(allItems);
  } catch (err) {
    console.error(err);
    mainMarket.innerHTML =
      "<p>Failed to load items. Please try again later.</p>";
  }
}

function renderItems(items) {
  mainMarket.innerHTML = "";

  if (items.length === 0) {
    mainMarket.innerHTML = "<p>No items yet.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    let images = [];
    try {
      images = Array.isArray(item.images)
        ? item.images
        : JSON.parse(item.images);
    } catch {}

    const firstImage = images[0] || "./images/default-placeholder.png";

    card.innerHTML = `
                <a href="/template.html?id=${item.id}" style="text-decoration:none; color:inherit">
                    <div class="cardImage" style="background-image: url('${firstImage}')"></div>
                    <div class="cardContent">
                        <h3 class="cardTitle">${item.title}</h3>
                        <p class="cardPrice">$${item.price}</p>
                    </div>
                </a>
            `;

    mainMarket.appendChild(card);
  });
}

function filterItems() {
  const search = searchInput.value.toLowerCase();
  const category = filterSelect.value.toLowerCase();

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

loadItems();

searchInput.addEventListener("input", filterItems);
filterSelect.addEventListener("change", filterItems);
