export async function updateItem(itemId, updatedItem, token) {
  const res = await fetch(`/api/item/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedItem),
  });
  return res;
}
