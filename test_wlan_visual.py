from playwright.sync_api import sync_playwright
import time

def test_wlan_qr_visual():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("🔍 WLAN QR-Code Visual Test")
        print("=" * 60)
        
        # Seite laden
        page.goto("http://localhost:8000")
        time.sleep(0.5)
        
        # Zum WLAN Tab wechseln
        print("\n1. Wechsle zum WLAN Tab...")
        wifi_tab = page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()
        time.sleep(0.3)
        
        # WLAN Daten eingeben
        print("2. Fülle WLAN Daten aus...")
        page.fill("#wifiSsid", "TestWLAN-2024")
        page.fill("#wifiPassword", "SuperGeheim123!")
        page.select_option("#wifiSecurity", "WPA")
        
        # QR-Code generieren
        print("3. Generiere WLAN QR-Code...")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        # Canvas analysieren
        canvas = page.locator("#qrcode canvas")
        assert canvas.is_visible(), "Canvas ist nicht sichtbar!"
        
        # Canvas Größe auslesen
        canvas_box = canvas.bounding_box()
        canvas_width = canvas_box['width']
        canvas_height = canvas_box['height']
        
        print(f"\n📊 Canvas Größe:")
        print(f"   Breite:  {canvas_width}px")
        print(f"   Höhe:    {canvas_height}px")
        
        # Tatsächliche Canvas Dimensionen aus dem DOM
        actual_width = page.evaluate("document.querySelector('#qrcode canvas').width")
        actual_height = page.evaluate("document.querySelector('#qrcode canvas').height")
        
        print(f"\n📐 Tatsächliche Canvas Auflösung:")
        print(f"   Breite:  {actual_width}px")
        print(f"   Höhe:    {actual_height}px")
        
        # QR-Code Container analysieren
        qrcode_div = page.locator("#qrcode")
        qrcode_box = qrcode_div.bounding_box()
        
        print(f"\n📦 QR-Code Container:")
        print(f"   Breite:  {qrcode_box['width']}px")
        print(f"   Höhe:    {qrcode_box['height']}px")
        print(f"   Padding: 24px (aus CSS)")
        
        # Berechne Rahmen/Padding
        padding_horizontal = (qrcode_box['width'] - canvas_width) / 2
        padding_vertical = (qrcode_box['height'] - canvas_height) / 2
        
        print(f"\n🎯 Berechnetes Padding:")
        print(f"   Horizontal: {padding_horizontal:.1f}px")
        print(f"   Vertikal:   {padding_vertical:.1f}px")
        
        # Module Count aus dem generierten QR-Code
        module_count = page.evaluate("""
            () => {
                const canvas = document.querySelector('#qrcode canvas');
                return canvas ? canvas.width : 0;
            }
        """)
        
        # CSS Styles prüfen
        computed_styles = page.evaluate("""
            () => {
                const container = document.querySelector('#qrcode');
                const canvas = document.querySelector('#qrcode canvas');
                const containerStyles = window.getComputedStyle(container);
                const canvasStyles = window.getComputedStyle(canvas);
                
                return {
                    containerBg: containerStyles.background,
                    containerBorderRadius: containerStyles.borderRadius,
                    containerPadding: containerStyles.padding,
                    canvasBorderRadius: canvasStyles.borderRadius,
                    canvasBoxShadow: canvasStyles.boxShadow
                };
            }
        """)
        
        print(f"\n🎨 CSS Styles:")
        print(f"   Container Padding:       {computed_styles['containerPadding']}")
        print(f"   Container Border-Radius: {computed_styles['containerBorderRadius']}")
        print(f"   Canvas Border-Radius:    {computed_styles['canvasBorderRadius']}")
        print(f"   Canvas Box-Shadow:       {computed_styles['canvasBoxShadow'][:50]}...")
        
        # Screenshots erstellen
        screenshot_path = "/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/wlan_qr_test.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"\n📸 Screenshot gespeichert: {screenshot_path}")
        
        # Zusätzlich: nur QR-Code Bereich
        qr_screenshot_path = "/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/wlan_qr_detail.png"
        qrcode_div.screenshot(path=qr_screenshot_path)
        print(f"📸 QR-Detail Screenshot: {qr_screenshot_path}")
        
        # Validierungen
        print("\n✅ Validierungen:")
        
        # Prüfe ob Canvas quadratisch ist
        if actual_width == actual_height:
            print(f"   ✓ Canvas ist quadratisch ({actual_width}x{actual_height})")
        else:
            print(f"   ✗ Canvas ist NICHT quadratisch ({actual_width}x{actual_height})")
        
        # Prüfe ob Canvas groß genug ist (sollte 512px sein)
        if actual_width >= 400:
            print(f"   ✓ Canvas ist groß genug ({actual_width}px)")
        else:
            print(f"   ✗ Canvas ist zu klein ({actual_width}px, erwartet ≥400px)")
        
        # Prüfe ob Padding gleichmäßig ist
        padding_diff = abs(padding_horizontal - padding_vertical)
        if padding_diff < 5:
            print(f"   ✓ Padding ist gleichmäßig (Differenz: {padding_diff:.1f}px)")
        else:
            print(f"   ⚠ Padding ist ungleichmäßig (Differenz: {padding_diff:.1f}px)")
        
        # Prüfe ob Padding dem CSS entspricht (24px erwartet)
        expected_padding = 24
        if abs(padding_horizontal - expected_padding) < 5:
            print(f"   ✓ Padding entspricht CSS-Vorgabe (~{expected_padding}px)")
        else:
            print(f"   ⚠ Padding weicht von CSS ab (erwartet {expected_padding}px, ist {padding_horizontal:.1f}px)")
        
        print("\n" + "=" * 60)
        print("✅ Visueller Test abgeschlossen!")
        print("   Prüfe den Screenshot für weitere Details.")
        
        # Fenster offen lassen für 3 Sekunden
        time.sleep(3)
        
        browser.close()

if __name__ == "__main__":
    try:
        test_wlan_qr_visual()
    except Exception as e:
        print(f"\n❌ Test fehlgeschlagen: {e}")
        import traceback
        traceback.print_exc()
        raise
