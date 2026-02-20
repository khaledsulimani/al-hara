# رفع المشروع إلى GitHub — خطوة بخطوة

المستودع عندك اسمه **al hara**. نفّذ الأوامر التالية **بالترتيب** في **PowerShell** أو **Git Bash** من داخل مجلد المشروع.

---

## 0. إذا ظهرت رسالة "git is not recognized"

**في نفس نافذة PowerShell** اكتب هذا السطر **مرة واحدة** ثم نفّذ بقية الأوامر:

```powershell
$env:Path = "C:\Program Files\Git\cmd;" + $env:Path
```

إذا كان Git مثبتاً في مكان آخر، جرّب:
```powershell
$env:Path = "C:\Program Files (x86)\Git\cmd;" + $env:Path
```

بعدها جرّب: `git --version` — إذا ظهر رقم الإصدار، أكمل من الخطوة 2.

**حل دائم:** مثل Node، أضف مسار Git إلى متغير البيئة Path (Environment Variables → Path → New → `C:\Program Files\Git\cmd`) ثم أعد فتح الطرفية.

---

## 1. افتح الطرفية في مجلد المشروع

- في Cursor: Terminal → New Terminal (أو اضغط Ctrl+`)
- أو من خارج Cursor: انقر بزر الماوس الأيمن على مجلد المشروع واختر "Open in Terminal" أو "Git Bash Here"

---

## 2. نفّذ الأوامر بالترتيب

**استبدل `YOUR_USERNAME`** باسم المستخدم الحقيقي في GitHub (مثلاً إذا الرابط كان `github.com/khaled2024` فاستخدم `khaled2024`).

```powershell
git init
```

```powershell
git add .
```

```powershell
git commit -m "الحارة اليمانية - أول رفع"
```

```powershell
git branch -M main
```

```powershell
git remote add origin https://github.com/YOUR_USERNAME/al-hara.git
```

```powershell
git push -u origin main
```

---

## ملاحظات

- إذا كان اسم المستودع في GitHub فيه مسافة (مثل "al hara")، الرابط عادة يصير: `https://github.com/YOUR_USERNAME/al-hara.git` (المسافة تصير `-`). تأكد من الرابط من صفحة المستودع على GitHub (زر **Code** → انسخ الرابط).
- عند `git push` قد يطلب منك تسجيل الدخول. استخدم **Personal Access Token** بدل كلمة المرور (من GitHub: Settings → Developer settings → Personal access tokens).
- ملف `.env` **لن يُرفع** (موجود في .gitignore) — وهذا صحيح لأسباب أمنية.
