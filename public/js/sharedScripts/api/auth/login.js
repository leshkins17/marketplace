import { hide } from "../../ui/openhide.js";
import { API_URL } from "../../config.js";

export async function login(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  try {
    const res = await fetch(`${API_URL}/api/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      const paragraphs = e.target.querySelectorAll("p");
      paragraphs.forEach((p) => p.remove());

      const error = document.createElement("p");
      error.textContent = result.error || "Something went wrong!";
      e.target.insertBefore(
        error,
        document.getElementById("loginBtn").querySelector("button[type='submit']")
      );

      return;
    }

    localStorage.setItem("token", result.token);

    await Promise.all(
      [
        document.getElementById("headerHome"),
        document.getElementById("mainHome"),
        document.getElementById("headerPost"),
        document.getElementById("mainPost"),
        document.getElementById("btnBox"),
        document.getElementById("loginBox"),
      ]
        .filter(Boolean)
        .map((el) => hide(el))
    );

    location.reload();
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
