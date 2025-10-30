import { open, hide } from "./openhide.js";
import { API_URL } from "./config.js";

document.getElementById("signup").onsubmit = async (e) => {
  console.log("signup script");

  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const signup = document.getElementById("signup");

  try {
    const res = await fetch(`${API_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      signup.querySelectorAll("p").forEach((p) => p.remove());

      const error = document.createElement("p");
      error.textContent = result.error || "Something went wrong!";
      error.id = "error";
      signup.insertBefore(error, signup.querySelector("button[type='submit']"));

      return;
    }

    const signupBox = document.getElementById("signupBox");
    const signinBox = document.getElementById("signinBox");

    await hide(signupBox);
    await open(signinBox);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
};
