const qrText = document.getElementById('qrText');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
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

// Error Elements
const textError = document.getElementById('textError');
const wifiError = document.getElementById('wifiError');

let currentTab = 'text';
let uploadedLogo = null;

// Helper: Show error message
function showError(element, inputElement, message) {
    element.textContent = message;
    if (inputElement) {
        inputElement.classList.add('input-error');
        inputElement.focus();
    }
}

// Helper: Clear error messages
function clearErrors() {
    textError.textContent = '';
    wifiError.textContent = '';
    qrText.classList.remove('input-error');
    wifiSsid.classList.remove('input-error');
}

// Tab Switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        currentTab = tab.dataset.tab;
        document.getElementById(`${currentTab}Tab`).classList.add('active');
    });

    // Keyboard navigation for tabs
    tab.addEventListener('keydown', (e) => {
        const tabs = Array.from(document.querySelectorAll('.tab'));
        const currentIndex = tabs.indexOf(tab);
        let newIndex = currentIndex;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            newIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
            e.preventDefault();
            newIndex = 0;
        } else if (e.key === 'End') {
            e.preventDefault();
            newIndex = tabs.length - 1;
        }

        if (newIndex !== currentIndex) {
            tabs[newIndex].focus();
            tabs[newIndex].click();
        }
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
const removeLogo = document.getElementById('removeLogo');

logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                uploadedLogo = img;
                logoName.textContent = file.name;
                removeLogo.style.display = 'flex';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        clearLogo();
    }
});

function clearLogo() {
    uploadedLogo = null;
    logoName.textContent = 'Kein Logo ausgewaehlt';
    removeLogo.style.display = 'none';
    logoInput.value = '';
}

removeLogo.addEventListener('click', clearLogo);

logoSize.addEventListener('input', (e) => {
    logoSizeVal.textContent = `${e.target.value}%`;
});

useGradient.addEventListener('change', () => {
    gradientColor.disabled = !useGradient.checked;
});

// Password Toggle
const togglePassword = document.getElementById('togglePassword');
togglePassword.addEventListener('click', () => {
    const isPassword = wifiPassword.type === 'password';
    wifiPassword.type = isPassword ? 'text' : 'password';

    const eyeIcon = togglePassword.querySelector('.eye-icon');
    const eyeOffIcon = togglePassword.querySelector('.eye-off-icon');
    eyeIcon.style.display = isPassword ? 'none' : 'block';
    eyeOffIcon.style.display = isPassword ? 'block' : 'none';

    togglePassword.setAttribute('aria-label', isPassword ? 'Passwort verbergen' : 'Passwort anzeigen');
});

// Button state helpers
const btnText = generateBtn.querySelector('.btn-text');
const btnLoading = generateBtn.querySelector('.btn-loading');

function setButtonLoading(loading) {
    generateBtn.classList.toggle('loading', loading);
    btnText.style.display = loading ? 'none' : 'inline';
    btnLoading.style.display = loading ? 'flex' : 'none';
}

function generateQRCode() {
    clearErrors();
    let text = '';

    if (currentTab === 'text') {
        text = qrText.value.trim();
        if (!text) {
            showError(textError, qrText, 'Bitte gib einen Text oder URL ein!');
            return;
        }
    } else if (currentTab === 'wifi') {
        const ssid = wifiSsid.value.trim();
        const password = wifiPassword.value;
        const security = wifiSecurity.value;

        if (!ssid) {
            showError(wifiError, wifiSsid, 'Bitte gib einen Netzwerknamen (SSID) ein!');
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
            showError(textError, qrText, 'Bitte gib zuerst Text oder WLAN-Daten ein!');
            return;
        }
    }

    // Show loading state
    setButtonLoading(true);
    qrcodeDiv.innerHTML = '';
    qrcodeDiv.classList.remove('success');

    // Use setTimeout to allow UI to update before heavy rendering
    setTimeout(() => {
        renderQRCode(text);
        setButtonLoading(false);
        qrcodeDiv.classList.add('success');
    }, 50);
}

function renderQRCode(text) {
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
    downloadSvgBtn.style.display = 'block';
    resetBtn.style.display = 'block';
}

const resetBtn = document.getElementById('resetBtn');

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

// Helper function to get current QR text
function getQRText() {
    if (currentTab === 'wifi' || (currentTab === 'design' && wifiSsid.value.trim() && !qrText.value.trim())) {
        const ssid = wifiSsid.value.trim();
        const password = wifiPassword.value;
        const security = wifiSecurity.value;
        return `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;
    }
    return qrText.value.trim();
}

downloadSvgBtn.addEventListener('click', () => {
    const text = getQRText();
    if (!text) return;

    const ecc = eccLevel.value;
    const outputSize = parseInt(pixelSize.value);

    const qr = qrcode(0, ecc);
    qr.addData(text);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const cellSize = Math.floor(outputSize / moduleCount);
    const margin = 4 * cellSize;
    const actualSize = (cellSize * moduleCount) + (2 * margin);

    // Generate SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${actualSize}" height="${actualSize}" viewBox="0 0 ${actualSize} ${actualSize}">`;
    svg += `<rect width="100%" height="100%" fill="${bgColor.value}"/>`;

    // Gradient definition if enabled
    if (useGradient.checked) {
        svg += `<defs><linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">`;
        svg += `<stop offset="0%" style="stop-color:${fgColor.value}"/>`;
        svg += `<stop offset="100%" style="stop-color:${gradientColor.value}"/>`;
        svg += `</linearGradient></defs>`;
    }

    const fillColor = useGradient.checked ? 'url(#qrGrad)' : fgColor.value;

    // Draw QR modules
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
                svg += `<rect x="${col * cellSize + margin}" y="${row * cellSize + margin}" width="${cellSize}" height="${cellSize}" fill="${fillColor}"/>`;
            }
        }
    }

    svg += '</svg>';

    // Download SVG
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
});

// Reset functionality
resetBtn.addEventListener('click', () => {
    // Clear inputs
    qrText.value = '';
    wifiSsid.value = '';
    wifiPassword.value = '';
    wifiSecurity.value = 'WPA';

    // Reset design options
    fgColor.value = '#000000';
    bgColor.value = '#ffffff';
    useGradient.checked = false;
    gradientColor.value = '#0000ff';
    gradientColor.disabled = true;
    logoSize.value = '20';
    logoSizeVal.textContent = '20%';
    clearLogo();

    // Reset advanced options
    eccLevel.value = 'H';
    pixelSize.value = '400';

    // Clear QR code display
    qrcodeDiv.innerHTML = '<div class="empty-state">QR-Code wird hier angezeigt</div>';
    qrcodeDiv.classList.remove('success');
    downloadBtn.style.display = 'none';
    downloadSvgBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    // Clear errors
    clearErrors();

    // Reset password toggle
    wifiPassword.type = 'password';
    const eyeIcon = togglePassword.querySelector('.eye-icon');
    const eyeOffIcon = togglePassword.querySelector('.eye-off-icon');
    eyeIcon.style.display = 'block';
    eyeOffIcon.style.display = 'none';
    togglePassword.setAttribute('aria-label', 'Passwort anzeigen');

    // Switch to text tab
    document.querySelector('.tab[data-tab="text"]').click();
});
