export async function getPurchases(token) {
    const res = await fetch(`/api/purchases`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load purchases");
    return res.json();
}