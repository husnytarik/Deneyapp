import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const form = document.getElementById("experimentForm");
const experimentsList = document.getElementById("experimentsList");
const deleteBtn = document.getElementById("deleteBtn");
const submitBtn = document.getElementById("submitBtn");
const materialsContainer = document.getElementById("materialsContainer");

let currentEditingFirestoreId = null; // Düzenleme modunda doküman referansı için

const getValue = (id) => document.getElementById(id)?.value || "";
const getMultiSelectValues = (id) =>
  Array.from(document.getElementById(id).selectedOptions).map(
    (option) => option.value,
  );

function collectMaterials() {
  return Array.from(document.querySelectorAll(".material-item"))
    .map((item) => {
      const name = item.querySelector(".material-name").value.trim();
      const alternatives = Array.from(
        item.querySelectorAll(".alternative-item input"),
      )
        .map((i) => i.value.trim())
        .filter(Boolean);
      return { ad: name, alternatifler: alternatives };
    })
    .filter((m) => m.ad);
}

// 1. LİSTELEME
onSnapshot(collection(db, "deneyler"), (snapshot) => {
  experimentsList.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "experiment-item-card";
    div.innerHTML = `<span>[${data.deneyId || "ID Yok"}] ${data.deneyAdi}</span> <button type="button" class="small edit-btn">Düzenle</button>`;
    div.querySelector(".edit-btn").onclick = () => loadToForm(docSnap.id, data);
    experimentsList.appendChild(div);
  });
});

// 2. FORMA YÜKLE
function loadToForm(firestoreId, data) {
  currentEditingFirestoreId = firestoreId;
  document.getElementById("deneyAdi").value = data.deneyAdi || "";
  document.getElementById("deneyId").value = data.deneyId || "";
  document.getElementById("amac").value = data.amac || "";
  document.getElementById("kazanim").value = data.kazanim || "";
  document.getElementById("sure").value = data.sure || "";
  document.getElementById("zorluk").value = data.zorluk || "";
  document.getElementById("ogretmeneNot").value = data.ogretmeneNot || "";
  document.getElementById("veliyeNot").value = data.veliyeNot || "";
  document.getElementById("gozlem").value = data.gozlem || "";
  document.getElementById("notlar").value = data.notlar || "";
  document.getElementById("sonuc").value = data.sonuc || "";
  document.getElementById("gunlukHayatlaBaglantisi").value =
    data.gunlukHayatlaBaglantisi || "";
  document.getElementById("gorsel").value = data.gorsel || "";
  document.getElementById("video").value = data.video || "";

  document.getElementById("guvenlikUyarilari").value = (
    data.guvenlikUyarilari || []
  ).join(", ");
  document.getElementById("deneyinYapilisi").value = (
    data.deneyinYapilisi || []
  ).join("\n");
  document.getElementById("tartismaSorulari").value = (
    data.tartismaSorulari || []
  ).join("\n");

  // Kategoriler
  const katSelect = document.getElementById("kategoriSelect");
  Array.from(katSelect.options).forEach(
    (opt) => (opt.selected = (data.kategoriler || []).includes(opt.value)),
  );
  katSelect.dispatchEvent(new Event("change"));

  setTimeout(() => {
    const altKatSelect = document.getElementById("altKategoriSelect");
    Array.from(altKatSelect.options).forEach(
      (opt) => (opt.selected = (data.altKategoriler || []).includes(opt.value)),
    );
  }, 150);

  // Malzemeler
  materialsContainer.innerHTML = "";
  (data.malzemeler || []).forEach((m) => {
    document.getElementById("addMaterialBtn").click();
    const rows = materialsContainer.querySelectorAll(".material-item");
    const lastRow = rows[rows.length - 1];
    lastRow.querySelector(".material-name").value = m.ad;
    m.alternatifler.forEach((alt) => {
      lastRow.querySelector(".add-alternative-btn").click();
      const altInputs = lastRow.querySelectorAll(".alternative-item input");
      altInputs[altInputs.length - 1].value = alt;
    });
  });

  submitBtn.textContent = "Güncelle";
  deleteBtn.style.display = "block";
}

// 3. KAYDET / ÜSTÜNE YAZ KONTROLÜ
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputDeneyId = getValue("deneyId").trim();
  const data = {
    deneyAdi: getValue("deneyAdi"),
    deneyId: inputDeneyId,
    kategoriler: getMultiSelectValues("kategoriSelect"),
    altKategoriler: getMultiSelectValues("altKategoriSelect"),
    amac: getValue("amac"),
    kazanim: getValue("kazanim"),
    sure: getValue("sure"),
    zorluk: getValue("zorluk"),
    ogretmeneNot: getValue("ogretmeneNot"),
    veliyeNot: getValue("veliyeNot"),
    malzemeler: collectMaterials(),
    guvenlikUyarilari: getValue("guvenlikUyarilari")
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean),
    deneyinYapilisi: getValue("deneyinYapilisi")
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean),
    gozlem: getValue("gozlem"),
    notlar: getValue("notlar"),
    sonuc: getValue("sonuc"),
    tartismaSorulari: getValue("tartismaSorulari")
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean),
    gunlukHayatlaBaglantisi: getValue("gunlukHayatlaBaglantisi"),
    gorsel: getValue("gorsel"),
    video: getValue("video"),
    updatedAt: Date.now(),
  };

  try {
    // Mevcut bir düzenleme değilse, aynı deneyId var mı kontrol et
    if (!currentEditingFirestoreId && inputDeneyId) {
      const q = query(
        collection(db, "deneyler"),
        where("deneyId", "==", inputDeneyId),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const confirmOverwrite = confirm(
          `"${inputDeneyId}" ID'sine sahip bir deney zaten mevcut. Üzerine yazmak istediğinizden emin misiniz?`,
        );
        if (!confirmOverwrite) return;

        // Üzerine yazmak istiyorsa, eski dokümanın ID'sini alalım
        currentEditingFirestoreId = querySnapshot.docs[0].id;
      }
    }

    if (currentEditingFirestoreId) {
      await updateDoc(doc(db, "deneyler", currentEditingFirestoreId), data);
      alert("Deney başarıyla güncellendi (Üzerine yazıldı).");
    } else {
      data.createdAt = Date.now();
      await addDoc(collection(db, "deneyler"), data);
      alert("Deney başarıyla kaydedildi.");
    }
    resetForm();
  } catch (err) {
    console.error(err);
    alert("Bir hata oluştu.");
  }
});

// 4. SİL
deleteBtn.onclick = async () => {
  if (
    currentEditingFirestoreId &&
    confirm("Bu deneyi silmek istediğinize emin misiniz?")
  ) {
    await deleteDoc(doc(db, "deneyler", currentEditingFirestoreId));
    alert("Deney silindi.");
    resetForm();
  }
};

function resetForm() {
  form.reset();
  currentEditingFirestoreId = null;
  submitBtn.textContent = "Kaydet";
  deleteBtn.style.display = "none";
  materialsContainer.innerHTML = "";
}
