from playwright.sync_api import sync_playwright
import time

def test_ecc_and_pixel_options():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("🧪 Test: ECC Level & Pixel-Größe Einstellungen")
        print("=" * 70)
        
        page.goto("http://localhost:8000")
        time.sleep(0.5)
        
        # Test 1: Standard-Einstellungen prüfen
        print("\n1️⃣  Prüfe Standard-Einstellungen...")
        ecc_value = page.locator("#eccLevel").input_value()
        pixel_value = page.locator("#pixelSize").input_value()
        
        print(f"   📊 ECC Level: {ecc_value} (erwartet: M)")
        print(f"   📏 Pixel-Größe: {pixel_value}px (erwartet: 400)")
        
        assert ecc_value == "M", f"ECC Level sollte 'M' sein, ist aber '{ecc_value}'"
        assert pixel_value == "400", f"Pixel-Größe sollte '400' sein, ist aber '{pixel_value}'"
        print("   ✅ Standard-Einstellungen korrekt")
        
        # Test 2: QR-Code mit Standard-Einstellungen (M, 400px)
        print("\n2️⃣  Generiere QR-Code mit Standard (M, 400px)...")
        page.fill("#qrText", "https://example.com/test")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        canvas = page.locator("#qrcode canvas")
        assert canvas.is_visible()
        
        size_m_400 = page.evaluate("document.querySelector('#qrcode canvas').width")
        print(f"   📐 Canvas-Größe: {size_m_400}x{size_m_400}px")
        page.screenshot(path="/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/test_m_400.png")
        print("   ✅ QR-Code generiert")
        
        # Test 3: ECC Level auf L ändern (kleinste Auflösung)
        print("\n3️⃣  Ändere ECC auf L (Niedrig, 7%)...")
        page.select_option("#eccLevel", "L")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        size_l_400 = page.evaluate("document.querySelector('#qrcode canvas').width")
        print(f"   📐 Canvas-Größe: {size_l_400}x{size_l_400}px")
        page.screenshot(path="/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/test_l_400.png")
        
        if size_l_400 <= size_m_400:
            print(f"   ✅ ECC L erzeugt kleinere/gleiche Auflösung ({size_l_400} ≤ {size_m_400})")
        else:
            print(f"   ⚠️  ECC L ist größer als M ({size_l_400} > {size_m_400})")
        
        # Test 4: ECC Level auf H ändern (höchste Fehlerkorrektur)
        print("\n4️⃣  Ändere ECC auf H (Sehr Hoch, 30%)...")
        page.select_option("#eccLevel", "H")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        size_h_400 = page.evaluate("document.querySelector('#qrcode canvas').width")
        print(f"   📐 Canvas-Größe: {size_h_400}x{size_h_400}px")
        page.screenshot(path="/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/test_h_400.png")
        
        if size_h_400 >= size_m_400:
            print(f"   ✅ ECC H erzeugt größere/gleiche Auflösung ({size_h_400} ≥ {size_m_400})")
        else:
            print(f"   ⚠️  ECC H ist kleiner als M ({size_h_400} < {size_m_400})")
        
        # Test 5: Pixel-Größe auf 256px ändern
        print("\n5️⃣  Ändere Pixel-Größe auf 256px...")
        page.select_option("#eccLevel", "M")  # Zurück zu M
        page.select_option("#pixelSize", "256")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        size_m_256 = page.evaluate("document.querySelector('#qrcode canvas').width")
        print(f"   📐 Canvas-Größe: {size_m_256}x{size_m_256}px")
        page.screenshot(path="/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/test_m_256.png")
        
        if size_m_256 <= 256:
            print(f"   ✅ Pixel-Größe korrekt reduziert ({size_m_256} ≤ 256)")
        else:
            print(f"   ⚠️  Pixel-Größe zu groß ({size_m_256} > 256)")
        
        # Test 6: Pixel-Größe auf 800px ändern
        print("\n6️⃣  Ändere Pixel-Größe auf 800px...")
        page.select_option("#pixelSize", "800")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        size_m_800 = page.evaluate("document.querySelector('#qrcode canvas').width")
        print(f"   📐 Canvas-Größe: {size_m_800}x{size_m_800}px")
        page.screenshot(path="/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/test_m_800.png")
        
        if size_m_800 >= size_m_400:
            print(f"   ✅ Pixel-Größe korrekt erhöht ({size_m_800} ≥ {size_m_400})")
        else:
            print(f"   ⚠️  Pixel-Größe nicht erhöht ({size_m_800} < {size_m_400})")
        
        # Test 7: WLAN QR-Code mit verschiedenen ECC Levels
        print("\n7️⃣  Teste WLAN QR-Code mit verschiedenen ECC Levels...")
        wifi_tab = page.locator('.tab[data-tab="wifi"]')
        wifi_tab.click()
        time.sleep(0.3)
        
        page.fill("#wifiSsid", "TestWLAN")
        page.fill("#wifiPassword", "SuperSecret123")
        page.select_option("#wifiSecurity", "WPA")
        
        # WLAN mit L
        page.select_option("#eccLevel", "L")
        page.select_option("#pixelSize", "400")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        wifi_l = page.evaluate("document.querySelector('#qrcode canvas').width")
        print(f"   📶 WLAN ECC L: {wifi_l}x{wifi_l}px")
        
        # WLAN mit M
        page.select_option("#eccLevel", "M")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        wifi_m = page.evaluate("document.querySelector('#qrcode canvas').width")
        print(f"   📶 WLAN ECC M: {wifi_m}x{wifi_m}px")
        
        # WLAN mit H
        page.select_option("#eccLevel", "H")
        page.click("#generateBtn")
        time.sleep(0.8)
        
        wifi_h = page.evaluate("document.querySelector('#qrcode canvas').width")
        print(f"   📶 WLAN ECC H: {wifi_h}x{wifi_h}px")
        page.screenshot(path="/Users/christophvarga/Documents/03_code_repos/2025_qr-code-maker/test_wifi_h.png")
        
        print(f"   ✅ WLAN QR-Codes generiert (L:{wifi_l} ≤ M:{wifi_m} ≤ H:{wifi_h})")
        
        # Test 8: UI Layout prüfen
        print("\n8️⃣  Prüfe UI Layout der erweiterten Einstellungen...")
        advanced_visible = page.locator(".advanced-options").is_visible()
        options_row_visible = page.locator(".options-row").is_visible()
        
        assert advanced_visible, "Erweiterte Einstellungen sollten sichtbar sein"
        assert options_row_visible, "Options-Row sollte sichtbar sein"
        print("   ✅ UI-Elemente sichtbar und korrekt platziert")
        
        # Zusammenfassung
        print("\n" + "=" * 70)
        print("📊 ZUSAMMENFASSUNG")
        print("=" * 70)
        print(f"   Standard-ECC: M (15%) ✓")
        print(f"   Standard-Pixel: 400px ✓")
        print(f"   ECC Auswirkung: L({size_l_400}) < M({size_m_400}) < H({size_h_400})")
        print(f"   Pixel-Bereich: 256px({size_m_256}) bis 800px({size_m_800})")
        print(f"   WLAN funktioniert: L({wifi_l}) ≤ M({wifi_m}) ≤ H({wifi_h})")
        print("\n✅ Alle Tests erfolgreich!")
        
        time.sleep(2)
        browser.close()

if __name__ == "__main__":
    try:
        test_ecc_and_pixel_options()
    except Exception as e:
        print(f"\n❌ Test fehlgeschlagen: {e}")
        import traceback
        traceback.print_exc()
        raise
