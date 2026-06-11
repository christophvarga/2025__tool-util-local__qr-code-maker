// DOM Elements
const qrText = document.getElementById('qrText');
const plainText = document.getElementById('plainText');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const qrcodeDiv = document.getElementById('qrcode');
const resetBtn = document.getElementById('resetBtn');
const undoToast = document.getElementById('undoToast');
const undoResetBtn = document.getElementById('undoResetBtn');
const historyToggle = document.getElementById('historyToggle');
const historyDrawer = document.getElementById('historyDrawer');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const moreTypesBtn = document.getElementById('moreTypesBtn');
const moreTypesMenu = document.getElementById('moreTypesMenu');
const moreTypesLabel = document.getElementById('moreTypesLabel');
const typeSuggestion = document.getElementById('typeSuggestion');
const typeSuggestionText = document.getElementById('typeSuggestionText');
const typeSuggestionBtn = document.getElementById('typeSuggestionBtn');
const stylePresetsDiv = document.getElementById('stylePresets');
const colorSwatchesDiv = document.getElementById('colorSwatches');
const gradientField = document.getElementById('gradientField');
const bgField = document.getElementById('bgField');
const wifiSsid = document.getElementById('wifiSsid');
const wifiPassword = document.getElementById('wifiPassword');
const wifiSecurity = document.getElementById('wifiSecurity');
const wifiHidden = document.getElementById('wifiHidden');
const emailTo = document.getElementById('emailTo');
const emailSubject = document.getElementById('emailSubject');
const emailBody = document.getElementById('emailBody');
const phoneNumber = document.getElementById('phoneNumber');
const smsPhone = document.getElementById('smsPhone');
const smsMessage = document.getElementById('smsMessage');
const vcardFirst = document.getElementById('vcardFirst');
const vcardLast = document.getElementById('vcardLast');
const vcardOrg = document.getElementById('vcardOrg');
const vcardPhone = document.getElementById('vcardPhone');
const vcardEmail = document.getElementById('vcardEmail');
const vcardUrl = document.getElementById('vcardUrl');
const paypalHandle = document.getElementById('paypalHandle');
const paypalAmount = document.getElementById('paypalAmount');
const customPayload = document.getElementById('customPayload');
const eccLevel = document.getElementById('eccLevel');
const eccNote = document.getElementById('eccNote');
const pixelSize = document.getElementById('pixelSize');
const quietZone = document.getElementById('quietZone');
const moduleScale = document.getElementById('moduleScale');
const moduleScaleVal = document.getElementById('moduleScaleVal');
const errorMessage = document.getElementById('errorMessage');
const charCount = document.getElementById('charCount');
const statusCard = document.getElementById('statusCard');
const statusText = document.getElementById('statusText');
const statusSubtext = document.getElementById('statusSubtext');
const formatHint = document.getElementById('formatHint');

// Design Controls
const fgColor = document.getElementById('fgColor');
const bgColor = document.getElementById('bgColor');
const gradientColor = document.getElementById('gradientColor');
const gradientType = document.getElementById('gradientType');
const qrStyle = document.getElementById('qrStyle');
const finderStyle = document.getElementById('finderStyle');
const logoEnabled = document.getElementById('logoEnabled');
const logoOptions = document.getElementById('logoOptions');
const logoInput = document.getElementById('logoInput');
const logoSize = document.getElementById('logoSize');
const logoSizeVal = document.getElementById('logoSizeVal');
const logoName = document.getElementById('logoName');
const useBadge = document.getElementById('useBadge');
const badgeText = document.getElementById('badgeText');
const brandingSummary = document.getElementById('brandingSummary');

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 4096; // px
const MAX_QR_TEXT_LENGTH = 4296;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const HISTORY_KEY = 'qr-maker-export-history';
const SETTINGS_KEY = 'qr-maker-settings-v2';
const GHOST_PAYLOAD = 'https://example.com';

const STYLE_PRESETS = {
    klassik: { label: 'Klassik', qrStyle: 'square', finderStyle: 'square', colorMode: 'solid', fg: '#111827', bg: '#ffffff', gradient: '#111827' },
    soft: { label: 'Soft', qrStyle: 'rounded', finderStyle: 'rounded', colorMode: 'solid', fg: '#1f2937', bg: '#ffffff', gradient: '#1f2937' },
    dots: { label: 'Dots', qrStyle: 'dots', finderStyle: 'circle', colorMode: 'solid', fg: '#111827', bg: '#ffffff', gradient: '#111827' },
    orchid: { label: 'Orchid', qrStyle: 'rounded', finderStyle: 'rounded', colorMode: 'gradient', fg: '#6c5ce7', bg: '#ffffff', gradient: '#9a8cff' },
    mono: { label: 'Mono', qrStyle: 'classy', finderStyle: 'rounded', colorMode: 'solid', fg: '#6c5ce7', bg: '#ffffff', gradient: '#6c5ce7' }
};

