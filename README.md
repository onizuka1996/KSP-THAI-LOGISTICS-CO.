# KSP Thai Logistics - Telegram Integration

## การแก้ไขปัญหาใบสมัครไม่ถูกส่งเข้าเทเลแกรม

ชุดโค้ดนี้แก้ไขปัญหาการส่งข้อมูลจากเว็บไซต์ไปยัง Telegram ที่ไม่ทำงานเนื่องจากข้อจำกัดของ CORS (Cross-Origin Resource Sharing)

### ระบบประกอบด้วย

1. **Webhook Server** - เซิร์ฟเวอร์ตัวกลางที่รับข้อมูลจากเว็บไซต์และส่งต่อไปยัง Telegram API
2. **Telegram Sender JS** - ไฟล์ JavaScript ที่ทำงานในเว็บไซต์สำหรับส่งข้อมูลผ่าน Webhook Server

## การติดตั้ง

1. ติดตั้ง Node.js และ npm (หากยังไม่ได้ติดตั้ง)
2. ติดตั้ง Dependencies ที่จำเป็น:

```bash
cd /path/to/KSP
npm install
```

## การเริ่มใช้งาน

1. **เริ่ม Webhook Server:**

```bash
npm start
```

หรือใช้โหมดพัฒนา (มีการ reload อัตโนมัติเมื่อแก้ไขโค้ด):

```bash
npm run dev
```

2. **ตรวจสอบการทำงาน:**
เข้าไปที่ URL: `http://localhost:3000` ในเบราว์เซอร์ ควรได้รับข้อความว่า `{"status":"ok","message":"Telegram Webhook Server is running"}`

## การใช้งานในการผลิต (Production)

### การติดตั้งเซิร์ฟเวอร์แบบถาวร

ควรติดตั้ง Webhook Server บนเซิร์ฟเวอร์ที่รันตลอดเวลา คุณสามารถใช้บริการเช่น:

1. **VPS/Cloud Server** - เช่น Digital Ocean, AWS, GCP, Azure
2. **Nodejs Hosting** - เช่น Heroku, Render, Railway

### การใช้ PM2 เพื่อให้เซิร์ฟเวอร์ทำงานตลอดเวลา

```bash
npm install -g pm2
pm2 start telegram-webhook-server.js --name "ksp-telegram-webhook"
pm2 save
pm2 startup
```

### การตั้งค่าสำหรับการใช้งานจริง

สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจค:

```
PORT=3000
HOST=0.0.0.0
MAX_FILE_SIZE=52428800
```

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **ไม่สามารถส่งข้อมูลไปยัง Telegram ได้**
   - ตรวจสอบว่า Webhook Server กำลังทำงานอยู่
   - ตรวจสอบว่า Telegram Bot Token ถูกต้อง
   - ตรวจสอบว่า Chat ID ถูกต้อง

2. **เว็บไซต์ไม่สามารถเชื่อมต่อกับ Webhook Server ได้**
   - ตรวจสอบว่า URL ใน `telegram-sender.js` ถูกต้อง
   - หากใช้โดเมนต่างกัน ตรวจสอบว่าได้ตั้งค่า CORS ถูกต้อง

3. **ไฟล์ไม่ถูกส่งไปยัง Telegram**
   - ตรวจสอบขนาดไฟล์ (Telegram จำกัดขนาดไฟล์ที่ 50MB)
   - ตรวจสอบว่าโฟลเดอร์ `uploads` สามารถเขียนได้

## การทดสอบการเชื่อมต่อ Telegram

ใช้ไฟล์ `debug-telegram.js` เพื่อทดสอบการเชื่อมต่อกับ Telegram API โดยตรง

## หมายเหตุเพิ่มเติม

- **ความปลอดภัย**: หากใช้ในการผลิตจริง ควรเพิ่มมาตรการรักษาความปลอดภัย เช่น API Key สำหรับการเข้าถึง Webhook
- **HTTPS**: ควรใช้ HTTPS ในการสื่อสารระหว่างเว็บไซต์กับ Webhook Server ในการใช้งานจริง
