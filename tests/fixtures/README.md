# Test Fixtures

## Demo files

Integration tests require a CS2 demo file (`.dem`). These are too large to store in the repository.

### For CI

Demo files are stored as GitHub Release Assets on the `test-fixtures/v1` tag. The CI workflow downloads them automatically.

### For local development

**Option A**: Set the `CS2_DEMO_PATH` environment variable:
```bash
CS2_DEMO_PATH=/path/to/your/demo.dem bun test
```

**Option B**: Place a demo file at `tests/fixtures/demo.dem` (this path is gitignored):
```bash
cp /path/to/your/demo.dem tests/fixtures/demo.dem
bun test
```

**Option C**: Download from GitHub Release Assets:
```bash
./scripts/download-test-fixtures.sh
bun test
```

### What happens without a demo file?

Integration tests are skipped gracefully. Unit tests always run without any demo file.