const COLOR_SWATCHES = {
    black: { fg: '#111827', bg: '#ffffff', gradient: '#111827', mode: 'solid' },
    orchid: { fg: '#6c5ce7', bg: '#ffffff', gradient: '#9a8cff', mode: 'gradient' },
    ocean: { fg: '#102235', bg: '#f7fbff', gradient: '#00a7c8', mode: 'gradient' },
    forest: { fg: '#18352a', bg: '#fbfff8', gradient: '#75a843', mode: 'gradient' },
    sunset: { fg: '#7c2d12', bg: '#fff7ed', gradient: '#f97316', mode: 'gradient' },
    slate: { fg: '#0f172a', bg: '#e2e8f0', gradient: '#0f172a', mode: 'solid' }
};

const FORMAT_HINTS = {
    png: 'PNG ist ideal fuer digitale Anwendungen.',
    svg: 'SVG ist ideal fuer skalierbare Web- und Drucklayouts.',
    pdf: 'PDF ist ideal fuer Weitergabe und Dokumente.',
    eps: 'EPS ist ideal fuer Vektor-Workflows.'
};

const TYPE_LABELS = {
    link: 'Link',
    wifi: 'WLAN',
    text: 'Text',
    email: 'E-Mail',
    phone: 'Telefon',
    sms: 'SMS',
    vcard: 'vCard',
    paypal: 'PayPal',
    more: 'Custom'
};

const MENU_TYPE_LABELS = {
    email: 'E-Mail',
    phone: 'Telefon',
    sms: 'SMS',
    vcard: 'vCard',
    paypal: 'PayPal',
    more: 'Eigener Inhalt'
};

const PRIMARY_TYPES = ['link', 'wifi', 'text'];

const ECC_CAPACITY = { L: 7, M: 15, Q: 25, H: 30 };

let currentTab = 'link';
let currentPreset = 'orchid';
let colorMode = 'gradient';
let uploadedLogo = null;
let selectedFormat = 'png';
let lastPayload = '';
let lastQr = null;
let lastOptions = null;
let currentCanvas = null;
let renderTimer = null;
let undoSnapshot = null;
let undoTimer = null;
let suppressPersist = false;

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

function setStatus(state, title, detail) {
    statusCard.dataset.state = state;
    statusText.textContent = title;
    statusSubtext.textContent = detail;
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

function escapeVCardField(value) {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,');
}

function normalizePaypalHandle(value) {
    return value.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?paypal\.me\//i, '').split('/')[0];
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

// --- Content Type Selection (chips + more menu) ---

function closeMoreMenu() {
    moreTypesMenu.hidden = true;
    moreTypesBtn.setAttribute('aria-expanded', 'false');
}

function updateMoreChip() {
    const secondary = !PRIMARY_TYPES.includes(currentTab);
    moreTypesLabel.textContent = secondary ? MENU_TYPE_LABELS[currentTab] : 'Mehr';
    moreTypesBtn.classList.toggle('active', secondary);
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
    badgeText.value = TYPE_LABELS[currentTab].slice(0, 6).toUpperCase();
    updateMoreChip();
    closeMoreMenu();
    clearError();
    scheduleRender();
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabList = document.querySelector('[role="tablist"]');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab));
    });

    moreTypesBtn.addEventListener('click', () => {
        const open = moreTypesMenu.hidden;
        moreTypesMenu.hidden = !open;
        moreTypesBtn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
        if (!moreTypesMenu.hidden && !e.target.closest('.more-wrap')) {
            closeMoreMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMoreMenu();
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
                const target = tabsArray[newIndex];
                activateTab(target);
                if (PRIMARY_TYPES.includes(target.dataset.tab)) {
                    target.focus();
                } else {
                    moreTypesBtn.focus();
                }
            }
        });
    }
}

// --- QR Code Input Extraction ---
// Builders return { payload, hint } - hint describes missing input (live mode, no error banner).

function getLinkInput() {
    const text = sanitizeInput(qrText.value.trim());
    if (!text) return { payload: null, hint: 'Gib eine URL oder einen Text ein.' };
    return { payload: text };
}

function getTextInput() {
    const text = sanitizeInput(plainText.value.trim());
    if (!text) return { payload: null, hint: 'Gib einen Text ein.' };
    return { payload: text };
}

function getWifiInput() {
    const ssid = wifiSsid.value.trim();
    if (!ssid) return { payload: null, hint: 'Gib einen Netzwerknamen (SSID) ein.' };
    const escapedSsid = escapeWifiField(ssid);
    const escapedPassword = escapeWifiField(wifiPassword.value);
    const hidden = wifiHidden.checked ? 'true' : 'false';
    return { payload: `WIFI:T:${wifiSecurity.value};S:${escapedSsid};P:${escapedPassword};H:${hidden};;` };
}

