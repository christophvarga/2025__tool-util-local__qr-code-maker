// DOM Elements
const qrText = document.getElementById('qrText');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const qrcodeDiv = document.getElementById('qrcode');
const wifiSsid = document.getElementById('wifiSsid');
const wifiPassword = document.getElementById('wifiPassword');
const wifiSecurity = document.getElementById('wifiSecurity');
const wifiHidden = document.getElementById('wifiHidden');
const eccLevel = document.getElementById('eccLevel');
const pixelSize = document.getElementById('pixelSize');
const quietZone = document.getElementById('quietZone');
const moduleScale = document.getElementById('moduleScale');
const moduleScaleVal = document.getElementById('moduleScaleVal');
const errorMessage = document.getElementById('errorMessage');
const charCount = document.getElementById('charCount');
const statusText = document.getElementById('statusText');
const statusSubtext = document.getElementById('statusSubtext');

// Design Controls
const fgColor = document.getElementById('fgColor');
const bgColor = document.getElementById('bgColor');
const useGradient = document.getElementById('useGradient');
const gradientColor = document.getElementById('gradientColor');
const gradientType = document.getElementById('gradientType');
const transparentBackground = document.getElementById('transparentBackground');
const qrStyle = document.getElementById('qrStyle');
const finderStyle = document.getElementById('finderStyle');
const appTheme = document.getElementById('appTheme');
const logoEnabled = document.getElementById('logoEnabled');
const logoInput = document.getElementById('logoInput');
const logoSize = document.getElementById('logoSize');
const logoSizeVal = document.getElementById('logoSizeVal');
const logoName = document.getElementById('logoName');
const useBadge = document.getElementById('useBadge');
const badgeText = document.getElementById('badgeText');

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 4096; // px
const MAX_QR_TEXT_LENGTH = 4296;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

const COLOR_PRESETS = {
    neon: { fg: '#172033', bg: '#ffffff', gradient: '#6f52ff', gradientOn: true, theme: 'midnight' },
    ocean: { fg: '#102235', bg: '#f7fbff', gradient: '#00a7c8', gradientOn: true, theme: 'daylight' },
    forest: { fg: '#18352a', bg: '#fbfff8', gradient: '#75a843', gradientOn: true, theme: 'daylight' },
    mono: { fg: '#111827', bg: '#ffffff', gradient: '#111827', gradientOn: false, theme: 'midnight' }
};

let currentTab = 'text';
let uploadedLogo = null;
let selectedFormat = 'png';
let lastPayload = '';
let lastQr = null;
let lastOptions = null;
let currentCanvas = null;
let regenerateTimer = null;

// --- Error and Status Display ---

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearError() {
    errorMessage.textContent = '';
    errorMessage.hidden = true;
}

function setStatus(title, detail, ready = false) {
    statusText.textContent = title;
    statusSubtext.textContent = detail;
    statusText.style.color = ready ? '#85f0b1' : '';
}

// --- Input Sanitization ---

function sanitizeInput(text) {
    if (text.length > MAX_QR_TEXT_LENGTH) {
        return text.substring(0, MAX_QR_TEXT_LENGTH);
    }
    return text;
}

function escapeWifiField(value) {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/:/g, '\\:')
        .replace(/"/g, '\\"');
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// --- File Upload Validation ---

function validateImageFile(file) {
    if (!file) {
        return { valid: false, error: 'Keine Datei ausgewaehlt.' };
    }
    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        return { valid: false, error: `Datei zu gross (${sizeMB}MB). Maximum: 5MB.` };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, error: `Ungueltiger Dateityp: ${file.type}. Erlaubt: PNG, JPG, GIF, WebP.` };
    }
    return { valid: true, error: null };
}

function validateImageDimensions(img) {
    if (img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION) {
        return {
            valid: false,
            error: `Bild zu gross (${img.width}x${img.height}px). Maximum: ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}px.`
        };
    }
    return { valid: true, error: null };
}

