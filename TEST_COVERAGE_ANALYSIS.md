# Test Qamrovi Tahlili — TestFormatter.uz

## Joriy Holat

Loyiha hozirda **hech qanday test infratuzilmasiga ega emas**:

- Test fayllari yo'q (`*.test.*`, `*.spec.*`, `__tests__/`)
- Test kutubxonalari o'rnatilmagan (Vitest, Jest, Testing Library)
- `package.json`da test skripti mavjud emas
- Test konfiguratsiya fayllari yo'q

**Test qamrovi: 0%**

---

## Tavsiya Etiladigan Test Strategiyasi

### 1-bosqich (Yuqori Ustuvorlik): `src/lib/` — Biznes Logika Testlari

Bu fayllar ilovaning asosiy yadrosi bo'lib, eng muhim testlarni talab qiladi.

#### `parser.ts` — Test Matnini Tahlil Qiluvchi

**Nima uchun muhim:** Butun ilova shu parser ustiga qurilgan. Xatolik bo'lsa, barcha eksportlar noto'g'ri chiqadi.

**Test holatlari:**

| # | Test holati | Tavsif |
|---|-----------|--------|
| 1 | Oddiy savol va javoblar | `1. Savol matni` + `a) javob`, `*b) to'g'ri javob` formatini to'g'ri parse qilishi |
| 2 | Ko'p qatorli savollar | Savol matni bir necha qatorga cho'zilganda to'g'ri birlashtirilishi |
| 3 | Yulduzcha (`*`) belgisi | To'g'ri javoblarni aniq aniqlashi |
| 4 | Kam javobli savollar | 2 tadan kam javob bo'lsa `few_answers` xatosini qaytarishi |
| 5 | To'g'ri javobi yo'q | To'g'ri javob belgilanmagan savollar uchun `no_correct` xatosi |
| 6 | Kutilmagan matn | Savol yoki javob formatiga mos kelmagan qatorlar uchun `unexpected_text` xatosi |
| 7 | Bo'sh qatorlar | Bo'sh qatorlarni e'tiborsiz qoldirishi |
| 8 | Turli ajratgichlar | `)` va `.` ajratgichlarini qo'llab-quvvatlashi (`1.` va `1)`) |
| 9 | Katta/kichik harflar | `A)` va `a)` javob harflarini bir xil ishlashi |
| 10 | Bo'sh matn | Bo'sh string berilganda xatosiz ishlashi |
| 11 | Faqat bo'sh qatorlar | Bo'sh savollar ro'yxati qaytarishi |
| 12 | Katta hajmli test | 100+ savolni to'g'ri parse qilishi |

#### `hemis-generator.ts` — HEMIS Format Generatori

**Test holatlari:**

| # | Test holati | Tavsif |
|---|-----------|--------|
| 1 | Bitta savol | `=====` ajratgichlari va `+++++` blok yakunlovchi bilan to'g'ri format |
| 2 | To'g'ri javob belgisi | To'g'ri javoblar oldida `#` belgisi qo'yilishi |
| 3 | Noto'g'ri javoblar | Oddiy javoblar `#` siz chiqishi |
| 4 | Ko'p savollar | Bir nechta savollarni ketma-ket to'g'ri formatlashi |
| 5 | Bo'sh massiv | Bo'sh savollar massivida xatosiz ishlashi |

#### `kahoot-generator.ts` — Kahoot XLSX Generatori

**Test holatlari:**

| # | Test holati | Tavsif |
|---|-----------|--------|
| 1 | XLSX yaratilishi | ExcelJS orqali to'g'ri `.xlsx` Blob qaytarishi |
| 2 | Ustun sarlavhalari | Kahoot import formatiga mos sarlavhalar |
| 3 | Savol va javoblar | Ma'lumotlar to'g'ri katakchalarga joylashishi |
| 4 | To'g'ri javob ustuni | "Correct" ustunida to'g'ri javob raqami ko'rsatilishi |
| 5 | Maxsus belgilar | Unicode va o'zbek harflari (o', g', sh) to'g'ri saqlanishi |

#### `file-reader.ts` — Fayl O'quvchi

**Test holatlari:**

| # | Test holati | Tavsif |
|---|-----------|--------|
| 1 | TXT fayllar | `.txt` fayllarni to'g'ri o'qishi |
| 2 | DOCX fayllar | Mammoth orqali `.docx` dan matn ajratishi |
| 3 | DOC fayllar | Eski formatda xato tashlashi (`DOC_NOT_SUPPORTED`) |
| 4 | Noma'lum format | Qo'llab-quvvatlanmagan format uchun `UNSUPPORTED_FORMAT` xatosi |

#### `history.ts` — Konversiya Tarixi

**Test holatlari:**