function getEmailInput() {
    const to = emailTo.value.trim();
    if (!to) return { payload: null, hint: 'Gib eine E-Mail-Adresse ein.' };
    const subject = encodeURIComponent(emailSubject.value.trim());
    const body = encodeURIComponent(emailBody.value.trim());
    const query = [
        subject ? `subject=${subject}` : '',
        body ? `body=${body}` : ''
    ].filter(Boolean).join('&');
    return { payload: `mailto:${encodeURIComponent(to)}${query ? `?${query}` : ''}` };
}

function getPhoneInput() {
    const phone = phoneNumber.value.trim();
    if (!phone) return { payload: null, hint: 'Gib eine Telefonnummer ein.' };
    return { payload: `tel:${phone.replace(/\s+/g, '')}` };
}

function getSmsInput() {
    const phone = smsPhone.value.trim();
    if (!phone) return { payload: null, hint: 'Gib eine Telefonnummer fuer SMS ein.' };
    return { payload: `SMSTO:${phone.replace(/\s+/g, '')}:${smsMessage.value.trim()}` };
}

function getVCardInput() {
    const first = vcardFirst.value.trim();
    const last = vcardLast.value.trim();
    const fullName = [first, last].filter(Boolean).join(' ');
    if (!fullName && !vcardPhone.value.trim() && !vcardEmail.value.trim()) {
        return { payload: null, hint: 'Gib mindestens Name, Telefon oder E-Mail ein.' };
    }
    const payload = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escapeVCardField(last)};${escapeVCardField(first)};;;`,
        `FN:${escapeVCardField(fullName || vcardOrg.value.trim() || vcardEmail.value.trim())}`,
        vcardOrg.value.trim() ? `ORG:${escapeVCardField(vcardOrg.value.trim())}` : '',
        vcardPhone.value.trim() ? `TEL:${escapeVCardField(vcardPhone.value.trim())}` : '',
        vcardEmail.value.trim() ? `EMAIL:${escapeVCardField(vcardEmail.value.trim())}` : '',
        vcardUrl.value.trim() ? `URL:${escapeVCardField(vcardUrl.value.trim())}` : '',
        'END:VCARD'
    ].filter(Boolean).join('\n');
    return { payload };
}

function getPaypalInput() {
    const handle = normalizePaypalHandle(paypalHandle.value);
    if (!handle) return { payload: null, hint: 'Gib einen PayPal.me Namen ein.' };
    const amount = paypalAmount.value.trim().replace(',', '.');
    return { payload: `https://paypal.me/${encodeURIComponent(handle)}${amount ? `/${encodeURIComponent(amount)}` : ''}` };
}

function getCustomInput() {
    const text = sanitizeInput(customPayload.value.trim());
    if (!text) return { payload: null, hint: 'Gib einen eigenen QR-Inhalt ein.' };
    return { payload: text };
}

function getInputResult() {
    if (currentTab === 'link') return getLinkInput();
    if (currentTab === 'text') return getTextInput();
    if (currentTab === 'wifi') return getWifiInput();
    if (currentTab === 'email') return getEmailInput();
    if (currentTab === 'phone') return getPhoneInput();
    if (currentTab === 'sms') return getSmsInput();
    if (currentTab === 'vcard') return getVCardInput();
    if (currentTab === 'paypal') return getPaypalInput();
    if (currentTab === 'more') return getCustomInput();
    return { payload: null, hint: '' };
}

// --- QR Code Rendering ---

function createQRMatrix(text, ecc) {
    const qr = qrcode(0, ecc);
    qr.addData(text);
    qr.make();
    return qr;
}

function effectiveEcc() {
    if (eccLevel.value !== 'auto') return eccLevel.value;
    return (logoEnabled.checked && uploadedLogo) ? 'H' : 'M';
}