// --- Tab Switching with Keyboard Navigation ---

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabList = document.querySelector('[role="tablist"]');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab));
    });

    if (tabList) {
        tabList.addEventListener('keydown', (e) => {
            const tabsArray = Array.from(tabs);
            const currentIndex = tabsArray.findIndex(t => t.getAttribute('aria-selected') === 'true');

            let newIndex = -1;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (currentIndex + 1) % tabsArray.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
            } else if (e.key === 'Home') {
                e.preventDefault();
                newIndex = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                newIndex = tabsArray.length - 1;
            }

            if (newIndex >= 0) {
                activateTab(tabsArray[newIndex]);
                tabsArray[newIndex].focus();
            }
        });
    }
}

function activateTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
    });
    tabContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    currentTab = tab.dataset.tab;
    document.getElementById(`${currentTab}Tab`).classList.add('active');
    clearError();
}

// --- QR Code Input Extraction ---

function getTextInput() {
    const text = sanitizeInput(qrText.value.trim());
    if (!text) {
        showError('Bitte gib einen Text oder URL ein!');
        return null;
    }
    return text;
}

function getWifiInput() {
    const ssid = wifiSsid.value.trim();
    const password = wifiPassword.value;
    const security = wifiSecurity.value;
    const hidden = wifiHidden.checked ? 'true' : 'false';

    if (!ssid) {
        showError('Bitte gib einen Netzwerknamen (SSID) ein!');
        return null;
    }

    const escapedSsid = escapeWifiField(ssid);
    const escapedPassword = escapeWifiField(password);
    return `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};H:${hidden};;`;
}

function getDesignTabInput() {
    const text = qrText.value.trim();
    if (text) {
        return sanitizeInput(text);
    }
    if (wifiSsid.value.trim()) {
        return getWifiInput();
    }
    showError('Bitte gib zuerst Text oder WLAN-Daten ein!');
    return null;
}

function getInputText() {
    if (currentTab === 'text') return getTextInput();
    if (currentTab === 'wifi') return getWifiInput();
    if (currentTab === 'design') return getDesignTabInput();
    return null;
}

// --- QR Code Rendering ---

function createQRMatrix(text, ecc) {
    const qr = qrcode(0, ecc);
    qr.addData(text);
    qr.make();
    return qr;
}

function getRenderOptions() {
    return {
        fgColor: fgColor.value,
        bgColor: bgColor.value,
        useGradient: useGradient.checked,
        gradientColor: gradientColor.value,
        gradientType: gradientType.value,
        transparentBackground: transparentBackground.checked,
        qrStyle: qrStyle.value,
        finderStyle: finderStyle.value,
        outputSize: parseInt(pixelSize.value, 10),
        quietZone: parseInt(quietZone.value, 10),
        moduleScale: parseInt(moduleScale.value, 10) / 100,
        logoEnabled: logoEnabled.checked,
        logoSize: parseInt(logoSize.value, 10) / 100,
        logoSrc: uploadedLogo ? uploadedLogo.src : null,
        useBadge: useBadge.checked,
        badgeText: sanitizeInput(badgeText.value.trim()).slice(0, 6) || 'QR'
    };
}

function roundedRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function fillRoundedRect(ctx, x, y, width, height, radius) {
    roundedRectPath(ctx, x, y, width, height, radius);
    ctx.fill();
}

function fillCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function getModuleFill(ctx, size, options) {
    if (!options.useGradient) return options.fgColor;

    if (options.gradientType === 'radial') {
        const gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, size * 0.1, size * 0.5, size * 0.5, size * 0.65);
        gradient.addColorStop(0, options.gradientColor);
        gradient.addColorStop(1, options.fgColor);
        return gradient;
    }

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, options.gradientColor);
    gradient.addColorStop(1, options.fgColor);
    return gradient;
}

function paintLightArea(ctx, x, y, width, height, radius, options) {
    ctx.save();
    ctx.fillStyle = options.transparentBackground ? '#ffffff' : options.bgColor;
    fillRoundedRect(ctx, x, y, width, height, radius);
    ctx.restore();
}

function isFinderZone(row, col, moduleCount) {
    const inTop = row < 7;
    const inBottom = row >= moduleCount - 7;
    const inLeft = col < 7;
    const inRight = col >= moduleCount - 7;
    return (inTop && inLeft) || (inTop && inRight) || (inBottom && inLeft);
}

