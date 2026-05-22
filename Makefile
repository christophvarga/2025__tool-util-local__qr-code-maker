.PHONY: install install-py311 test test-report check-deps

# Default install uses ambient pip/python (must match pytest's interpreter).
install:
	pip install -r requirements.txt
	playwright install chromium

# Explicit install for macOS where pytest is bound to /opt/homebrew/opt/python@3.11
# (PIP_REQUIRE_VIRTUALENV=1 in shell env is bypassed for this user-install).
install-py311:
	PIP_REQUIRE_VIRTUALENV=false /opt/homebrew/opt/python@3.11/bin/python3.11 \
		-m pip install --break-system-packages --user -r requirements.txt
	PIP_REQUIRE_VIRTUALENV=false /opt/homebrew/opt/python@3.11/bin/python3.11 \
		-m playwright install chromium

# Verify playwright is importable in the same interpreter pytest uses.
check-deps:
	@PYBIN=$$(head -1 $$(which pytest) | sed 's|^#!||'); \
		echo "pytest interpreter: $$PYBIN"; \
		$$PYBIN -c "import playwright.sync_api; print('playwright OK')" \
		|| (echo "FAIL: playwright missing in pytest interpreter — run 'make install-py311'"; exit 1)

test: check-deps
	pytest 87_tests/ -v --tb=short

test-report:
	@TS=$$(date +%Y%m%d-%H%M); \
	TEST_REPORT_DIR=89_output/test_reports/$$TS; \
	export TEST_REPORT_DIR; \
	mkdir -p "$$TEST_REPORT_DIR"; \
	pytest 87_tests/ --junitxml="$$TEST_REPORT_DIR/junit-py.xml" \
		--cov --cov-report=xml:"$$TEST_REPORT_DIR/coverage-py.xml" || true; \
	rm -f 89_output/test_reports/latest && ln -s "$$TS" 89_output/test_reports/latest || true; \
	echo "Testartefakte: $$TEST_REPORT_DIR"
