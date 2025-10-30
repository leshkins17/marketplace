async () => {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");
  const form = document.getElementById("editForm");
  const token = localStorage.getItem("token");

  if (!itemId) {
    alert("No item ID provided");
    window.location.href = "/market";
    return;
  }

  const res = await fetch(`/api/item/${itemId}`);
  if (!res.ok) {
    alert("Item not found");
    window.location.href = "/market";
    return;
  }
  const item = await res.json();

  document.getElementById("title").value = item.title;
  document.getElementById("price").value = item.price;
  document.getElementById("description").value = item.description;
  document.getElementById("condition").value = item.condition;
  document.getElementById("location").value = item.location;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedItem = {
      title: document.getElementById("title").value.trim(),
      price: parseFloat(document.getElementById("price").value),
      title: document.getElementById("description").value.trim(),
      title: document.getElementById("condition").value,
      title: document.getElementById("lcoation").value.trim(),
    };

    const res = await fetch(`/api/item/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedItem),
    });

    if (res.ok) {
      alert("Item updated successfully");
      window.location.href = `/template.html?id=${itemId}`;
    } else {
      const msg = await res.text();
      alert(`Failed to update item: ${msg}`);
    }
  });
};
