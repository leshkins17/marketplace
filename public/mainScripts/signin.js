import { authorization } from "./authorization.js";
import { API_URL } from "./config.js";

document.getElementById("signin").onsubmit = async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  try {
    const res = await fetch(`${API_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      const paragraphs = signin.querySelectorAll("p");
      paragraphs.forEach((p) => p.remove());

      const error = document.createElement("p");
      error.textContent = result.error || "Something went wrong!";
      signin.insertBefore(error, signin.querySelector("button[type='submit']"));

      return;
    }

    localStorage.setItem("token", result.token);

    authorization();
  } catch (err) {
    console.error("Fetch failed:", err);
  }
};
