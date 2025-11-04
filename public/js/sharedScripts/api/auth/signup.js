import { open, hide } from "../../ui/openhide.js";
import { API_URL } from "../../config.js";

export async function signup(e) {
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
    const loginBox = document.getElementById("loginBox");

    await hide(signupBox);
    await open(loginBox);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