function getRenderOptions() {
    return {
        fgColor: fgColor.value,
        bgColor: bgColor.value,
        useGradient: colorMode === 'gradient',
        gradientColor: gradientColor.value,
        gradientType: gradientType.value,
        transparentBackground: colorMode === 'transparent',
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

// Freizuhaltende Mitte-Zone (Badge/Logo-Matte) in Pixelkoordinaten.
// Module, die diese Zone schneiden, werden uebersprungen statt von der
// weissen Matte angeschnitten zu werden.
function getCenterClearRect(actualSize, options, logoAspect) {
    const hasLogo = options.logoEnabled && options.logoSrc;
    if (!hasLogo && !options.useBadge) return null;
    const targetSize = actualSize * options.logoSize;
    const padding = Math.max(8, actualSize * 0.018);
    const w = targetSize + padding * 2;
    const h = (hasLogo && logoAspect) ? targetSize * logoAspect + padding * 2 : w;
    return { x: (actualSize - w) / 2, y: (actualSize - h) / 2, w, h };
}

function cellIntersectsRect(x, y, cellSize, rect) {
    return Boolean(rect)
        && x + cellSize > rect.x && x < rect.x + rect.w
        && y + cellSize > rect.y && y < rect.y + rect.h;
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

    const logoAspect = uploadedLogo ? uploadedLogo.height / uploadedLogo.width : null;
    const clearRect = getCenterClearRect(actualSize, options, logoAspect);

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (!qr.isDark(row, col) || isFinderZone(row, col, moduleCount)) continue;
            const px = offset + col * cellSize;
            const py = offset + row * cellSize;
            if (cellIntersectsRect(px, py, cellSize, clearRect)) continue;
            drawModule(ctx, px, py, cellSize, options);
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

    const clearRect = getCenterClearRect(size, options, null);

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (!qr.isDark(row, col) || isFinderZone(row, col, moduleCount)) continue;
            const px = offset + col * cellSize;
            const py = offset + row * cellSize;
            if (cellIntersectsRect(px, py, cellSize, clearRect)) continue;
            parts.push(svgModule(px, py, cellSize, options, fill));
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

// --- Scan Check (contrast, logo coverage, payload length) ---

function relativeLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    const channel = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(hexA, hexB) {
    const la = relativeLuminance(hexA);
    const lb = relativeLuminance(hexB);
    const lighter = Math.max(la, lb);
    const darker = Math.min(la, lb);
    return (lighter + 0.05) / (darker + 0.05);
}

function runScanCheck(payload, options, ecc) {
    const warnings = [];
    const bg = options.transparentBackground ? '#ffffff' : options.bgColor;
    const fgWorst = options.useGradient
        ? (relativeLuminance(options.gradientColor) > relativeLuminance(options.fgColor)
            ? options.gradientColor : options.fgColor)
        : options.fgColor;

    if (relativeLuminance(fgWorst) > relativeLuminance(bg)) {
        warnings.push('Vordergrund ist heller als der Hintergrund - viele Scanner lesen invertierte Codes nicht.');
    } else if (contrastRatio(fgWorst, bg) < 2.5) {
        warnings.push('Kontrast ist gering - waehle einen dunkleren Vordergrund oder helleren Hintergrund.');
    }

    if (options.logoEnabled && options.logoSrc) {
        const coverage = options.logoSize * options.logoSize * 100;
        if (coverage > ECC_CAPACITY[ecc] * 0.6) {
            warnings.push('Logo verdeckt viel Flaeche - verkleinere das Logo oder erhoehe die Fehlerkorrektur.');
        }
    }

    if (payload.length > 1000) {
        warnings.push('Sehr viele Daten - der Code wird feinteilig und braucht eine groessere Darstellung.');
    }

    return warnings;
}

// --- Live Rendering ---

function setExportEnabled(enabled) {
    downloadBtn.disabled = !enabled;
    shareBtn.disabled = !enabled;
}

function renderGhostPreview() {
    try {
        const options = getRenderOptions();
        const qr = createQRMatrix(GHOST_PAYLOAD, 'M');
        const { canvas } = renderToCanvas(qr, options);
        canvas.classList.add('ghost');
        qrcodeDiv.innerHTML = '';
        qrcodeDiv.appendChild(canvas);
    } catch (err) {
        qrcodeDiv.innerHTML = '<div class="empty-state">QR-Code wird hier angezeigt</div>';
    }
}

function renderPreview() {
    const result = getInputResult();

    if (!result.payload) {
        lastPayload = '';
        lastQr = null;
        lastOptions = null;
        currentCanvas = null;
        setExportEnabled(false);
        renderGhostPreview();
        setStatus('idle', 'Warte auf Inhalt', result.hint || 'Gib oben einen Inhalt ein - die Vorschau aktualisiert sich live.');
        return;
    }

    try {
        const options = getRenderOptions();
        const ecc = effectiveEcc();
        const qr = createQRMatrix(result.payload, ecc);
        const { canvas } = renderToCanvas(qr, options);
        qrcodeDiv.innerHTML = '';
        qrcodeDiv.appendChild(canvas);
        currentCanvas = canvas;
        lastQr = qr;
        lastPayload = result.payload;
        lastOptions = options;
        setExportEnabled(true);
        clearError();

        const warnings = runScanCheck(result.payload, options, ecc);
        if (warnings.length) {
            setStatus('warn', 'Eingeschraenkt scanbar', warnings[0]);
        } else {
            setStatus('ok', 'Gut scanbar', 'Dein QR-Code ist bereit zum Download.');
        }
    } catch (err) {
        setExportEnabled(false);
        setStatus('warn', 'Zu viele Daten', 'Der Inhalt ist zu lang fuer einen QR-Code - kuerze den Text.');
    }
}

function scheduleRender() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(() => {
        renderPreview();
        saveSettings();
    }, 150);
}

// --- Style Presets ---

function renderPresetThumb(canvasHost, preset) {
    try {
        const qr = createQRMatrix('QR-CODE', 'M');
        const { canvas } = renderToCanvas(qr, {
            fgColor: preset.fg,
            bgColor: preset.bg,
            useGradient: preset.colorMode === 'gradient',
            gradientColor: preset.gradient,
            gradientType: 'linear',
            transparentBackground: false,
            qrStyle: preset.qrStyle,
            finderStyle: preset.finderStyle,
            outputSize: 96,
            quietZone: 2,
            moduleScale: 0.92,
            logoEnabled: false,
            logoSize: 0.2,
            logoSrc: null,
            useBadge: false,
            badgeText: 'QR'
        });
        canvas.removeAttribute('role');
        canvas.removeAttribute('aria-label');
        canvasHost.appendChild(canvas);
    } catch (err) {
        // Thumbnail ist rein dekorativ - Fehler still ignorieren.
    }
}

function markPreset(name) {
    currentPreset = name;
    document.querySelectorAll('.style-preset').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.stylePreset === name);
    });
}

