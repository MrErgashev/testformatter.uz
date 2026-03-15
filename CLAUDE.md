# TestFormatter.uz

## Project Overview
100% client-side web app that converts test files (.txt, .docx) into HEMIS (.txt) and Kahoot (.xlsx) formats. No server — all processing happens in the browser. Includes an interactive user guide, inline question editing, and confetti success animations.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"`, `@theme` block, `@custom-variant`)
- **State**: Zustand
- **i18n**: react-i18next (UZ, RU, EN)
- **Animations**: Framer Motion
- **Confetti**: canvas-confetti (success celebration effects)
- **File parsing**: mammoth (docx), exceljs/xlsx (Kahoot export)
- **Fonts**: Outfit (headings) + DM Sans (body) via Google Fonts

## Critical: Tailwind CSS v4 Dark Mode
Dark mode uses **class-based** strategy, NOT media query. This line in `src/index.css` is essential:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
The `.dark` class is toggled on `<html>` via `document.documentElement.classList.toggle('dark', ...)`.

## Design System
Glassmorphism + Neomorphism style. Custom CSS classes in `src/index.css` auto-switch between light/dark:
- `.glass` — frosted glass card (light: white 65% opacity, dark: white 7% opacity)
- `.glass-strong` — stronger glass (light: 80%, dark: 12%)
- `.neo-raised` — neomorphic raised shadow (auto light/dark)
- `.neo-inset` — neomorphic inset shadow (auto light/dark)
- `.glow-blue`, `.glow-emerald` — glow effects
- `.bg-dark-base` — dark gradient mesh (#0a0e1a + blue radial glows)
- `.bg-light-base` — light gradient mesh (#f0f4ff + blue/cyan radials)

These classes handle dark/light internally via `:where(.dark, .dark *)` selectors — do NOT use Tailwind `dark:` prefix with them.

## View System
No React Router — uses state-driven view switching via Zustand (`currentView: 'app' | 'guide'`). Browser back button is supported via `popstate` event listener in `App.tsx`.

## Project Structure
```
src/
  App.tsx                          # Main layout, view switching (app/guide), browser back button support
  main.tsx                         # App entry point (React root)
  index.css                        # Tailwind config + glass/neo/glow classes
  store/app-store.ts               # Zustand store (view, parse, edit, format state)
  types/index.ts                   # TypeScript types (CurrentView, ParsedQuestion, etc.)
  components/
    layout/Header.tsx              # Fixed glass header with logo, guide nav, lang/theme toggles
    layout/Footer.tsx              # Author info footer
    upload/DropZone.tsx            # File upload with drag-drop, sample file downloads
    upload/FileInfo.tsx            # Uploaded file display
    preview/QuestionCard.tsx       # Single question with answers + inline editing mode
    preview/QuestionList.tsx       # Scrollable question list, auto-scroll to first error
    convert/FormatSelector.tsx     # HEMIS/Kahoot picker + download + confetti animation
    history/HistoryPanel.tsx       # Conversion history (localStorage)
    guide/UserGuide.tsx            # User guide page wrapper
    guide/GuideHero.tsx            # Animated SVG hero illustration
    guide/GuideSteps.tsx           # 3-step tutorial with animated SVG illustrations
    guide/GuideFormats.tsx         # Input/output format cards + code sample
    guide/GuideTips.tsx            # FAQ accordion (5 items, expandable)
    ui/Button.tsx                  # Primary/secondary/ghost button
    ui/Card.tsx                    # Glass card wrapper
    ui/ErrorBoundary.tsx           # Error boundary with crash UI
    ui/LanguageSwitcher.tsx        # UZ/RU/EN toggle
    ui/ThemeToggle.tsx             # Dark/light toggle
    ui/StepIndicator.tsx           # 3-step flow (upload/preview/download)
    ui/Toast.tsx                   # Notification toast
  lib/
    parser.ts                      # Test text parser — DO NOT MODIFY
    hemis-generator.ts             # HEMIS format output — DO NOT MODIFY
    kahoot-generator.ts            # Kahoot xlsx output — DO NOT MODIFY
    file-reader.ts                 # File reading (txt/docx) — DO NOT MODIFY
    history.ts                     # localStorage history — DO NOT MODIFY
  i18n/
    index.ts                       # i18n setup
    uz.json                        # O'zbek tili
    ru.json                        # Русский язык
    en.json                        # English
  utils/
    cn.ts                          # clsx + tailwind-merge
    download.ts                    # File download helpers
    question-postprocess.ts        # Auto-split merged questions
```

## Features
- **File upload**: Drag-drop or click, supports .txt and .docx
- **Question preview**: Parsed questions with color-coded correct answers
- **Inline editing**: Edit question text, answers, correct answer, add/delete answers
- **Auto-scroll**: Scrolls to first error question when errors are detected
- **Format conversion**: HEMIS (.txt) and Kahoot (.xlsx) export
- **Confetti animation**: Multi-burst celebration on successful download
- **User guide**: Interactive tutorial page with animated SVG illustrations and FAQ
- **Auto-split**: Automatically splits merged questions with too many answers
- **Error boundary**: Catches crashes with user-friendly error UI
- **PWA-ready**: Works offline after first load

## Rules
- **Never modify logic files**: parser.ts, hemis-generator.ts, kahoot-generator.ts, file-reader.ts, history.ts
- **Never change existing i18n keys** — only add new ones if needed
- **Preserve fonts**: Outfit (headings) + DM Sans (body)
- **Use auto-switching glass/neo classes** — do NOT use `dark:glass` or `dark:neo-raised` as Tailwind variants
- **Accent color**: blue-500/blue-600 for interactive elements, emerald for Kahoot/success states
- **Responsive**: support 375px–1440px

## Build Notes
- Tailwind CSS is integrated via `@tailwindcss/vite` plugin (not PostCSS)
- Vite was downgraded from v8 to v7 for `@tailwindcss/vite` compatibility
- Always run `npm run build` to verify no TypeScript errors before committing

## Commands
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```
