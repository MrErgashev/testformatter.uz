# TestFormatter.uz

## Project Overview
100% client-side web app that converts test files (.txt, .docx) into HEMIS (.txt) and Kahoot (.xlsx) formats. No server — all processing happens in the browser.

## Tech Stack
- **Framework**: React 19.2 + TypeScript 5.9
- **Build**: Vite 7.3
- **Styling**: Tailwind CSS v4.2 (`@import "tailwindcss"`, `@theme` block, `@custom-variant`)
- **State**: Zustand 5.0
- **i18n**: react-i18next 16.5 + i18next 25.8 (UZ, RU, EN)
- **Animations**: Framer Motion 12.36
- **File parsing**: mammoth 1.12 (docx), exceljs 4.4 + xlsx 0.18 (Kahoot export)
- **Fonts**: Outfit (headings, weights 400–800) + DM Sans (body, weights 400–700 + italic) via Google Fonts
- **Deployment**: Vercel (SPA rewrite in `vercel.json`)

## Commands
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Type-check (tsc -b) + production build
npm run lint     # ESLint (flat config)
npm run preview  # Preview production build
```

## Critical: Tailwind CSS v4 Dark Mode
Dark mode uses **class-based** strategy, NOT media query. This line in `src/index.css` is essential:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
The `.dark` class is toggled on `<html>` via `document.documentElement.classList.toggle('dark', ...)` in `App.tsx`.

The `index.html` defaults to `class="dark"` on `<html>`. The store reads from localStorage on init and falls back to system preference.

## Design System
Glassmorphism + Neomorphism style. Custom CSS classes in `src/index.css` auto-switch between light/dark:
- `.glass` — frosted glass card (light: white 65% opacity, dark: white 7% opacity)
- `.glass-strong` — stronger glass (light: 80%, dark: 12%)
- `.neo-raised` — neomorphic raised shadow (auto light/dark)
- `.neo-inset` — neomorphic inset shadow (auto light/dark)
- `.glow-blue`, `.glow-emerald` — glow effects
- `.bg-dark-base` — dark gradient mesh (#0a0e1a + blue radial glows)
- `.bg-light-base` — light gradient mesh (#f0f4ff + blue/cyan radials)
- `.dropzone-glow` — rotating glow animation for upload zone

These classes handle dark/light internally via `:where(.dark, .dark *)` selectors — do NOT use Tailwind `dark:` prefix with them.

**CSS Animations** defined in `index.css`: `breathe`, `float`, `shimmer`, `pulse-ring`, `glow-rotate`. Use via `animation:` property in CSS or Framer Motion for component-level animations.

## Application Flow
The app follows a 3-step flow controlled by state in `App.tsx`:
1. **Upload** — User uploads .txt or .docx file via `DropZone` (drag-drop or file picker)
2. **Preview** — Parsed questions displayed in `QuestionList` + `QuestionCard`, errors shown as warnings
3. **Download** — User picks format (HEMIS or Kahoot) in `FormatSelector`, downloads converted file

Step logic: `currentStep = !parseResult ? 'upload' : showSuccess ? 'download' : 'preview'`

## State Management (Zustand)
Store at `src/store/app-store.ts`:
```
State: file, parseResult, isLoading, error, selectedFormat, theme, language, showSuccess
Actions: setFile, setParseResult, setIsLoading, setError, setSelectedFormat, setTheme, setLanguage, setShowSuccess, reset
```
- **Theme** persisted to `localStorage` key `testformatter_theme`, falls back to system preference
- **Language** persisted to `localStorage` key `testformatter_lang`, default `'uz'`

## TypeScript Types (`src/types/index.ts`)
- `ParsedAnswer` — `{ letter, text, isCorrect }`
- `ParsedQuestion` — `{ number, text, answers: ParsedAnswer[] }`
- `ParseError` — `{ questionNumber, type: ParseErrorType, message, count? }`
- `ParseResult` — `{ questions: ParsedQuestion[], errors: ParseError[] }`
- `ConversionRecord` — `{ id, fileName, questionCount, outputFormat, timestamp }`
- `OutputFormat` — `'hemis' | 'kahoot'`
- `Language` — `'uz' | 'ru' | 'en'`
- `Theme` — `'light' | 'dark'`

## i18n
Setup in `src/i18n/index.ts`. Translation files: `src/i18n/uz.json`, `ru.json`, `en.json`.
Default and fallback language: `'uz'`.

**Translation key namespaces**: `app.*`, `upload.*`, `preview.*`, `convert.*`, `history.*`, `footer.*`, `errors.*`

When adding UI text, add the key to **all three** language files.

## Project Structure
```
src/
  App.tsx                          # Main layout, 3-step flow logic
  main.tsx                         # Entry point (imports i18n, css, renders App)
  index.css                        # Tailwind v4 config + glass/neo/glow classes + animations
  store/app-store.ts               # Zustand store (state + actions)
  types/index.ts                   # TypeScript types
  components/
    layout/Header.tsx              # Fixed glass header (logo, lang switcher, theme toggle)
    layout/Footer.tsx              # Author info footer
    upload/DropZone.tsx            # File upload (drag-drop, file picker, sample downloads)
    upload/FileInfo.tsx            # Uploaded file display (name, size, extension badge)
    preview/QuestionCard.tsx       # Single question with answers (correct answer highlighted)
    preview/QuestionList.tsx       # Scrollable question list with error banner
    convert/FormatSelector.tsx     # HEMIS/Kahoot picker + download button + success overlay
    history/HistoryPanel.tsx       # Collapsible conversion history (localStorage, max 50 records)
    ui/Button.tsx                  # Variants: primary (blue gradient), secondary (glass), ghost
    ui/Card.tsx                    # Glass card wrapper with optional hover animation
    ui/LanguageSwitcher.tsx        # UZ/RU/EN toggle with layoutId animation
    ui/ThemeToggle.tsx             # Sun/moon toggle with rotation animation
    ui/StepIndicator.tsx           # 3-step progress (upload → preview → download)
    ui/Toast.tsx                   # Notification (success/error/info, auto-dismiss 3s)
  lib/
    parser.ts                      # Test text parser — DO NOT MODIFY
    hemis-generator.ts             # HEMIS format output — DO NOT MODIFY
    kahoot-generator.ts            # Kahoot xlsx output — DO NOT MODIFY
    file-reader.ts                 # File reading (txt/docx) — DO NOT MODIFY
    history.ts                     # localStorage history (max 50) — DO NOT MODIFY
  i18n/
    index.ts                       # i18n initialization
    uz.json                        # Uzbek translations
    ru.json                        # Russian translations
    en.json                        # English translations
  utils/cn.ts                      # clsx + tailwind-merge helper
  utils/download.ts                # downloadBlob() and downloadText() helpers
