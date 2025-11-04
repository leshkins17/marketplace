export function populateForm(form, item) {
  for (const [key, value] of Object.entries(item)) {
    const el = form.querySelector(`[name="${key}"]`);
    if (!el) continue;

    if (el.tagName === "SELECT") {
      el.value = value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      el.value = value ?? "";
    }
  }
}

export function readFormValues(form) {
  const data = Object.fromEntries(new FormData(form));
  if (data.price) data.price = parseFloat(data.price);
  return data;
}
