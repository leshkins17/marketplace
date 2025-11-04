export function renderItem(item) {
  document.getElementById("titleItem").textContent = item.title;
  document.getElementById("priceItem").textContent = `$${item.price}`;
  document.getElementById("descriptionItem").textContent = item.description;
  document.getElementById(
    "conditionItem"
  ).textContent = `Condition: ${item.condition}`;
  document.getElementById(
    "locationItem"
  ).textContent = `Location ${item.location}`;
}
