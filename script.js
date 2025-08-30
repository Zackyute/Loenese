// English → Runes
const englishInput = document.getElementById("englishInput");
const runeOutput = document.getElementById("runeOutput");

englishInput.addEventListener("input", () => {
  runeOutput.textContent = englishInput.value;
});

// OCR with Tesseract.js
const imageUpload = document.getElementById("imageUpload");
const ocrResult = document.getElementById("ocrResult");

imageUpload.addEventListener("change", async () => {
  if (!imageUpload.files.length) return;

  ocrResult.textContent = "Processing image...";

  const { data: { text } } = await Tesseract.recognize(
    imageUpload.files[0],
    'eng', // use English training since Loenese is a font substitution
    { logger: info => console.log(info) }
  );

  ocrResult.textContent = "OCR Result: " + text.trim();
});
