import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const form = document.getElementById("experimentForm");

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

      return {
        id: item.dataset.id,
        ad: name,
        alternatifler: alternatives,
      };
    })
    .filter((m) => m.ad);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    deneyAdi: getValue("deneyAdi"),
    deneyId: getValue("deneyId"), // şimdilik serbest bırakıyoruz

    // ✅ YENİ YAPI
    kategoriler: getMultiSelectValues("kategoriSelect"), // ["fz", "km"]
    altKategoriler: getMultiSelectValues("altKategoriSelect"), // ["fz_ke", "km_ab"]

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

    createdAt: Date.now(),
  };

  await addDoc(collection(db, "deneyler"), data);

  alert("Deney kaydedildi");
  form.reset();
});
