const materialsContainer = document.getElementById("materialsContainer");
const addMaterialBtn = document.getElementById("addMaterialBtn");

let materialCounter = 0;

function createMaterialItem() {
  materialCounter++;
  const materialId = `m${materialCounter}`;

  const div = document.createElement("div");
  div.className = "material-item";
  div.dataset.id = materialId;

  div.innerHTML = `
    <input
      type="text"
      placeholder="Gerekli malzeme adı"
      class="material-name"
    />

    <div class="alternatives">
      <strong>Alternatifler</strong>
      <div class="alternatives-list"></div>
      <button type="button" class="small add-alternative-btn">
        + Alternatif Ekle
      </button>
    </div>
  `;

  const alternativesList = div.querySelector(".alternatives-list");
  const addAltBtn = div.querySelector(".add-alternative-btn");

  addAltBtn.addEventListener("click", () => {
    const altDiv = document.createElement("div");
    altDiv.className = "alternative-item";
    altDiv.innerHTML = `
      <input type="text" placeholder="Alternatif malzeme" />
      <button type="button" class="small remove-alt">Sil</button>
    `;

    altDiv.querySelector(".remove-alt").onclick = () => altDiv.remove();
    alternativesList.appendChild(altDiv);
  });

  materialsContainer.appendChild(div);
}

addMaterialBtn.addEventListener("click", createMaterialItem);