| # | Test holati | Tavsif |
|---|-----------|--------|
| 1 | Bo'sh tarix | Dastlabki holatda bo'sh massiv qaytarishi |
| 2 | Yozuv qo'shish | `addToHistory` to'g'ri yozuv yaratishi |
| 3 | 50 ta limit | 50 tadan ortiq yozuvlar kesilishi |
| 4 | Tarixni tozalash | `clearHistory` localStorage ni tozalashi |
| 5 | Buzilgan JSON | Noto'g'ri JSON da xatosiz bo'sh massiv qaytarishi |

---

### 2-bosqich (O'rta Ustuvorlik): `src/utils/` va `src/store/`

#### `cn.ts` — CSS Klass Birlashtiruvchi

| # | Test holati | Tavsif |
|---|-----------|--------|
| 1 | Oddiy klasslar | `cn('a', 'b')` → `'a b'` |
| 2 | Shartli klasslar | `cn('a', false && 'b')` → `'a'` |
| 3 | Tailwind birlashtirish | `cn('px-2', 'px-4')` → `'px-4'` (oxirgisi ustun) |

#### `app-store.ts` — Zustand Store

| # | Test holati | Tavsif |
|---|-----------|--------|
| 1 | Boshlang'ich holat | Default qiymatlar to'g'ri o'rnatilishi |
| 2 | Tema saqlash | `setTheme` localStorage ga yozishi |
| 3 | Til saqlash | `setLanguage` localStorage ga yozishi |
| 4 | Reset | `reset` funksiyasi holatni tozalashi |
| 5 | Fayl o'rnatish | `setFile` xato va success holatlarini tozalashi |

---

### 3-bosqich (Past Ustuvorlik): Komponent Testlari

#### UI Komponentlari

| Komponent | Test holatlari |
|-----------|---------------|
| `Button.tsx` | Turli variantlar (primary/secondary/ghost) to'g'ri renderlanishi, onClick ishlashi, disabled holati |
| `Card.tsx` | Children to'g'ri ko'rsatilishi, glass klassi qo'llanilishi |
| `ThemeToggle.tsx` | Tema almashishi, ikonka o'zgarishi |
| `LanguageSwitcher.tsx` | 3 ta til (UZ/RU/EN) o'rtasida almashishi |
| `StepIndicator.tsx` | Joriy qadam to'g'ri belgilanishi, tugallangan qadamlar ko'rsatilishi |
| `Toast.tsx` | Xabar ko'rsatilishi, avtomatik yopilishi |

#### Asosiy Komponentlar

| Komponent | Test holatlari |
|-----------|---------------|
| `DropZone.tsx` | Drag-and-drop ishlashi, fayl tanlash, noto'g'ri format rad etilishi |
| `QuestionCard.tsx` | Savol va javoblar to'g'ri ko'rsatilishi, to'g'ri javob belgilanishi |
| `QuestionList.tsx` | Savollar ro'yxati renderlanishi, scroll ishlashi |
| `FormatSelector.tsx` | HEMIS/Kahoot tanlash, yuklab olish tugmasi |
| `HistoryPanel.tsx` | Tarix ro'yxati, tozalash tugmasi |

---

### 4-bosqich: Integratsiya va E2E Testlari

| # | Test | Tavsif |
|---|------|--------|
| 1 | To'liq jarayon | Fayl yuklash → parse → preview → eksport |
| 2 | Xato boshqaruvi | Noto'g'ri fayl yuklanganda xabar ko'rsatilishi |
| 3 | Til almashtirish | Barcha UI elementlari tarjima qilinishi |
| 4 | Tema almashtirish | Dark/light rejim to'g'ri qo'llanilishi |
| 5 | Tarix | Konversiya tarixga saqlanishi va ko'rsatilishi |

---

## Tavsiya Etiladigan Texnologiyalar

| Vosita | Maqsad |
|--------|--------|
| **Vitest** | Unit testlar (Vite bilan eng yaxshi integratsiya) |
| **@testing-library/react** | Komponent testlari |
| **@testing-library/user-event** | Foydalanuvchi interaksiyalari |
| **jsdom** / **happy-dom** | Brauzer muhitini simulyatsiya |
| **Playwright** yoki **Cypress** | E2E testlar (keyingi bosqich) |

## O'rnatish Buyruqlari

```bash
# Vitest va Testing Library o'rnatish
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom happy-dom

# package.json ga qo'shish kerak:
# "test": "vitest",
# "test:coverage": "vitest run --coverage"
```

## Vitest Konfiguratsiya Namunasi

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
});
```

---

## Xulosa

| Ustuvorlik | Soha | Fayllar soni | Taxminiy testlar soni |
|-----------|------|-------------|----------------------|
| **Yuqori** | `src/lib/` biznes logika | 5 | ~30 |
| **O'rta** | `src/utils/` + `src/store/` | 3 | ~15 |
| **Past** | Komponentlar | 15 | ~40 |
| **Keyingi** | E2E integratsiya | — | ~5 |
| **Jami** | | **23** | **~90** |

**Birinchi qadam:** Vitest o'rnatib, `parser.ts` uchun testlarni yozishni boshlang — bu eng muhim va eng ko'p xatoga moyil fayl.