function drawModule(ctx, x, y, cellSize, options) {
    const size = cellSize * options.moduleScale;
    const offset = (cellSize - size) / 2;
    const px = x + offset;
    const py = y + offset;

    if (options.qrStyle === 'dots') {
        fillCircle(ctx, px + size / 2, py + size / 2, size / 2);
        return;
    }

    if (options.qrStyle === 'rounded') {
        fillRoundedRect(ctx, px, py, size, size, size * 0.28);
        return;
    }

    if (options.qrStyle === 'classy') {
        fillRoundedRect(ctx, px, py, size, size, size * 0.48);
        return;
    }

    ctx.fillRect(px, py, size, size);
}

function drawFinderShape(ctx, x, y, size, style, fillStyle, options) {
    ctx.save();
    ctx.fillStyle = fillStyle;

    if (style === 'circle') {
        fillCircle(ctx, x + size / 2, y + size / 2, size / 2);
        paintLightArea(ctx, x + size / 7, y + size / 7, size * 5 / 7, size * 5 / 7, size / 2, options);
        ctx.fillStyle = fillStyle;
        fillCircle(ctx, x + size / 2, y + size / 2, size * 1.5 / 7);
        ctx.restore();
        return;
    }

    const radius = style === 'rounded' ? size * 0.18 : 0;
    fillRoundedRect(ctx, x, y, size, size, radius);
    paintLightArea(ctx, x + size / 7, y + size / 7, size * 5 / 7, size * 5 / 7, radius, options);
    ctx.fillStyle = fillStyle;
    fillRoundedRect(ctx, x + size * 2 / 7, y + size * 2 / 7, size * 3 / 7, size * 3 / 7, radius * 0.7);
    ctx.restore();
}

function drawFinderPatterns(ctx, moduleCount, cellSize, offset, fillStyle, options) {
    const finderSize = cellSize * 7;
    const last = offset + (moduleCount - 7) * cellSize;
    drawFinderShape(ctx, offset, offset, finderSize, options.finderStyle, fillStyle, options);
    drawFinderShape(ctx, last, offset, finderSize, options.finderStyle, fillStyle, options);
    drawFinderShape(ctx, offset, last, finderSize, options.finderStyle, fillStyle, options);
}

function drawCenterDecoration(ctx, actualSize, options) {
    const targetSize = actualSize * options.logoSize;
    const centerX = actualSize / 2;
    const centerY = actualSize / 2;
    const padding = Math.max(8, actualSize * 0.018);
    const matSize = targetSize + padding * 2;
    const matX = centerX - matSize / 2;
    const matY = centerY - matSize / 2;
    const radius = Math.max(10, actualSize * 0.035);

    if (options.logoEnabled && uploadedLogo) {
        const aspect = uploadedLogo.height / uploadedLogo.width;
        const logoW = targetSize;
        const logoH = targetSize * aspect;
        const logoX = centerX - logoW / 2;
        const logoY = centerY - logoH / 2;

        paintLightArea(ctx, logoX - padding, logoY - padding, logoW + padding * 2, logoH + padding * 2, radius, options);
        ctx.drawImage(uploadedLogo, logoX, logoY, logoW, logoH);
        return;
    }

    if (!options.useBadge) return;

    ctx.save();
    paintLightArea(ctx, matX, matY, matSize, matSize, radius, options);
    const badgeFill = getModuleFill(ctx, actualSize, options);
    ctx.fillStyle = badgeFill;
    fillRoundedRect(ctx, centerX - targetSize / 2, centerY - targetSize / 2, targetSize, targetSize, radius);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.max(14, Math.floor(targetSize * 0.28))}px Outfit, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.badgeText, centerX, centerY);
    ctx.restore();
}

