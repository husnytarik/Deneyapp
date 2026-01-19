import { categories } from "./categories.js";

const kategoriSelect = document.getElementById("kategoriSelect");
const altKategoriSelect = document.getElementById("altKategoriSelect");

function populateCategories() {
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.key;
    option.textContent = cat.label;
    kategoriSelect.appendChild(option);
  });
}

function populateSubCategories(selectedCategoryKeys) {
  altKategoriSelect.innerHTML = "";

  categories
    .filter((cat) => selectedCategoryKeys.includes(cat.key))
    .forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        const option = document.createElement("option");
        option.value = `${cat.key}_${sub.key}`;
        option.textContent = `${cat.label} → ${sub.label}`;
        altKategoriSelect.appendChild(option);
      });
    });
}

kategoriSelect.addEventListener("change", () => {
  const selectedKeys = Array.from(kategoriSelect.selectedOptions).map(
    (o) => o.value,
  );
  populateSubCategories(selectedKeys);
});

populateCategories();
