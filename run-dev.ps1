# تشغيل المشروع — يضيف Node إلى PATH ثم يشغل السيرفر
$nodePath = "C:\Program Files\nodejs"
if (Test-Path "$nodePath\node.exe") {
    $env:Path = "$nodePath;$env:Path"
    npm run dev
} else {
    Write-Host "Node.js غير موجود في: $nodePath" -ForegroundColor Red
    Write-Host "ثبّت Node من https://nodejs.org أو عدّل المسار في هذا الملف." -ForegroundColor Yellow
    pause
}
