export async function postItem(form) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to post an item.");
    return;
  }

  const formData = new FormData(form);

  try {
    const res = await fetch(`/api/postItem`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      alert("Item posted successfully!");
      console.log("Posted item:", data.item);
      form.reset();
      window.location.href = "/market";
    } else {
      const msg = await res.text();
      alert(`Failed to post item: ${msg}`);
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("NEtwork error while posting item");
  }
}
