document.getElementById("post").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const formData = new FormData(e.target);

  const res = await fetch("/api/postItem", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await res.json();
  if (res.ok) {
    alert("Item posted succesfully!");
    console.log(result.item);
    e.target.reset();
  } else {
    alert(result.error || "Failed to post item");
  }
});
