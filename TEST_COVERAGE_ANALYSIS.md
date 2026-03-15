# Test Coverage Analysis

**Date**: 2026-03-15
**Current Coverage**: 0% — No tests, no testing framework, no test configuration

## Current State

- 0 test files
- 0 testing frameworks installed
- 0 test scripts in package.json
- 0 coverage configuration
- ~329 lines of testable business logic in `src/lib/`, `src/store/`, `src/utils/`
- 16 React components with no rendering tests

## Recommended Testing Priorities

### 1. `src/lib/parser.ts` — Critical Priority

The parser is the core of the application (96 lines). It performs regex-based question/answer extraction with validation rules. Key test scenarios:

- Valid multi-question input parsing
- Correct answer marker detection (`*` or `+` prefixes)
- Minimum answer count validation (requires >= 2 answers)
- Missing correct answer handling
- Malformed input / edge cases (empty input, special characters, Unicode)
- Question numbering and ordering
- Whitespace and newline handling

**Estimated tests**: 15–20
**Effort**: Low (pure logic, no DOM dependencies)

### 2. `src/lib/hemis-generator.ts` — High Priority

Transforms parsed questions into HEMIS-compatible `.txt` format. Test scenarios:

- Correct HEMIS output format structure
- Multi-question formatting
- Special character escaping
- Answer ordering and correct answer marking

**Estimated tests**: 5–8
**Effort**: Low (pure transformation function)

### 3. `src/lib/kahoot-generator.ts` — High Priority

Generates Kahoot-compatible `.xlsx` files using ExcelJS. Test scenarios:

- Worksheet structure (correct columns, rows)
- Cell values match input questions/answers
- Correct answer placement
- Styling/formatting applied correctly
- Maximum question/answer limits

**Estimated tests**: 5–8
**Effort**: Medium (ExcelJS dependency needs consideration)

### 4. `src/store/app-store.ts` — Medium Priority

Zustand store managing application state. Test scenarios:

- Initial state values
- Theme toggle persistence
- Language switching
- File upload state transitions (upload → parse → convert)
- Reset/clear functionality

**Estimated tests**: 8–10
**Effort**: Low

### 5. `src/lib/history.ts` — Medium Priority

localStorage-based conversion history. Test scenarios:

- Add history entry
- Remove history entry
- Clear all history
- Corrupted localStorage data handling
- Empty state handling

**Estimated tests**: 5–6
**Effort**: Low (mock localStorage)

### 6. `src/lib/file-reader.ts` — Medium Priority

File type detection and reading. Test scenarios:

- `.txt` file reading
- `.docx` file reading (mock mammoth)
- Unsupported file type rejection
- Empty file handling

**Estimated tests**: 4–5
**Effort**: Medium (requires mocking FileReader API and mammoth)

### 7. Utilities — Low Priority

- `src/utils/cn.ts` — className merging (2–3 tests)
- `src/utils/download.ts` — Blob creation and download trigger (3–4 tests)

### 8. React Components — Lower Priority (Phase 2)

Key components to test when ready:

- `DropZone.tsx` — drag-drop file upload interaction
- `QuestionCard.tsx` — question rendering with answers
- `FormatSelector.tsx` — format selection and download trigger
- `App.tsx` — step flow orchestration (upload → preview → convert)
- `ThemeToggle.tsx` / `LanguageSwitcher.tsx` — user preference toggles

## Recommended Setup

| Tool | Purpose |
|------|---------|
| **Vitest** | Test runner (native Vite integration) |
| **@testing-library/react** | Component testing |
| **jsdom** | Browser environment simulation |
| **@testing-library/user-event** | User interaction simulation |

## Summary Table

| Area | Tests | Effort | Priority |
|------|-------|--------|----------|
| `parser.ts` | 15–20 | Low | Critical |
| `hemis-generator.ts` | 5–8 | Low | High |
| `kahoot-generator.ts` | 5–8 | Medium | High |
| `app-store.ts` | 8–10 | Low | Medium |
| `history.ts` | 5–6 | Low | Medium |
| `file-reader.ts` | 4–5 | Medium | Medium |
| Utilities | 5–7 | Low | Low |
| Components | 10–15 | High | Phase 2 |
| **Total** | **~52–79** | | |

## Quick Start

```bash
# Install dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Add to package.json scripts
# "test": "vitest",
# "test:coverage": "vitest run --coverage"

# Create vitest.config.ts with jsdom environment
# Start with parser.ts tests for maximum immediate value
```
