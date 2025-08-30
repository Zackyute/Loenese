// Reverse mapping for loen to English
const englishMapping = {};
Object.keys(loensMapping).forEach(key => {
  englishMapping[loensMapping[key]] = key;
});

// Font load check
function checkFontLoaded() {
  const testElement = document.createElement('span');
  testElement.style.fontFamily = 'loen, monospace';
  testElement.style.fontSize = '20px';
  testElement.textContent = 'ᚨᛒᚲ';
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  document.body.appendChild(testElement);

  const fallbackWidth = testElement.offsetWidth;
  testElement.style.fontFamily = 'monospace';
  const monoWidth = testElement.offsetWidth;
  document.body.removeChild(testElement);

  const fontStatus = document.getElementById('fontStatus');
  if (fallbackWidth !== monoWidth) {
    fontStatus.className = 'font-status font-loaded';
    fontStatus.innerHTML = '✅ loen font loaded successfully';
  } else {
    fontStatus.className = 'font-status font-error';
    fontStatus.innerHTML = '⚠️ loen font not loaded - using fallback runes';
  }
}

// Translation functions
function translateToloen() {
  const englishText = document.getElementById('englishInput').value;
  const loenseText = englishText.split('').map(char => 
    loensMapping[char] || char
  ).join('');
  document.getElementById('loenseOutput').value = loenseText;
  showMapping(englishText, loenseText);
}

function translateToEnglish() {
  const loenseText = document.getElementById('loenseOutput').value;
  let englishText = '';
  let i = 0;
  
  while (i < loenseText.length) {
    let found = false;
    for (let len = 3; len >= 1; len--) {
      const substr = loenseText.substr(i, len);
      if (englishMapping[substr]) {
        englishText += englishMapping[substr];
        i += len;
        found = true;
        break;
      }
    }
    if (!found) {
      englishText += loenseText[i];
      i++;
    }
  }
  document.getElementById('englishInput').value = englishText;
  showMapping(englishText, loenseText);
}

function showMapping(english, loen) {
  const mappingDiv = document.getElementById('mappingDisplay');
  let mappingHTML = '<strong>Character Mapping:</strong><br>';
  for (let i = 0; i < Math.min(english.length, 50); i++) {
    const englishChar = english[i];
    const loenseChar = loensMapping[englishChar] || englishChar;
    mappingHTML += `${englishChar} → ${loenseChar}<br>`;
  }
  if (english.length > 50) mappingHTML += '... (showing first 50 characters)';
  mappingDiv.innerHTML = mappingHTML;
}

function swapTexts() {
  const englishInput = document.getElementById('englishInput');
  const loenseOutput = document.getElementById('loenseOutput');
  const temp = englishInput.value;
  englishInput.value = loenseOutput.value;
  loenseOutput.value = temp;
}

function clearTexts() {
  document.getElementById('englishInput').value = '';
  document.getElementById('loenseOutput').value = '';
  document.getElementById('mappingDisplay').innerHTML = 'Character mapping will appear here when translating...';
}

function populateCharacterReference() {
  const charGrid = document.getElementById('charGrid');
  charGrid.innerHTML = '';
  Object.entries(loensMapping).forEach(([english, loen]) => {
    if (english.match(/[A-Za-z0-9]/)) {
      const charBox = document.createElement('div');
      charBox.style.cssText = 'text-align: center; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px; border: 1px solid rgba(255,255,255,0.2);';
      charBox.innerHTML = `
        <div style="font-weight: bold;">${english}</div>
        <div class="loen-text" style="font-size: 16px; margin-top: 5px;">${loen}</div>
      `;
      charGrid.appendChild(charBox);
    }
  });
}
// OCR
let uploadedImage = null;

document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    uploadedImage = file;
    const reader = new FileReader();
    reader.onload = function(event) {
      const preview = document.getElementById('imagePreview');
      preview.src = event.target.result; // ✅ set preview source
    }
    reader.readAsDataURL(file); // ✅ actually read the file
  }
});