function applyStylePreset(name) {
    const preset = STYLE_PRESETS[name];
    if (!preset) return;
    suppressPersist = true;
    qrStyle.value = preset.qrStyle;
    finderStyle.value = preset.finderStyle;
    fgColor.value = preset.fg;
    bgColor.value = preset.bg;
    gradientColor.value = preset.gradient;
    setColorMode(preset.colorMode, { silent: true });
    suppressPersist = false;
    markPreset(name);
    scheduleRender();
}

function initStylePresets() {
    Object.entries(STYLE_PRESETS).forEach(([name, preset]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'style-preset';
        btn.dataset.stylePreset = name;
        const thumb = document.createElement('span');
        thumb.className = 'preset-thumb';
        renderPresetThumb(thumb, preset);
        const label = document.createElement('span');
        label.className = 'preset-label';
        label.textContent = preset.label;
        btn.append(thumb, label);
        btn.addEventListener('click', () => applyStylePreset(name));
        stylePresetsDiv.appendChild(btn);
    });

    const customBtn = document.createElement('button');
    customBtn.type = 'button';
    customBtn.className = 'style-preset preset-custom';
    customBtn.dataset.stylePreset = 'custom';
    const thumb = document.createElement('span');
    thumb.className = 'preset-thumb custom-thumb';
    thumb.textContent = '+';
    const label = document.createElement('span');
    label.className = 'preset-label';
    label.textContent = 'Eigene';
    customBtn.append(thumb, label);
    customBtn.addEventListener('click', () => {
        const advanced = document.getElementById('advancedDetails');
        advanced.open = true;
        advanced.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        markPreset('custom');
    });
    stylePresetsDiv.appendChild(customBtn);

    markPreset(currentPreset);
}

// --- Color Mode + Swatches ---

function setColorMode(mode, opts = {}) {
    colorMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.colorMode === mode);
    });
    gradientField.hidden = mode !== 'gradient';
    bgField.hidden = mode === 'transparent';
    if (!opts.silent) {
        markPreset('custom');
        scheduleRender();
    }
}

function initColorSwatches() {
    Object.entries(COLOR_SWATCHES).forEach(([name, swatch]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pair-swatch';
        btn.dataset.swatch = name;
        btn.title = name;
        // Zweigeteilter Dot: oben Hintergrund-, unten Vordergrundfarbe —
        // so bleiben auch dunkle Paletten auf dunklem UI sichtbar.
        const fgPart = swatch.mode === 'gradient'
            ? `linear-gradient(135deg, ${swatch.gradient}, ${swatch.fg})`
            : `linear-gradient(135deg, ${swatch.fg}, ${swatch.fg})`;
        btn.style.background = `linear-gradient(135deg, ${swatch.bg} 0%, ${swatch.bg} 38%, transparent 38%), ${fgPart}`;
        btn.addEventListener('click', () => {
            fgColor.value = swatch.fg;
            bgColor.value = swatch.bg;
            gradientColor.value = swatch.gradient;
            setColorMode(swatch.mode, { silent: true });
            markPreset('custom');
            scheduleRender();
        });
        colorSwatchesDiv.appendChild(btn);
    });
}

// --- Branding Summary + ECC Note ---

function updateLogoState() {
    const enabled = logoEnabled.checked;
    logoOptions.hidden = !enabled;
    logoInput.disabled = !enabled;
    logoSize.disabled = !enabled;
    updateBrandingSummary();
    updateEccNote();
}

function updateBrandingSummary() {
    const parts = [];
    if (logoEnabled.checked && uploadedLogo) parts.push('Logo aktiv');
    if (useBadge.checked) parts.push(`Badge "${badgeText.value.trim().toUpperCase() || 'QR'}"`);
    brandingSummary.textContent = parts.length ? parts.join(' / ') : 'Aus';
}

function updateEccNote() {
    eccNote.hidden = !(eccLevel.value === 'auto' && logoEnabled.checked && uploadedLogo);
}

// --- Type Auto-Detection (paste into link field) ---

