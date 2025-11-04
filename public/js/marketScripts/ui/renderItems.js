export function renderItems(items) {
  const mainMarket = document.getElementById("mainMarket");
  mainMarket.innerHTML = "";

  if (items.length === 0) {
    mainMarket.innerHTML = "<p>No items yet.</p>";
    return;
  }

  items.forEach((item) => {
    if (!item.is_sold) {
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
    }
  });
}