function renderToCanvas(qr, options) {
    const moduleCount = qr.getModuleCount();
    const actualSize = options.outputSize;
    const cellSize = actualSize / (moduleCount + options.quietZone * 2);
    const offset = options.quietZone * cellSize;

    const canvas = document.createElement('canvas');
    canvas.width = actualSize;
    canvas.height = actualSize;
    canvas.setAttribute('aria-label', 'Generierter QR-Code');
    canvas.setAttribute('role', 'img');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, actualSize, actualSize);
    if (!options.transparentBackground) {
        ctx.fillStyle = options.bgColor;
        ctx.fillRect(0, 0, actualSize, actualSize);
    }

    const fillStyle = getModuleFill(ctx, actualSize, options);
    ctx.fillStyle = fillStyle;

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (!qr.isDark(row, col) || isFinderZone(row, col, moduleCount)) continue;
            drawModule(ctx, offset + col * cellSize, offset + row * cellSize, cellSize, options);
        }
    }

    drawFinderPatterns(ctx, moduleCount, cellSize, offset, fillStyle, options);
    drawCenterDecoration(ctx, actualSize, options);

    return { canvas, ctx, actualSize };
}

// --- Export Builders ---

function trimNumber(value) {
    return Number(value).toFixed(3).replace(/\.?0+$/, '');
}

function svgRect(x, y, width, height, radius, fill) {
    const rx = radius ? ` rx="${trimNumber(radius)}" ry="${trimNumber(radius)}"` : '';
    return `<rect x="${trimNumber(x)}" y="${trimNumber(y)}" width="${trimNumber(width)}" height="${trimNumber(height)}"${rx} fill="${fill}"/>`;
}

function svgCircle(cx, cy, radius, fill) {
    return `<circle cx="${trimNumber(cx)}" cy="${trimNumber(cy)}" r="${trimNumber(radius)}" fill="${fill}"/>`;
}

function svgModule(x, y, cellSize, options, fill) {
    const size = cellSize * options.moduleScale;
    const offset = (cellSize - size) / 2;
    const px = x + offset;
    const py = y + offset;

    if (options.qrStyle === 'dots') {
        return svgCircle(px + size / 2, py + size / 2, size / 2, fill);
    }

    if (options.qrStyle === 'rounded') {
        return svgRect(px, py, size, size, size * 0.28, fill);
    }

    if (options.qrStyle === 'classy') {
        return svgRect(px, py, size, size, size * 0.48, fill);
    }

    return svgRect(px, py, size, size, 0, fill);
}

function svgFinder(x, y, size, options, fill) {
    const light = options.transparentBackground ? '#ffffff' : options.bgColor;
    if (options.finderStyle === 'circle') {
        return [
            svgCircle(x + size / 2, y + size / 2, size / 2, fill),
            svgCircle(x + size / 2, y + size / 2, size * 2.5 / 7, light),
            svgCircle(x + size / 2, y + size / 2, size * 1.5 / 7, fill)
        ].join('');
    }

    const radius = options.finderStyle === 'rounded' ? size * 0.18 : 0;
    return [
        svgRect(x, y, size, size, radius, fill),
        svgRect(x + size / 7, y + size / 7, size * 5 / 7, size * 5 / 7, radius, light),
        svgRect(x + size * 2 / 7, y + size * 2 / 7, size * 3 / 7, size * 3 / 7, radius * 0.7, fill)
    ].join('');
}

