# PRD — TestFormatter.uz

## 1. Mahsulot haqida qisqacha

**TestFormatter.uz** — brauzerda ishlaydigan 100% client-side veb-ilova bo'lib, test fayllarini (.txt, .docx) HEMIS (.txt) va Kahoot (.xlsx) formatlariga o'zgartiradi. Server talab qilinmaydi — barcha ishlov berish foydalanuvchining brauzerida amalga oshiriladi.

**Domen:** testformatter.uz

---

## 2. Muammo

O'zbekiston oliy ta'lim muassasalarida o'qituvchilar test savollarini turli platformalar uchun qayta formatlashga ko'p vaqt sarflaydi:

- **HEMIS** (Higher Education Management Information System) — O'zbekiston OTMlari uchun markazlashtirilgan test tizimi. Maxsus `.txt` formatida savollar yuklanishi kerak.
- **Kahoot** — interaktiv viktorina platformasi. `.xlsx` formatidagi shablonga mos bo'lishi kerak.

Har bir platformaning o'z formati bor va o'qituvchilar testlarni qo'lda qayta yozishga majbur. Bu jarayon ko'p vaqt oladi va xatolarga olib keladi.

---

## 3. Yechim

Foydalanuvchi test faylini (.txt yoki .docx) yuklaydi → ilova savollarni avtomatik ajratadi (parse qiladi) → foydalanuvchi ko'rib chiqadi → bir tugma bilan HEMIS yoki Kahoot formatida yuklab oladi.

---

## 4. Maqsadli foydalanuvchilar

| Segment | Tavsif |
|---------|--------|
| **Asosiy** | O'zbekiston OTM o'qituvchilari va laborantlari |
| **Ikkilamchi** | Test tayyorlovchi metodistlar, kafedra mudirlari |
| **Uchinchi** | Xususiy ta'lim markazlari xodimlari |

---

