export async function buyAndCart() {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  const addToCartBtn = document.getElementById("cartBtn");
  const buyBtn = document.getElementById("buyBtn");

  if (token) {
    addToCartBtn.addEventListener("click", async () => {
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: itemId }),
      });
      const data = await res.json();
      if (data.success) alert("Added to cart");
      else alert(data.error);
    });

    buyBtn.addEventListener("click", async () => {
      const res = await fetch(`/api/item/${itemId}/buy`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resDel = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("Purchase successfull!");
        window.location.reload();
      } else {
        alert(data.error || "Purchase failed");
      }
    });
  } else {
    addToCartBtn.addEventListener("click", () => alert("Log in first!"));
    buyBtn.addEventListener("click", () => alert("Log in first!"));
  }
}