function buildSvg(qr, options) {
    const moduleCount = qr.getModuleCount();
    const size = options.outputSize;
    const cellSize = size / (moduleCount + options.quietZone * 2);
    const offset = options.quietZone * cellSize;
    const fill = options.useGradient ? 'url(#qrGradient)' : options.fgColor;
    const defs = options.useGradient
        ? options.gradientType === 'radial'
            ? `<defs><radialGradient id="qrGradient" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="${options.gradientColor}"/><stop offset="100%" stop-color="${options.fgColor}"/></radialGradient></defs>`
            : `<defs><linearGradient id="qrGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${options.gradientColor}"/><stop offset="100%" stop-color="${options.fgColor}"/></linearGradient></defs>`
        : '';

    const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Generierter QR-Code">`,
        defs
    ];

    if (!options.transparentBackground) {
        parts.push(svgRect(0, 0, size, size, 0, options.bgColor));
    }

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (!qr.isDark(row, col) || isFinderZone(row, col, moduleCount)) continue;
            parts.push(svgModule(offset + col * cellSize, offset + row * cellSize, cellSize, options, fill));
        }
    }

    const finderSize = cellSize * 7;
    const last = offset + (moduleCount - 7) * cellSize;
    parts.push(svgFinder(offset, offset, finderSize, options, fill));
    parts.push(svgFinder(last, offset, finderSize, options, fill));
    parts.push(svgFinder(offset, last, finderSize, options, fill));

    const targetSize = size * options.logoSize;
    const center = size / 2;
    const padding = Math.max(8, size * 0.018);
    const radius = Math.max(10, size * 0.035);
    const light = options.transparentBackground ? '#ffffff' : options.bgColor;

    if (options.logoEnabled && options.logoSrc) {
        const mat = targetSize + padding * 2;
        parts.push(svgRect(center - mat / 2, center - mat / 2, mat, mat, radius, light));
        parts.push(`<image href="${escapeXml(options.logoSrc)}" x="${trimNumber(center - targetSize / 2)}" y="${trimNumber(center - targetSize / 2)}" width="${trimNumber(targetSize)}" height="${trimNumber(targetSize)}" preserveAspectRatio="xMidYMid meet"/>`);
    } else if (options.useBadge) {
        const mat = targetSize + padding * 2;
        parts.push(svgRect(center - mat / 2, center - mat / 2, mat, mat, radius, light));
        parts.push(svgRect(center - targetSize / 2, center - targetSize / 2, targetSize, targetSize, radius, fill));
        parts.push(`<text x="${center}" y="${center}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="Outfit, Arial, sans-serif" font-size="${Math.max(14, Math.floor(targetSize * 0.28))}" font-weight="700">${escapeXml(options.badgeText)}</text>`);
    }

    parts.push('</svg>');
    return parts.join('');
}

function hexToRgb(hex) {
    const normalized = hex.replace('#', '');
    const value = normalized.length === 3
        ? normalized.split('').map(char => char + char).join('')
        : normalized;
    return {
        r: parseInt(value.slice(0, 2), 16) / 255,
        g: parseInt(value.slice(2, 4), 16) / 255,
        b: parseInt(value.slice(4, 6), 16) / 255
    };
}

function buildEps(qr, options) {
    const moduleCount = qr.getModuleCount();
    const size = options.outputSize;
    const cellSize = size / (moduleCount + options.quietZone * 2);
    const offset = options.quietZone * cellSize;
    const fg = hexToRgb(options.fgColor);
    const bg = hexToRgb(options.bgColor);
    const scale = options.moduleScale;
    const commands = [
        '%!PS-Adobe-3.0 EPSF-3.0',
        `%%BoundingBox: 0 0 ${size} ${size}`,
        '%%Creator: QR-Code Generator',
        '%%EndComments'
    ];

    if (!options.transparentBackground) {
        commands.push(`${bg.r.toFixed(4)} ${bg.g.toFixed(4)} ${bg.b.toFixed(4)} setrgbcolor`);
        commands.push(`0 0 ${size} ${size} rectfill`);
    }

    commands.push(`${fg.r.toFixed(4)} ${fg.g.toFixed(4)} ${fg.b.toFixed(4)} setrgbcolor`);

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (!qr.isDark(row, col)) continue;
            const drawSize = cellSize * scale;
            const x = offset + col * cellSize + (cellSize - drawSize) / 2;
            const y = size - (offset + row * cellSize + (cellSize + drawSize) / 2);

            if (options.qrStyle === 'dots') {
                commands.push(`newpath ${trimNumber(x + drawSize / 2)} ${trimNumber(y + drawSize / 2)} ${trimNumber(drawSize / 2)} 0 360 arc fill`);
            } else {
                commands.push(`${trimNumber(x)} ${trimNumber(y)} ${trimNumber(drawSize)} ${trimNumber(drawSize)} rectfill`);
            }
        }
    }

    commands.push('showpage', '%%EOF');
    return commands.join('\n');
}

