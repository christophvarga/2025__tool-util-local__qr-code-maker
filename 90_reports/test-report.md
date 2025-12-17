# Test Report

> Datum: 2025-12-13
> Suite: Playwright E2E Tests
> Browser: Chromium

## Ergebnis

| Metrik | Wert |
|--------|------|
| Total Tests | 47 |
| Passed | 47 |
| Failed | 0 |
| Skipped | 0 |
| Duration | ~43s |

## Testsuites

| Suite | Tests | Status |
|-------|-------|--------|
| TestPageLoad | 7 | PASSED |
| TestTabNavigation | 4 | PASSED |
| TestTextURLQRCode | 5 | PASSED |
| TestWLANQRCode | 5 | PASSED |
| TestDesignOptions | 4 | PASSED |
| TestAdvancedSettings | 6 | PASSED |
| TestAccessibility | 6 | PASSED |
| TestPasswordToggle | 4 | PASSED |
| TestResetButton | 4 | PASSED |
| TestQRCodeRegeneration | 2 | PASSED |

## Artefakte

- JUnit XML: `89_output/test_reports/20251213-1727/junit-e2e.xml`

## Testausfuehrung

```bash
./venv/bin/pytest 87_tests/e2e/ --browser chromium -v
```
