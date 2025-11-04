import { authHome } from "./api/auth/authHome.js";
import { boxes } from "../sharedScripts/ui/boxes.js";
import { login } from "../sharedScripts/api/auth/login.js";
import { signup } from "../sharedScripts/api/auth/signup.js";

authHome();

document.getElementById("loginBtn").onclick = () => boxes("loginBox");
document.getElementById("signupBtn").onclick = () => boxes("signupBox");
document.getElementById("loginForm").onsubmit = login;
document.getElementById("signupForm").onsubmit = signup;

const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});

document.getElementById("shopping").onclick = () =>
  (window.location.href = "/market");