function buildPdfBlob(canvas) {
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.width = canvas.width;
    pdfCanvas.height = canvas.height;
    const ctx = pdfCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const dataUrl = pdfCanvas.toDataURL('image/jpeg', 0.95);
    const jpgBinary = atob(dataUrl.split(',')[1]);
    const pageSize = 612;
    const imageSize = 480;
    const imageOffset = (pageSize - imageSize) / 2;
    const content = `q\n${imageSize} 0 0 ${imageSize} ${imageOffset} ${imageOffset} cm\n/Im0 Do\nQ`;

    let pdf = '%PDF-1.4\n';
    const offsets = [];
    const addObject = (number, body) => {
        offsets.push(pdf.length);
        pdf += `${number} 0 obj\n${body}\nendobj\n`;
    };

    addObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
    addObject(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    addObject(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageSize} ${pageSize}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
    addObject(4, `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpgBinary.length} >>\nstream\n${jpgBinary}\nendstream`);
    addObject(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

    const xrefOffset = pdf.length;
    pdf += 'xref\n0 6\n0000000000 65535 f \n';
    offsets.forEach(offset => {
        pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const bytes = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++) {
        bytes[i] = pdf.charCodeAt(i) & 0xff;
    }
    return new Blob([bytes], { type: 'application/pdf' });
}

function canvasToBlob(canvas, type) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas export failed'));
            }
        }, type);
    });
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// --- Main Generate Function ---

function setGeneratedState(canvas, qr, payload, options) {
    qrcodeDiv.innerHTML = '';
    qrcodeDiv.appendChild(canvas);
    downloadBtn.hidden = false;
    shareBtn.hidden = false;
    currentCanvas = canvas;
    lastQr = qr;
    lastPayload = payload;
    lastOptions = options;
    setStatus('Bereit zum Download', 'Scanne den Code, um ihn zu testen.', true);
}

function generateQRCode() {
    clearError();
    const text = getInputText();
    if (!text) return;

    try {
        const options = getRenderOptions();
        const qr = createQRMatrix(text, eccLevel.value);
        const { canvas } = renderToCanvas(qr, options);
        setGeneratedState(canvas, qr, text, options);
    } catch (err) {
        showError('Fehler beim Generieren des QR-Codes. Bitte versuche es mit kuerzerem Text.');
        setStatus('Nicht generiert', 'Pruefe Inhalt und Einstellungen.', false);
    }
}

function scheduleRegenerate() {
    if (!lastPayload) return;
    window.clearTimeout(regenerateTimer);
    regenerateTimer = window.setTimeout(() => {
        generateQRCode();
    }, 120);
}

// --- Event Listeners ---

function updateCharacterCount() {
    charCount.textContent = String(qrText.value.length);
}

function updateGradientState() {
    gradientColor.disabled = !useGradient.checked;
    gradientType.disabled = !useGradient.checked;
}

function updateLogoState() {
    logoInput.disabled = !logoEnabled.checked;
}

function applyPreset(name) {
    const preset = COLOR_PRESETS[name];
    if (!preset) return;

    fgColor.value = preset.fg;
    bgColor.value = preset.bg;
    gradientColor.value = preset.gradient;
    useGradient.checked = preset.gradientOn;
    appTheme.value = preset.theme;
    document.body.dataset.theme = preset.theme;
    updateGradientState();

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === name);
    });
    scheduleRegenerate();
}

function setSelectedFormat(format) {
    selectedFormat = format;
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.format === format);
    });
}

initTabs();
updateCharacterCount();
updateGradientState();
updateLogoState();
setStatus('Warte auf Inhalt', 'Generiere einen QR-Code fuer die Download-Optionen.', false);

generateBtn.addEventListener('click', generateQRCode);

qrText.addEventListener('input', () => {
    updateCharacterCount();
    scheduleRegenerate();
});

qrText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateQRCode();
    }
});

[wifiSsid, wifiPassword, wifiSecurity, wifiHidden].forEach(control => {
    control.addEventListener('input', scheduleRegenerate);
    control.addEventListener('change', scheduleRegenerate);
});

[
    fgColor,
    bgColor,
    gradientColor,
    gradientType,
    transparentBackground,
    qrStyle,
    finderStyle,
    eccLevel,
    pixelSize,
    quietZone,
    moduleScale,
    logoSize,
    logoEnabled,
    useBadge,
    badgeText
].forEach(control => {
    control.addEventListener('input', scheduleRegenerate);
    control.addEventListener('change', scheduleRegenerate);
});

appTheme.addEventListener('change', () => {
    document.body.dataset.theme = appTheme.value;
});

useGradient.addEventListener('change', () => {
    updateGradientState();
    scheduleRegenerate();
});

