import { hide } from "../../ui/openhide.js";

export async function logout({
  header,
  main,
  btnBox,
  loginForm,
  signupForm,
  paragraphs,
}) {
  localStorage.removeItem("token");
  loginForm.reset();
  signupForm.reset();
  if(paragraphs) paragraphs.forEach((p) => p.remove());

  await Promise.all([hide(header), hide(main), hide(btnBox)]);
  
  location.reload();
}
