export async function fetchItem(itemId) {
  const res = await fetch(`/api/item/${itemId}`);
  if (!res.ok) throw new Error("Item not found");
  return res.json();
}
