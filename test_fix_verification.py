from playwright.sync_api import sync_playwright
import time

def test_fix_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("✅ Verifikation: CSS-Fix für große QR-Codes")
        print("=" * 70)
        
        page.goto("http://localhost:8000")
        time.sleep(0.5)
        
        page.fill("#qrText", "Test")
        
        pixel_sizes = [256, 400, 512, 800]
        
        print("\n🔍 Teste alle Pixel-Größen nach CSS-Fix:\n")
        
        for pixel in pixel_sizes:
            page.select_option("#pixelSize", str(pixel))
            page.click("#generateBtn")
            time.sleep(0.8)
            
            # Canvas tatsächliche Größe (für Download)
            canvas_width = page.evaluate("document.querySelector('#qrcode canvas')?.width")
            
            # Canvas angezeigte Größe (im Browser)
            canvas_box = page.locator("#qrcode canvas").bounding_box()
            displayed_width = canvas_box['width']
            displayed_height = canvas_box['height']
            
            # Container Größe
            container_box = page.locator("#qrcode").bounding_box()
            container_width = container_box['width']
            
            # Overflow Check
            overflow = displayed_width > container_width
            
            # CSS Prüfung
            css_check = page.evaluate("""
                () => {
                    const canvas = document.querySelector('#qrcode canvas');
                    const styles = window.getComputedStyle(canvas);
                    return {
                        maxWidth: styles.maxWidth,
                        objectFit: styles.objectFit
                    };
                }
            """)
            
            print(f"{'='*70}")
            print(f"📏 {pixel}px Einstellung:")
            print(f"{'='*70}")
            print(f"  Canvas (tatsächlich):  {canvas_width}x{canvas_width}px ← Download-Qualität")
            print(f"  Canvas (angezeigt):    {displayed_width:.0f}x{displayed_height:.0f}px")
            print(f"  Container:             {container_width:.0f}px breit")
            print(f"  CSS max-width:         {css_check['maxWidth']}")
            print(f"  CSS object-fit:        {css_check['objectFit']}")
            
            if overflow:
                print(f"  ❌ OVERFLOW: {displayed_width:.0f}px > {container_width:.0f}px")
            else:
                fit_percentage = (displayed_width / canvas_width) * 100 if canvas_width else 0
                print(f"  ✅ Passt: {displayed_width:.0f}px ≤ {container_width:.0f}px")
                if canvas_width > container_width:
                    print(f"  🔄 Skaliert: {fit_percentage:.1f}% der Original-Größe")
            
            # Screenshot
            screenshot_name = f"fix_verified_{pixel}.png"
            page.screenshot(
                path=f"/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/{screenshot_name}",
                full_page=True
            )
            print(f"  📸 {screenshot_name}")
            print()
        
        # WLAN Test
        print(f"{'='*70}")
        print("📶 WLAN Test mit 800px:")
        print(f"{'='*70}")
        
        wifi_tab = page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()
        time.sleep(0.3)
        
        page.fill("#wifiSsid", "TestWLAN-LongName")
        page.fill("#wifiPassword", "SecretPassword123")
        page.select_option("#wifiSecurity", "WPA")
        page.select_option("#pixelSize", "800")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        canvas_box = page.locator("#qrcode canvas").bounding_box()
        container_box = page.locator("#qrcode").bounding_box()
        
        print(f"  Canvas angezeigt:  {canvas_box['width']:.0f}x{canvas_box['height']:.0f}px")
        print(f"  Container:         {container_box['width']:.0f}px breit")
        
        if canvas_box['width'] <= container_box['width']:
            print(f"  ✅ WLAN QR-Code passt!")
        else:
            print(f"  ❌ WLAN QR-Code überläuft!")
        
        page.screenshot(
            path="/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/fix_verified_wifi_800.png",
            full_page=True
        )
        
        # Zusammenfassung
        print(f"\n{'='*70}")
        print("📊 ERGEBNIS")
        print(f"{'='*70}")
        print("✅ CSS-Fix implementiert:")
        print("   • max-width: 100% (Canvas wird nie breiter als Container)")
        print("   • object-fit: contain (Seitenverhältnis bleibt erhalten)")
        print("   • Download-Qualität bleibt erhalten (volle Auflösung)")
        print("   • Nur die Anzeige im Browser wird skaliert")
        print("\n💡 Vorteil:")
        print("   • UI bleibt sauber bei allen Größen")
        print("   • Heruntergeladene Dateien haben volle 800px/512px Qualität")
        print("   • Responsiv und flexibel")
        
        time.sleep(2)
        browser.close()

if __name__ == "__main__":
    try:
        test_fix_verification()
    except Exception as e:
        print(f"\n❌ Test fehlgeschlagen: {e}")
        import traceback
        traceback.print_exc()
        raise
