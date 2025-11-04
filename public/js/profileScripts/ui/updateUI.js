import { openUnset, hide } from "../../sharedScripts/ui/openhide.js";

export async function showLoggedOutUI({ main }) {
  await Promise.all([open(main)]);
}

export async function showLoggedInUI({ main }) {
  await Promise.all([openUnset(main)]);
}
