# الحارة اليمانية | Al Hara Al Yamaniyah

A mobile-first Single Page Application for the Al Hara Al Yamaniyah neighborhood. Built with React, Vite, and Tailwind CSS. Supports Arabic RTL by default.

## Prerequisites

- [Node.js](https://nodejs.org) (v18 or later) and npm.

### إذا ظهرت رسالة "npm is not recognized" (ويندوز)

Node مثبت لكن المسار (PATH) غير مضبوط. اختر أحد الحلين:

1. **إضافة Node إلى PATH يدوياً**
   - ابحث في ويندوز عن "تعديل متغيرات البيئة" أو "Environment Variables".
   - تحت "المتغيرات الخاصة بالمستخدم" اختر `Path` ثم "تحرير".
   - أضف سطراً جديداً: `C:\Program Files\nodejs`
   - احفظ ثم **أغلق كل نوافذ PowerShell أو CMD وافتح نافذة جديدة**.

2. **تشغيل المشروع بدون تعديل PATH**
   - في PowerShell من مجلد المشروع شغّل:
     ```powershell
     $env:Path = "C:\Program Files\nodejs;" + $env:Path
     npm install
     npm run dev
     ```
   - أو انقر بزر الماوس الأيمن على `run-dev.ps1` واختر "تشغيل باستخدام PowerShell" (بعد تنفيذ `npm install` مرة واحدة كما في السطرين أعلاه).

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## الخريطة

- **بدون إعداد**: الخريطة تعمل فوراً بـ **أقمار صناعية (Esri)** وخريطة **شارع (OpenStreetMap)**. زر التبديل فوق الخريطة.
- **Mapbox (اختياري)**: للحصول على أقمار صناعية أوضح وتكبير أعلى (حتى 22):
  1. سجّل مجاناً في [Mapbox](https://account.mapbox.com/) واحصل على Access Token.
  2. انسخ `.env.example` إلى `.env` وضَع المفتاح: `VITE_MAPBOX_ACCESS_TOKEN=مفتاحك`.
  3. أعد تشغيل السيرفر. سيظهر زر "Mapbox (أقمار صناعية)" فوق الخريطة.

## لوقو الحارة (الشعار)

ضع شعار الحارة في مجلد **`public`** باسم **`hara-logo.png`** (أو استخدم `.svg` / `.webp` وغيّر الامتداد في الهيدر داخل `src/App.jsx`). يظهر الشعار بجانب اسم "الحارة اليمانية" في أعلى الصفحة. إن لم يوجد الملف، لا يظهر شيء ولا يحدث خطأ.

## الوصول إلى حائط الحارة وتعديل القائمة

- **من الواجهة**: في أعلى الصفحة يوجد رابط **"انتقل إلى حائط الحارة ↓"** — اضغطه لتمرير الصفحة إلى قسم حائط الحارة.
- **تعديل قائمة الإعلانات**: افتح الملف **`src/data/announcements.json`** وعدّل العناصر. كل إعلان يحتوي:
  - `id`: رقم أو نص فريد (مثل `"1"`, `"2"`)
  - `title`: عنوان الإعلان
  - `type`: نوع الإعلان — `prayer` (أوقات الصلاة)، `wedding` (زفاف)، `graduation` (تخرج)، `news` (أخبار)
  - `content`: نص الإعلان
  - `date`: التاريخ بصيغة `YYYY-MM-DD` (مثل `2025-02-20`)
  بعد الحفظ وتحديث الصفحة تظهر التعديلات في حائط الحارة.

## Data

- **النقاط (Markers)**: عدّل `src/data/markers.json` — كل عنصر يحتوي: `id`, `name`, `coordinates` (مصفوفة [خط العرض, خط الطول]), `description`, واختياري `whatsapp`. غيّر الأماكن والأسماء كما تريد.
- **حدود الحارة (Boundary)**: عدّل `src/data/boundary.json` — مصفوفة نقاط [خط العرض, خط الطول] تُغلَق تلقائياً لتشكيل المضلع. رتب النقاط بحيث ترسم حدود الحارة.
- **حائط الحارة**: عدّل `src/data/announcements.json` كما في الفقرة أعلاه.

## رفع المشروع على GitHub

**أنا لا أستطيع رفع الكود إلى حسابك** — الرفع يحتاج تسجيل الدخول بحسابك. اتبع الخطوات التالية من جهازك:

### 1. تثبيت Git (إن لم يكن مثبتاً)
- حمّل من [git-scm.com](https://git-scm.com/download/win) وثبّت.
- أعد فتح الطرفية بعد التثبيت.

### 2. إنشاء مستودع جديد على GitHub
- ادخل إلى [github.com](https://github.com) وسجّل الدخول.
- اضغط **New repository**.
- اختر اسم المستودع (مثل `al-hara-al-yamaniyah`) واختر **Public** ثم **Create repository**.

### 3. رفع الكود من جهازك
افتح **PowerShell** أو **Git Bash** داخل مجلد المشروع ونفّذ:

```powershell
git init
git add .
git commit -m "الحارة اليمانية - أول رفع"
git branch -M main
git remote add origin https://github.com/اسم_المستخدم/اسم_المستودع.git
git push -u origin main
```

استبدل `اسم_المستخدم` و`اسم_المستودع` بقيمك من GitHub. عند `git push` سيُطلب منك تسجيل الدخول (اسم مستخدم + Personal Access Token بدل كلمة المرور).

**ملاحظة:** ملف `.env` (مفتاح Mapbox) موجود في `.gitignore` ولن يُرفع — هذا صحيح لأسباب أمنية.

## النشر على GitHub Pages

المشروع جاهز للنشر على GitHub Pages. تم ضبط `base` في Vite ليتوافق مع عنوان المستودع (`/al-hara/`)، وتوجد ووركفلو **GitHub Actions** تبني المشروع وتنشره تلقائياً عند كل دفع إلى الفرع `main`.

### خطوات التفعيل (مرة واحدة)

1. في مستودع المشروع على GitHub: **Settings** → **Pages**.
2. تحت **Build and deployment** اختر **Source**: **GitHub Actions**.
3. احفظ الإعدادات.

بعد الدفع إلى `main`، ستعمل الـ workflow تلقائياً. عند انتهائها، الموقع سيكون متاحاً على:

- **https://khaledsulimani.github.io/al-hara/**

(استبدل `khaledsulimani` باسم مستخدمك إن كان المستودع تحت حساب آخر.)

### Mapbox على الموقع المنشور (اختياري)

البناء على GitHub لا يملك ملف `.env`، لذلك الخريطة تعمل افتراضياً بـ Esri و OpenStreetMap. لتفعيل Mapbox على النسخة المنشورة:

1. في المستودع: **Settings** → **Secrets and variables** → **Actions**.
2. أضف Secret باسم `VITE_MAPBOX_ACCESS_TOKEN` وقيمته مفتاح Mapbox الخاص بك.

الـ workflow مضبوط مسبقاً لاستخدام هذا الـ Secret عند البناء؛ بعد إضافته، أعد تشغيل الـ workflow (أو ادفع أي تعديل) وسيظهر خيار Mapbox في الموقع المنشور.
