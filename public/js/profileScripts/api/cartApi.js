export async function getCart(token) {
    const res = await fetch(`/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load cart");
    return res.json();
}