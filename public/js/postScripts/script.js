import { authPost } from "./api/auth/auth.js";
import { previewImage } from "./ui/previewImage.js";
import { login } from "../sharedScripts/api/auth/login.js";
import { signup } from "../sharedScripts/api/auth/signup.js";
import { boxes } from "../sharedScripts/ui/boxes.js";
import { postItem } from "./api/postItem.js";

authPost();

document.getElementById("images").addEventListener("change", previewImage);
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  await postItem(document.getElementById("postForm"));
});
document.getElementById("loginBtn").onclick = () => boxes("loginBox");
document.getElementById("signupBtn").onclick = () => boxes("signupBox");
document.getElementById("loginForm").onsubmit = login;
document.getElementById("signupForm").onsubmit = signup;

const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});