const PAYLOAD_PATTERNS = [
    { re: /^WIFI:/i, label: 'WLAN-Code erkannt', target: 'more' },
    { re: /^BEGIN:VCARD/i, label: 'vCard erkannt', target: 'more' },
    { re: /^SMSTO:/i, label: 'SMS-Code erkannt', target: 'more' },
    { re: /^geo:/i, label: 'Geo-Koordinaten erkannt', target: 'more' },
    { re: /^tel:/i, label: 'Telefonnummer erkannt', target: 'phone' },
    { re: /^mailto:/i, label: 'E-Mail-Link erkannt', target: 'email' }
];

let suggestionTarget = null;

function updateTypeSuggestion() {
    const value = qrText.value.trim();
    const match = PAYLOAD_PATTERNS.find(p => p.re.test(value));
    if (!match) {
        typeSuggestion.hidden = true;
        suggestionTarget = null;
        return;
    }
    suggestionTarget = { ...match, value };
    typeSuggestionText.textContent = match.label;
    typeSuggestion.hidden = false;
}

function applyTypeSuggestion() {
    if (!suggestionTarget) return;
    const { target, value } = suggestionTarget;
    if (target === 'phone') {
        phoneNumber.value = value.replace(/^tel:/i, '');
    } else if (target === 'email') {
        emailTo.value = value.replace(/^mailto:/i, '').split('?')[0];
    } else {
        customPayload.value = value;
    }
    qrText.value = '';
    updateCharacterCount();
    typeSuggestion.hidden = true;
    suggestionTarget = null;
    activateTab(document.querySelector(`.tab[data-tab="${target}"]`));
}

// --- Settings Persistence (Design only, kein Inhalt) ---

function saveSettings() {
    if (suppressPersist) return;
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({
            preset: currentPreset,
            colorMode,
            fg: fgColor.value,
            bg: bgColor.value,
            gradient: gradientColor.value,
            gradientType: gradientType.value,
            qrStyle: qrStyle.value,
            finderStyle: finderStyle.value,
            ecc: eccLevel.value,
            quietZone: quietZone.value,
            moduleScale: moduleScale.value,
            pixelSize: pixelSize.value,
            format: selectedFormat,
            useBadge: useBadge.checked
        }));
    } catch (err) {
        // localStorage nicht verfuegbar (z.B. private mode) - Persistenz still deaktivieren.
    }
}

function restoreSettings() {
    let saved = null;
    try {
        saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    } catch (err) {
        return;
    }
    if (!saved) return;
    suppressPersist = true;
    if (saved.fg) fgColor.value = saved.fg;
    if (saved.bg) bgColor.value = saved.bg;
    if (saved.gradient) gradientColor.value = saved.gradient;
    if (saved.gradientType) gradientType.value = saved.gradientType;
    if (saved.qrStyle) qrStyle.value = saved.qrStyle;
    if (saved.finderStyle) finderStyle.value = saved.finderStyle;
    if (saved.ecc) eccLevel.value = saved.ecc;
    if (saved.quietZone) quietZone.value = saved.quietZone;
    if (saved.moduleScale) moduleScale.value = saved.moduleScale;
    if (saved.pixelSize) pixelSize.value = saved.pixelSize;
    if (typeof saved.useBadge === 'boolean') useBadge.checked = saved.useBadge;
    if (saved.colorMode) setColorMode(saved.colorMode, { silent: true });
    if (saved.preset) currentPreset = saved.preset;
    if (saved.format) selectedFormat = saved.format;
    suppressPersist = false;
}

// --- Format / Export ---

function setSelectedFormat(format) {
    selectedFormat = format;
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.format === format);
    });
    downloadBtn.textContent = `Herunterladen (${format.toUpperCase()})`;
    formatHint.textContent = FORMAT_HINTS[format] || FORMAT_HINTS.png;
    const vector = format === 'svg' || format === 'eps';
    pixelSize.disabled = vector;
    saveSettings();
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch (err) {
        return [];
    }
}

function saveHistory(items) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 8)));
}

function renderHistory() {
    const items = getHistory();
    historyList.innerHTML = '';
    if (!items.length) {
        const item = document.createElement('li');
        item.textContent = 'Noch keine Exporte.';
        historyList.appendChild(item);
        return;
    }
    items.forEach(entry => {
        const item = document.createElement('li');
        const left = document.createElement('span');
        const right = document.createElement('span');
        left.textContent = `${entry.type} - ${entry.format.toUpperCase()}`;
        right.textContent = entry.time;
        item.append(left, right);
        historyList.appendChild(item);
    });
}

