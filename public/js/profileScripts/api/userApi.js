export async function getUser(token) {
  const res = await fetch(`/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load user profile");
  return res.json();
}

export async function updateUser(token, { login, email, password, file }) {
  let avatarUrl = null;

  if (file) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });
    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      alert("Failed to upload avatar");
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
    avatarUrl = publicUrl.publicUrl;
  }

  const res = await fetch(`/api/user/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ login, email, password, avatar: avatarUrl }),
  });

  const data = await res.json();

  if (res.ok) {
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    alert("Profile updated successfully");
    location.reload();
  } else {
    alert(data.error || "Update failed");
  }
}

export async function addMoney(token, amount) {
  const res = await fetch(`/api/user/me/add-money`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
  if (res.ok) location.reload();
  else throw new Error("Failed to add money");
  return res.json();
}

export async function deleteAccount(token) {
  const res = await fetch(`/api/user/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete account");
}