logoEnabled.addEventListener('change', () => {
    updateLogoState();
    scheduleRegenerate();
});

logoSize.addEventListener('input', (e) => {
    logoSizeVal.textContent = `${e.target.value}%`;
});

moduleScale.addEventListener('input', (e) => {
    moduleScaleVal.textContent = `${e.target.value}%`;
});

document.querySelectorAll('.preset-btn').forEach(button => {
    button.addEventListener('click', () => applyPreset(button.dataset.preset));
});

document.querySelectorAll('.format-btn').forEach(button => {
    button.addEventListener('click', () => setSelectedFormat(button.dataset.format));
});

// Logo Upload with Validation
logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
        uploadedLogo = null;
        logoName.textContent = 'Kein Logo ausgewaehlt';
        scheduleRegenerate();
        return;
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
        showError(validation.error);
        logoInput.value = '';
        uploadedLogo = null;
        logoName.textContent = 'Kein Logo ausgewaehlt';
        scheduleRegenerate();
        return;
    }

    try {
        const reader = new FileReader();
        reader.onerror = () => {
            showError('Fehler beim Lesen der Datei.');
            uploadedLogo = null;
            logoName.textContent = 'Kein Logo ausgewaehlt';
            scheduleRegenerate();
        };
        reader.onload = (event) => {
            const img = new Image();
            img.onerror = () => {
                showError('Fehler beim Laden des Bildes. Datei ist moeglicherweise beschaedigt.');
                uploadedLogo = null;
                logoName.textContent = 'Kein Logo ausgewaehlt';
                scheduleRegenerate();
            };
            img.onload = () => {
                const dimValidation = validateImageDimensions(img);
                if (!dimValidation.valid) {
                    showError(dimValidation.error);
                    logoInput.value = '';
                    uploadedLogo = null;
                    logoName.textContent = 'Kein Logo ausgewaehlt';
                    scheduleRegenerate();
                    return;
                }
                clearError();
                logoEnabled.checked = true;
                updateLogoState();
                uploadedLogo = img;
                logoName.textContent = file.name;
                scheduleRegenerate();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } catch (err) {
        showError('Unerwarteter Fehler beim Datei-Upload.');
        uploadedLogo = null;
        logoName.textContent = 'Kein Logo ausgewaehlt';
        scheduleRegenerate();
    }
});

// Generate timestamp string for download filenames: YYYYMMDD-HHMMSS
function getTimestampSuffix() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    return `${date}-${time}`;
}

// Download with Error Handling
downloadBtn.addEventListener('click', async () => {
    try {
        if (!currentCanvas || !lastQr || !lastOptions) {
            showError('Bitte generiere zuerst einen QR-Code.');
            return;
        }

        const timestamp = getTimestampSuffix();
        if (selectedFormat === 'svg') {
            const svg = buildSvg(lastQr, lastOptions);
            downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `qrcode-${timestamp}.svg`);
            return;
        }

        if (selectedFormat === 'pdf') {
            downloadBlob(buildPdfBlob(currentCanvas), `qrcode-${timestamp}.pdf`);
            return;
        }

        if (selectedFormat === 'eps') {
            const eps = buildEps(lastQr, lastOptions);
            downloadBlob(new Blob([eps], { type: 'application/postscript' }), `qrcode-${timestamp}.eps`);
            return;
        }

        const blob = await canvasToBlob(currentCanvas, 'image/png');
        downloadBlob(blob, `qrcode-${timestamp}.png`);
    } catch (err) {
        showError('Fehler beim Download. Bitte versuche es erneut.');
    }
});

shareBtn.addEventListener('click', async () => {
    try {
        if (!lastPayload || !currentCanvas) {
            showError('Bitte generiere zuerst einen QR-Code.');
            return;
        }

        const blob = await canvasToBlob(currentCanvas, 'image/png');
        const file = new File([blob], `qrcode-${getTimestampSuffix()}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'QR-Code' });
            return;
        }

        await navigator.clipboard.writeText(lastPayload);
        setStatus('Inhalt kopiert', 'Der QR-Inhalt wurde in die Zwischenablage kopiert.', true);
    } catch (err) {
        showError('Teilen ist in diesem Browser nicht verfuegbar.');
    }
});
