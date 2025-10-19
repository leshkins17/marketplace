import { open, hide } from "./openhide.js";
import { API_URL } from "./config.js";

document.getElementById("signup").onsubmit = async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      const paragraphs = signup.querySelectorAll("p");
      paragraphs.forEach((p) => p.remove());

      const error = document.createElement("p");
      error.textContent = result.error || "Something went wrong!";
      signup.insertBefore(error, signup.querySelector("button[type='submit']"));

      return;
    }

    const signupBox = document.getElementById("signupBox");
    const signinBox = document.getElementById("signinBox");

    hide(signupBox, () => {
      open(signinBox);
    });
  } catch (err) {
    console.error("Fetch failed:", err);
  }
};