function recordExport(format) {
    const now = new Date();
    const items = getHistory();
    items.unshift({
        type: TYPE_LABELS[currentTab] || 'QR',
        format,
        time: now.toLocaleString('de-AT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    });
    saveHistory(items);
    renderHistory();
}

// --- Reset + Undo ---

function captureSnapshot() {
    const fields = [
        qrText, plainText, wifiSsid, wifiPassword, emailTo, emailSubject, emailBody,
        phoneNumber, smsPhone, smsMessage, vcardFirst, vcardLast, vcardOrg, vcardPhone,
        vcardEmail, vcardUrl, paypalHandle, paypalAmount, customPayload,
        wifiSecurity, eccLevel, pixelSize, quietZone, moduleScale, logoSize, badgeText,
        fgColor, bgColor, gradientColor, gradientType, qrStyle, finderStyle
    ];
    return {
        values: fields.map(f => f.value),
        fields,
        checks: [wifiHidden.checked, logoEnabled.checked, useBadge.checked],
        tab: currentTab,
        preset: currentPreset,
        mode: colorMode,
        format: selectedFormat,
        logo: uploadedLogo,
        logoLabel: logoName.textContent
    };
}

function restoreSnapshot(snap) {
    snap.fields.forEach((f, i) => { f.value = snap.values[i]; });
    [wifiHidden.checked, logoEnabled.checked, useBadge.checked] = snap.checks;
    uploadedLogo = snap.logo;
    logoName.textContent = snap.logoLabel;
    currentPreset = snap.preset;
    setColorMode(snap.mode, { silent: true });
    markPreset(snap.preset);
    setSelectedFormat(snap.format);
    activateTab(document.querySelector(`.tab[data-tab="${snap.tab}"]`));
    updateCharacterCount();
    updateLogoState();
    updateBrandingSummary();
    moduleScaleVal.textContent = `${moduleScale.value}%`;
    logoSizeVal.textContent = `${logoSize.value}%`;
    scheduleRender();
}

function showUndoToast() {
    undoToast.hidden = false;
    window.clearTimeout(undoTimer);
    undoTimer = window.setTimeout(() => {
        undoToast.hidden = true;
        undoSnapshot = null;
    }, 6000);
}

function resetApp() {
    undoSnapshot = captureSnapshot();
    lastPayload = '';
    lastQr = null;
    lastOptions = null;
    currentCanvas = null;
    [
        qrText, plainText, wifiSsid, wifiPassword, emailTo, emailSubject, emailBody,
        phoneNumber, smsPhone, smsMessage, vcardFirst, vcardLast, vcardOrg, vcardPhone,
        vcardEmail, vcardUrl, paypalHandle, paypalAmount, customPayload
    ].forEach(control => { control.value = ''; });
    wifiSecurity.value = 'WPA';
    wifiHidden.checked = false;
    eccLevel.value = 'auto';
    pixelSize.value = '512';
    quietZone.value = '4';
    moduleScale.value = '92';
    moduleScaleVal.textContent = '92%';
    gradientType.value = 'linear';
    logoSize.value = '20';
    logoSizeVal.textContent = '20%';
    logoEnabled.checked = false;
    useBadge.checked = true;
    badgeText.value = 'LINK';
    uploadedLogo = null;
    logoInput.value = '';
    logoName.textContent = 'Kein Logo ausgewaehlt';
    typeSuggestion.hidden = true;
    applyStylePreset('orchid');
    setSelectedFormat('png');
    updateCharacterCount();
    updateLogoState();
    activateTab(document.querySelector('.tab[data-tab="link"]'));
    clearError();
    showUndoToast();
}

// --- Event Listeners ---

function updateCharacterCount() {
    charCount.textContent = String(qrText.value.length);
}

qrText.addEventListener('input', () => {
    updateCharacterCount();
    updateTypeSuggestion();
    scheduleRender();
});

[
    plainText,
    emailTo,
    emailSubject,
    emailBody,
    phoneNumber,
    smsPhone,
    smsMessage,
    vcardFirst,
    vcardLast,
    vcardOrg,
    vcardPhone,
    vcardEmail,
    vcardUrl,
    paypalHandle,
    paypalAmount,
    customPayload,
    wifiSsid,
    wifiPassword,
    wifiSecurity,
    wifiHidden
].forEach(control => {
    control.addEventListener('input', scheduleRender);
    control.addEventListener('change', scheduleRender);
});

document.querySelectorAll('.clear-field').forEach(button => {
    button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.clear);
        if (!target) return;
        target.value = '';
        updateCharacterCount();
        updateTypeSuggestion();
        target.focus();
        scheduleRender();
    });
});

resetBtn.addEventListener('click', resetApp);

undoResetBtn.addEventListener('click', () => {
    if (!undoSnapshot) return;
    restoreSnapshot(undoSnapshot);
    undoSnapshot = null;
    undoToast.hidden = true;
});

historyToggle.addEventListener('click', () => {
    historyDrawer.hidden = !historyDrawer.hidden;
    renderHistory();
});

clearHistoryBtn.addEventListener('click', () => {
    saveHistory([]);
    renderHistory();
});

[fgColor, bgColor, gradientColor].forEach(control => {
    control.addEventListener('input', () => {
        markPreset('custom');
        scheduleRender();
    });
});

[qrStyle, finderStyle].forEach(control => {
    control.addEventListener('change', () => {
        markPreset('custom');
        scheduleRender();
    });
});

