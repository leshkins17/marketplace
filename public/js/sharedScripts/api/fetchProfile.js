export async function fetchProfile(token) {
  const res = await fetch("/api/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}
