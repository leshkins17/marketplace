export async function deleteItem(itemId, token) {
  const res = await fetch(`/api/item/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}