## 5. Foydalanuvchi oqimi (User Flow)

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│  1. YUKLASH  │ ──→ │  2. KO'RISH  │ ──→ │  3. YUKLAB     │
│  (.txt/.docx)│     │  (Preview)   │     │     OLISH      │
└─────────────┘     └──────────────┘     └────────────────┘
```

### 1-qadam: Fayl yuklash (Upload)
- Foydalanuvchi `.txt` yoki `.docx` faylni drag-and-drop yoki fayl tanlash orqali yuklaydi
- Ilova faylni o'qiydi va savollarni parse qiladi
- Xatoliklar bo'lsa, foydalanuvchiga ko'rsatiladi

### 2-qadam: Ko'rib chiqish (Preview)
- Parse qilingan savollar ro'yxati ko'rsatiladi
- Har bir savolda javoblar va to'g'ri javob belgilangan
- Foydalanuvchi natijani tekshiradi

### 3-qadam: Formatni tanlash va yuklab olish (Convert & Download)
- **HEMIS** (.txt) yoki **Kahoot** (.xlsx) formatini tanlaydi
- Tugmani bosib tayyor faylni yuklab oladi
- Konvertatsiya tarixi localStorage'da saqlanadi

---

## 6. Funksional talablar

### 6.1 Fayl yuklash
| ID | Talab | Ustuvorlik |
|----|-------|------------|
| F-01 | `.txt` fayllarni qabul qilish | P0 |
| F-02 | `.docx` fayllarni qabul qilish (mammoth orqali) | P0 |
| F-03 | Drag-and-drop yuklash | P0 |
| F-04 | Fayl tanlash dialog orqali yuklash | P0 |
| F-05 | Noto'g'ri format uchun xato xabari | P0 |
| F-06 | Yuklash jarayonida loading holati | P1 |

### 6.2 Parse qilish
| ID | Talab | Ustuvorlik |
|----|-------|------------|
| F-07 | Savol raqami, matni va javoblarni ajratish | P0 |
| F-08 | To'g'ri javobni aniqlash | P0 |
| F-09 | Parse xatolarini qator raqami bilan ko'rsatish | P0 |
| F-10 | Ko'p javobli savollarni qo'llab-quvvatlash | P0 |

### 6.3 Ko'rib chiqish (Preview)
| ID | Talab | Ustuvorlik |
|----|-------|------------|
| F-11 | Savollar ro'yxatini ko'rsatish | P0 |
| F-12 | To'g'ri javobni vizual ajratish | P0 |
| F-13 | Savollar soni va xatolar sonini ko'rsatish | P1 |

### 6.4 Konvertatsiya va yuklab olish
| ID | Talab | Ustuvorlik |
|----|-------|------------|
| F-14 | HEMIS `.txt` formatida eksport | P0 |
| F-15 | Kahoot `.xlsx` formatida eksport | P0 |
| F-16 | Faylni brauzerdan yuklab olish | P0 |
| F-17 | Muvaffaqiyatli konvertatsiya haqida bildirishnoma | P1 |

### 6.5 Tarix (History)
| ID | Talab | Ustuvorlik |
|----|-------|------------|
| F-18 | Konvertatsiya tarixini localStorage'da saqlash | P1 |
| F-19 | Tarix ro'yxatini ko'rsatish (fayl nomi, savollar soni, format, vaqt) | P1 |

### 6.6 Til va mavzu
| ID | Talab | Ustuvorlik |
|----|-------|------------|
| F-20 | O'zbek, Rus, Ingliz tillarini qo'llab-quvvatlash | P0 |
| F-21 | Tanlangan til localStorage'da saqlanish | P1 |
| F-22 | Dark / Light tema almashtirish | P1 |
| F-23 | Tanlangan tema localStorage'da saqlanish | P1 |
| F-24 | Tizim temasini avtomatik aniqlash (boshlang'ich) | P2 |

---

## 7. Nofunksional talablar

| ID | Talab | Mezon |
|----|-------|-------|
| NF-01 | **Maxfiylik** | Hech qanday ma'lumot serverga yuborilmaydi. 100% client-side |
| NF-02 | **Tezlik** | 100 ta savolni parse qilish < 1 soniya |
| NF-03 | **Responsivlik** | 375px — 1440px ekranlar uchun moslashuvchan |
| NF-04 | **Brauzer mosligi** | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |
| NF-05 | **Foydalanish qulayligi** | 3 qadamli oddiy oqim, tushunarsiz UI elementlarsiz |
| NF-06 | **Oflayn ishlash** | Internet ulanishisiz to'liq ishlash (statik hosting) |

---

## 8. Texnik arxitektura

### 8.1 Texnologiya steki
| Qatlam | Texnologiya |
|--------|-------------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| State management | Zustand |
| i18n | react-i18next |
| Animatsiyalar | Framer Motion |
| DOCX o'qish | mammoth |
| XLSX yozish | exceljs, xlsx |
| Shriftlar | Outfit (sarlavhalar) + DM Sans (asosiy matn) |

### 8.2 Dizayn tizimi
- **Uslub:** Glassmorphism + Neomorphism
- **Asosiy rang:** blue-500 / blue-600
- **Muvaffaqiyat rangi:** emerald (Kahoot / success holatlari)
- **Dark mode:** class-based (.dark) strategiya, Tailwind `@custom-variant` orqali
- **Maxsus CSS klasslari:** `.glass`, `.glass-strong`, `.neo-raised`, `.neo-inset`, `.glow-blue`, `.glow-emerald`

### 8.3 Loyiha tuzilmasi
```
src/
├── App.tsx                    # Asosiy layout va qadam logikasi
├── index.css                  # Tailwind konfiguratsiya + dizayn klasslari
├── store/app-store.ts         # Zustand global holat
├── types/index.ts             # TypeScript turlari
├── components/
│   ├── layout/                # Header, Footer
│   ├── upload/                # DropZone, FileInfo
│   ├── preview/               # QuestionCard, QuestionList
│   ├── convert/               # FormatSelector
│   ├── history/               # HistoryPanel
│   └── ui/                    # Button, Card, LanguageSwitcher, ThemeToggle, StepIndicator, Toast
├── lib/                       # Asosiy logika (O'ZGARTIRISH MUMKIN EMAS)
│   ├── parser.ts              # Test matnini parse qilish
│   ├── hemis-generator.ts     # HEMIS formati generatsiyasi
│   ├── kahoot-generator.ts    # Kahoot XLSX generatsiyasi
│   ├── file-reader.ts         # Fayl o'qish (txt/docx)
│   └── history.ts             # localStorage tarixi
├── i18n/                      # Tarjima fayllari (uz, ru, en)
└── utils/                     # Yordamchi funksiyalar (cn, download)
```

---

## 9. Ma'lumotlar modeli

### ParsedQuestion
```typescript
{
  number: number;        // Savol raqami
  text: string;          // Savol matni
  answers: ParsedAnswer[]; // Javoblar ro'yxati
}
```

### ParsedAnswer
```typescript
{
  letter: string;    // Javob harfi (A, B, C, D, ...)
  text: string;      // Javob matni
  isCorrect: boolean; // To'g'ri javobmi?
}
```

### ParseResult
```typescript
{
  questions: ParsedQuestion[]; // Parse qilingan savollar
  errors: ParseError[];        // Xatoliklar
}
```

### ConversionRecord (tarix)
```typescript
{
  id: string;
  fileName: string;
  questionCount: number;
  outputFormat: 'hemis' | 'kahoot';
  timestamp: number;
}
```

---

## 10. Chiqish formatlari

### HEMIS (.txt)
HEMIS tizimining maxsus tekst formati. `hemis-generator.ts` tomonidan generatsiya qilinadi. Har bir savol va javoblar belgilangan tartibda joylashtiriladi.

### Kahoot (.xlsx)
Kahoot platformasining import shabloniga mos Excel fayli. `kahoot-generator.ts` tomonidan exceljs/xlsx kutubxonalari yordamida yaratiladi.

---

## 11. Muvaffaqiyat mezonlari

| Metrika | Maqsad |
|---------|--------|
| Foydalanuvchi oqimini tugatish | > 90% foydalanuvchilar 3 qadamni muvaffaqiyatli tugatadi |
| Parse aniqligi | > 99% to'g'ri formatlangan test fayllarini xatosiz parse qilish |
| Sahifa yuklanish vaqti | < 2 soniya (statik hosting) |
| Lighthouse Performance | > 90 ball |
| Lighthouse Accessibility | > 90 ball |

---

## 12. Kelajakdagi imkoniyatlar (Backlog)

| ID | Xususiyat | Tavsif |
|----|-----------|--------|
| B-01 | PDF qo'llab-quvvatlash | `.pdf` fayllardan test import qilish |
| B-02 | Savollarni tahrirlash | Preview bosqichida savollarni o'zgartirish |
| B-03 | Batch konvertatsiya | Bir nechta faylni birdan konvertatsiya qilish |
| B-04 | Boshqa formatlar | Moodle XML, Anki va boshqa formatlarni qo'shish |
| B-05 | PWA rejimi | Oflayn ishlash va "Bosh ekranga qo'shish" imkoniyati |
| B-06 | Statistika | Qaysi fanlarda ko'p test yaratilgani haqida statistika |

---

## 13. Cheklovlar va taxminlar

- Faqat brauzerda ishlaydi — server yo'q, backend yo'q
- Foydalanuvchi ma'lumotlari hech qayerga yuborilmaydi
- Test fayllari muayyan formatda bo'lishi kerak (parser qo'llab-quvvatlaydigan format)
- localStorage hajmi brauzer cheklovlariga bog'liq (~5-10 MB)
- `lib/` papkasidagi logika fayllari o'zgartirilmaydi — ular mustaqil ishlab chiqilgan va sinovdan o'tgan
