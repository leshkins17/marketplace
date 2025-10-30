(async () => {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");

  if (!itemId) {
    console.error("No item ID found in URL");
    document.body.innerHTML = "<h2>Item not found.</h2>";
    return;
  }

  try {
    console.log("Fetching item:", itemId);
    const itemRes = await fetch(`/api/item/${itemId}`);
    if (!itemRes.ok) throw new Error("Item not found");
    const item = await itemRes.json();
    console.log("Item loaded:", item);

    document.getElementById("itemTitle").textContent = item.title;
    document.getElementById("itemPrice").textContent = `$${item.price}`;
    document.getElementById("itemDescription").textContent = item.description;
    document.getElementById(
      "itemCondition"
    ).textContent = `Condition: ${item.condition}`;
    document.getElementById(
      "itemLocation"
    ).textContent = `Location: ${item.location}`;

    const imagesContainer = document.getElementById("itemImages");
    if (item.images && item.images.length > 0) {
      const urls = Array.isArray(item.images)
        ? item.images
        : JSON.parse(item.images);
      urls.forEach((url) => {
        const img = document.createElement("img");
        img.classList.add("templateImage");
        img.src = url;
        imagesContainer.appendChild(img);
      });
    }

    const token = localStorage.getItem("token");
    let currentUserId = null;

    if (token) {
      const profileRes = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        currentUserId = profile.decoded.id;
        console.log("USer ID:", currentUserId, "Author ID:", item.author_id);
      } else {
        console.log("Could not get profile");
      }
    }

    const buySection = document.getElementById("buySection");

    if (currentUserId && currentUserId === item.author_id) {
      console.log("User author - shownig buttons");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.id = "editBtn";
      editBtn.onclick = () => {
        window.location.href = `/editItem.html?id=${item.id}`;
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.id = "deleteBtn";
      deleteBtn.onclick = async () => {
        if (confirm("Are you sure you want to delete this item?")) {
          const res = await fetch(`/api/item/${item.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) window.location.href = "/market";
          else alert("Failed to delete item");
        }
      };

      buySection.append(editBtn, deleteBtn);
    } else {
      console.log("Buttons not shown - not author or not logged in");
    }
  } catch (err) {
    console.error("Error loading item:", err);
    document.body.innerHTML = "<h2>Error loading item.</h2>";
  }
})();
