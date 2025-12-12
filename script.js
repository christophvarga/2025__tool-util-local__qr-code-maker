const qrText = document.getElementById('qrText');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrcodeDiv = document.getElementById('qrcode');
const wifiSsid = document.getElementById('wifiSsid');
const wifiPassword = document.getElementById('wifiPassword');
const wifiSecurity = document.getElementById('wifiSecurity');
const eccLevel = document.getElementById('eccLevel');
const pixelSize = document.getElementById('pixelSize');

// Design Controls
const fgColor = document.getElementById('fgColor');
const bgColor = document.getElementById('bgColor');
const useGradient = document.getElementById('useGradient');
const gradientColor = document.getElementById('gradientColor');
const logoInput = document.getElementById('logoInput');
const logoSize = document.getElementById('logoSize');
const logoSizeVal = document.getElementById('logoSizeVal');
const logoName = document.getElementById('logoName');

let currentTab = 'text';
let uploadedLogo = null;

// Tab Switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        document.getElementById(`${currentTab}Tab`).classList.add('active');
    });
});

// Event Listeners
generateBtn.addEventListener('click', generateQRCode);

qrText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateQRCode();
    }
});

// Logo Upload Handling
logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                uploadedLogo = img;
                logoName.textContent = file.name;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        uploadedLogo = null;
        logoName.textContent = 'Kein Logo ausgewählt';
    }
});

logoSize.addEventListener('input', (e) => {
    logoSizeVal.textContent = `${e.target.value}%`;
});

useGradient.addEventListener('change', () => {
    gradientColor.disabled = !useGradient.checked;
});

function generateQRCode() {
    let text = '';

    if (currentTab === 'text') {
        text = qrText.value.trim();
        if (!text) {
            alert('Bitte gib einen Text oder URL ein!');
            return;
        }
    } else if (currentTab === 'wifi') {
        const ssid = wifiSsid.value.trim();
        const password = wifiPassword.value;
        const security = wifiSecurity.value;

        if (!ssid) {
            alert('Bitte gib einen Netzwerknamen (SSID) ein!');
            return;
        }

        text = `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;
    } else if (currentTab === 'design') {
        // If user clicks generate while on design tab, use data from previous active tab
        // For simplicity, default to text tab logic if text is present, else warn
        // Better UX: Don't make "Design" a main tab, but a settings section. 
        // However, based on current structure, let's just check qrText.
        text = qrText.value.trim();
        if (!text && wifiSsid.value.trim()) {
            // Fallback to wifi if text is empty but wifi is filled
            const ssid = wifiSsid.value.trim();
            const password = wifiPassword.value;
            const security = wifiSecurity.value;
            text = `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;
        } else if (!text) {
            alert('Bitte gib zuerst Text oder WLAN-Daten ein!');
            return;
        }
    }

    qrcodeDiv.innerHTML = '';

    const ecc = eccLevel.value;
    const outputSize = parseInt(pixelSize.value);

    const qr = qrcode(0, ecc);
    qr.addData(text);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const cellSize = Math.floor(outputSize / moduleCount);
    // Add some padding (quiet zone)
    const margin = 4 * cellSize;
    const actualSize = (cellSize * moduleCount) + (2 * margin);

    const canvas = document.createElement('canvas');
    canvas.width = actualSize;
    canvas.height = actualSize;
    const ctx = canvas.getContext('2d');

    // Fill Background
    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0, 0, actualSize, actualSize);

    // Set Foreground Style (Solid or Gradient)
    if (useGradient.checked) {
        const gradient = ctx.createLinearGradient(0, 0, actualSize, actualSize);
        gradient.addColorStop(0, fgColor.value);
        gradient.addColorStop(1, gradientColor.value);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = fgColor.value;
    }

    // Draw Modules
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
                ctx.fillRect(
                    col * cellSize + margin,
                    row * cellSize + margin,
                    cellSize,
                    cellSize
                );
            }
        }
    }

    // Draw Logo if exists
    if (uploadedLogo) {
        const logoPercent = parseInt(logoSize.value) / 100;
        // Max logo size should not exceed 30% of QR code for readability usually, 
        // but we let user decide with the slider (maybe up to 40-50% with high ECC)
        const logoMaxSize = actualSize * 0.3;
        // Use slider to scale from 0 to max recommended size, or just raw percentage of total size?
        // Let's make the slider 10-30% of total size.

        const logoW = actualSize * (parseInt(logoSize.value) / 100);
        const logoH = (uploadedLogo.height / uploadedLogo.width) * logoW;

        const logoX = (actualSize - logoW) / 2;
        const logoY = (actualSize - logoH) / 2;

        // Clear area behind logo for better visibility
        // Optional: Draw a rounded rect background
        ctx.fillStyle = bgColor.value;
        // Simple clear rect with more padding
        const padding = 6;
        ctx.fillRect(logoX - padding, logoY - padding, logoW + (padding * 2), logoH + (padding * 2));

        ctx.drawImage(uploadedLogo, logoX, logoY, logoW, logoH);
    }

    qrcodeDiv.appendChild(canvas);
    downloadBtn.style.display = 'block';
}

downloadBtn.addEventListener('click', () => {
    const canvas = qrcodeDiv.querySelector('canvas');
    if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = url;
        link.click();
    }
});
