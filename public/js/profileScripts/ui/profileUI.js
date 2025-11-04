export function renderUserData(user) {
  const avatar =
    user.avatar && user.avatar.trim() !== "" ? user.avatar : "/assets/user.png";

  const avatarDiv = document.getElementById("profileIcon");
  if (avatarDiv) {
    avatarDiv.style.backgroundImage = `url("${avatar}")`;
  }

  document.getElementById("userData").innerHTML = `
    <div class="headerProfile">
      <div>
        <p><b>Login:</b> ${user.login}</p>
        <p><b>Email:</b> ${user.email}</p>
      </div>
    </div>
  `;

  document.getElementById("balance").textContent = `Balance: $${user.balance}`;
}

export function renderCart(items) {
  const container = document.getElementById("cart");
  const main = document.getElementById("mainProfile");
  const purchasedTitle = document.getElementById("purchasedTitle");

  if (items.length === 0) {
    container.innerHTML = "<p>Your cart is empty</p>";
  } else {
    container.innerHTML = items
      .map(
        (item) => `
          <div class="card">
            <a href="/template.html?id=${item.item_id}" style="text-decoration:none; color:inherit">
              <div class="cardImage" style="background-image: url('${item.images[0]}')"></div>
              <div class="cardContent">
                <h3 class="cardTitle">${item.title}</h3>
                <p class="cardPrice"">$${item.price}</p>
              </div>
            </a>
          </div>
        `
      )
      .join("");

    const totalPrice = items.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    const totalPriceEl = document.createElement("p");
    totalPriceEl.textContent = `Total: $${totalPrice.toFixed(2)}`;
    totalPriceEl.classList.add("cartTotal");

    const buyAllBtn = document.createElement("button");
    buyAllBtn.textContent = "Buy Everything";
    buyAllBtn.classList.add("buyAllBtn");
    buyAllBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to buy everything in your cart?")) {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/cart/buy-all", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const error = await res.json();
          alert(error.message || "Failed to buy items");
          return;
        }

        alert("Successfully purchased all items!");
        location.reload();
      }
    });

    main.insertBefore(totalPriceEl, purchasedTitle);
    main.insertBefore(buyAllBtn, purchasedTitle);
  }
}

export function renderPurchases(items) {
  const container = document.getElementById("purchased");

  if (items.length === 0) {
    container.innerHTML = "<p>No purchased items yet</p>";
  } else {
    container.innerHTML = items
      .map(
        (item) => `
                  <div class="card">
                    <a href="/template.html?id=${
                      item.id
                    }" style="text-decoration:none; color:inherit">
                      <div class="cardImage" style="background-image: url('${
                        item.images[0] || ""
                      }')"></div>
                      <div class="cardContent">
                        <h3 class="cardTitle">${item.title}</h3>
                        <p class="cardPrice">$${item.price}</p>
                        <p class="purchaseDate">Purchased: ${new Date(
                          item.purchased_at
                        ).toLocaleDateString()}</p>
                      </div>
                    </a>
                  </div>
                `
      )
      .join("");
  }
}