[eccLevel, quietZone, gradientType, moduleScale, logoSize, badgeText, pixelSize].forEach(control => {
    control.addEventListener('input', scheduleRender);
    control.addEventListener('change', scheduleRender);
});

eccLevel.addEventListener('change', updateEccNote);

useBadge.addEventListener('change', () => {
    updateBrandingSummary();
    scheduleRender();
});

badgeText.addEventListener('input', updateBrandingSummary);

logoEnabled.addEventListener('change', () => {
    updateLogoState();
    scheduleRender();
});

logoSize.addEventListener('input', (e) => {
    logoSizeVal.textContent = `${e.target.value}%`;
});

moduleScale.addEventListener('input', (e) => {
    moduleScaleVal.textContent = `${e.target.value}%`;
});

document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', () => setColorMode(button.dataset.colorMode));
});

document.querySelectorAll('.format-btn').forEach(button => {
    button.addEventListener('click', () => setSelectedFormat(button.dataset.format));
});

typeSuggestionBtn.addEventListener('click', applyTypeSuggestion);

// Cmd/Ctrl+S laedt den aktuellen QR-Code herunter
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!downloadBtn.disabled) downloadBtn.click();
    }
});

// Logo Upload with Validation
logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
        uploadedLogo = null;
        logoName.textContent = 'Kein Logo ausgewaehlt';
        updateBrandingSummary();
        scheduleRender();
        return;
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
        showError(validation.error);
        logoInput.value = '';
        uploadedLogo = null;
        logoName.textContent = 'Kein Logo ausgewaehlt';
        updateBrandingSummary();
        scheduleRender();
        return;
    }

    try {
        const reader = new FileReader();
        reader.onerror = () => {
            showError('Fehler beim Lesen der Datei.');
            uploadedLogo = null;
            logoName.textContent = 'Kein Logo ausgewaehlt';
            scheduleRender();
        };
        reader.onload = (event) => {
            const img = new Image();
            img.onerror = () => {
                showError('Fehler beim Laden des Bildes. Datei ist moeglicherweise beschaedigt.');
                uploadedLogo = null;
                logoName.textContent = 'Kein Logo ausgewaehlt';
                scheduleRender();
            };
            img.onload = () => {
                const dimValidation = validateImageDimensions(img);
                if (!dimValidation.valid) {
                    showError(dimValidation.error);
                    logoInput.value = '';
                    uploadedLogo = null;
                    logoName.textContent = 'Kein Logo ausgewaehlt';
                    scheduleRender();
                    return;
                }
                clearError();
                logoEnabled.checked = true;
                uploadedLogo = img;
                logoName.textContent = file.name;
                updateLogoState();
                scheduleRender();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } catch (err) {
        showError('Unerwarteter Fehler beim Datei-Upload.');
        uploadedLogo = null;
        logoName.textContent = 'Kein Logo ausgewaehlt';
        scheduleRender();
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
            showError('Bitte gib zuerst einen Inhalt ein.');
            return;
        }

        const timestamp = getTimestampSuffix();
        if (selectedFormat === 'svg') {
            const svg = buildSvg(lastQr, lastOptions);
            downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `qrcode-${timestamp}.svg`);
            recordExport('svg');
            return;
        }

        if (selectedFormat === 'pdf') {
            downloadBlob(buildPdfBlob(currentCanvas), `qrcode-${timestamp}.pdf`);
            recordExport('pdf');
            return;
        }

        if (selectedFormat === 'eps') {
            const eps = buildEps(lastQr, lastOptions);
            downloadBlob(new Blob([eps], { type: 'application/postscript' }), `qrcode-${timestamp}.eps`);
            recordExport('eps');
            return;
        }

        const blob = await canvasToBlob(currentCanvas, 'image/png');
        downloadBlob(blob, `qrcode-${timestamp}.png`);
        recordExport('png');
    } catch (err) {
        showError('Fehler beim Download. Bitte versuche es erneut.');
    }
});

shareBtn.addEventListener('click', async () => {
    try {
        if (!lastPayload || !currentCanvas) {
            showError('Bitte gib zuerst einen Inhalt ein.');
            return;
        }

        const blob = await canvasToBlob(currentCanvas, 'image/png');
        const file = new File([blob], `qrcode-${getTimestampSuffix()}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'QR-Code' });
            return;
        }

        await navigator.clipboard.writeText(lastPayload);
        setStatus('ok', 'Inhalt kopiert', 'Der QR-Inhalt wurde in die Zwischenablage kopiert.');
    } catch (err) {
        showError('Teilen ist in diesem Browser nicht verfuegbar.');
    }
});

// --- Init ---

document.body.dataset.theme = 'orchid';
restoreSettings();
initTabs();
initStylePresets();
initColorSwatches();
setColorMode(colorMode, { silent: true });
markPreset(currentPreset);
updateCharacterCount();
updateLogoState();
updateBrandingSummary();
moduleScaleVal.textContent = `${moduleScale.value}%`;
setSelectedFormat(selectedFormat);
renderHistory();
renderPreview();
