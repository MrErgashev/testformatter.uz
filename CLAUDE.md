# TestFormatter.uz

## Project Overview
100% client-side web app that converts test files (.txt, .docx) into HEMIS (.txt) and Kahoot (.xlsx) formats. No server — all processing happens in the browser.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build**: Vite 8
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"`, `@theme` block, `@custom-variant`)
- **State**: Zustand
- **i18n**: react-i18next (UZ, RU, EN)
- **Animations**: Framer Motion
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

## Project Structure
```
src/
  App.tsx                          # Main layout, step logic
  index.css                        # Tailwind config + glass/neo/glow classes
  store/app-store.ts               # Zustand store
  types/index.ts                   # TypeScript types
  components/
    layout/Header.tsx              # Fixed glass header with logo
    layout/Footer.tsx              # Author info footer
    upload/DropZone.tsx            # File upload with drag-drop, floating icon
    upload/FileInfo.tsx            # Uploaded file display
    preview/QuestionCard.tsx       # Single question with answers
    preview/QuestionList.tsx       # Scrollable question list
    convert/FormatSelector.tsx     # HEMIS/Kahoot picker + download
    history/HistoryPanel.tsx       # Conversion history (localStorage)
    ui/Button.tsx                  # Primary/secondary/ghost button
    ui/Card.tsx                    # Glass card wrapper
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
  i18n/index.ts                    # i18n setup + translations
  utils/cn.ts                      # clsx + tailwind-merge
  utils/download.ts                # File download helpers
```

## Rules
- **Never modify logic files**: parser.ts, hemis-generator.ts, kahoot-generator.ts, file-reader.ts, history.ts
- **Never change i18n keys** — only add new ones if needed
- **Preserve fonts**: Outfit (headings) + DM Sans (body)
- **Use auto-switching glass/neo classes** — do NOT use `dark:glass` or `dark:neo-raised` as Tailwind variants
- **Accent color**: blue-500/blue-600 for interactive elements, emerald for Kahoot/success states
- **Responsive**: support 375px–1440px

## Commands
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```