public/
  favicon.svg                      # Site favicon
  samples/namuna.txt               # Sample test file (text)
  samples/namuna.docx              # Sample test file (docx)
  templates/KahootQuizTemplate.xlsx # Kahoot export template (filled starting row 9)
```

## Rules
- **Never modify logic files**: `parser.ts`, `hemis-generator.ts`, `kahoot-generator.ts`, `file-reader.ts`, `history.ts`
- **Never change existing i18n keys** — only add new ones if needed, and add to all three language files
- **Preserve fonts**: Outfit (headings) + DM Sans (body) — loaded in `index.html`
- **Use auto-switching glass/neo classes** — do NOT use `dark:glass` or `dark:neo-raised` as Tailwind variants
- **Accent color**: blue-500/blue-600 for interactive elements, emerald for Kahoot/success states
- **Responsive**: support 375px–1440px
- **Class merging**: Use `cn()` from `src/utils/cn.ts` (clsx + tailwind-merge) when combining conditional classes
- **Animations**: Use Framer Motion for component-level animations; CSS keyframes for ambient effects

## Build Notes
- Tailwind CSS is integrated via `@tailwindcss/vite` plugin (not PostCSS) — configured in `vite.config.ts`
- Vite was downgraded from v8 to v7 for `@tailwindcss/vite` compatibility
- Always run `npm run build` to verify no TypeScript errors before committing
- TypeScript strict mode is enabled; `noUnusedLocals` is disabled, `noUnusedParameters` is enabled
- ESLint uses flat config format (`eslint.config.js`) with typescript-eslint, react-hooks, and react-refresh plugins
