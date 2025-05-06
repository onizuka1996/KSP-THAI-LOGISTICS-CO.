// Webhook server สำหรับส่งข้อมูลไปยัง Telegram
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// กำหนดค่าคอนฟิกจาก environment variables หรือค่าเริ่มต้น
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 50 * 1024 * 1024; // 50MB default
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');

const app = express();

// กำหนดการเก็บไฟล์ชั่วคราว
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

// ใช้ middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ระบบเก็บบันทึกการใช้งาน (Logging)
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// เส้นทางสำหรับตรวจสอบว่าเซิร์ฟเวอร์ทำงานหรือไม่
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Telegram Webhook Server is running' });
});

// เส้นทางสำหรับส่งข้อความไปยัง Telegram
app.post('/forward-to-telegram', upload.single('file'), async (req, res) => {
    try {
        // ดึงข้อมูลจาก request
        const { token, chat_id, caption } = req.body;
        const file = req.file;

        if (!token || !chat_id) {
            return res.status(400).json({ 
                success: false, 
                message: 'ต้องระบุ token และ chat_id' 
            });
        }

        console.log('ได้รับคำขอส่งไปยัง Telegram:');
        console.log('- Token:', token.substring(0, 10) + '...');
        console.log('- Chat ID:', chat_id);
        console.log('- Caption:', caption);
        console.log('- File:', file ? file.originalname : 'ไม่มีไฟล์');

        // ถ้ามีไฟล์ ให้ส่งไฟล์ไปยัง Telegram
        if (file) {
            const telegramApiUrl = `https://api.telegram.org/bot${token}/sendDocument`;
            const filePath = file.path;

            // สร้าง form data สำหรับส่งไฟล์
            const formData = new FormData();
            formData.append('chat_id', chat_id);
            formData.append('document', fs.createReadStream(filePath));
            
            if (caption) {
                formData.append('caption', caption);
            }

            // ส่งไฟล์ไปยัง Telegram
            const response = await axios.post(telegramApiUrl, formData, {
                headers: formData.getHeaders()
            });

            // ลบไฟล์หลังจากส่งเสร็จ
            fs.unlinkSync(filePath);

            console.log('ส่งไฟล์สำเร็จ:', response.data);
            return res.json({ success: true, message: 'ส่งไฟล์สำเร็จ', response: response.data });
        } else {
            // ถ้าไม่มีไฟล์ ให้ส่งข้อความปกติ
            const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
            const response = await axios.post(telegramApiUrl, {
                chat_id: chat_id,
                text: caption || 'ข้อความจาก KSP Thai Logistics Website',
                parse_mode: 'HTML'
            });

            console.log('ส่งข้อความสำเร็จ:', response.data);
            return res.json({ success: true, message: 'ส่งข้อความสำเร็จ', response: response.data });
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        return res.status(500).json({ 
            success: false, 
            message: `เกิดข้อผิดพลาด: ${error.message}`,
            error: error.response ? error.response.data : null
        });
    }
});

// จัดการเมื่อไม่พบเส้นทาง
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'ไม่พบเส้นทางที่ร้องขอ' });
});

// จัดการข้อผิดพลาดทั่วไป
app.use((err, req, res, next) => {
    console.error('เกิดข้อผิดพลาดในเซิร์ฟเวอร์:', err);
    res.status(500).json({ 
        success: false, 
        message: `เกิดข้อผิดพลาดในเซิร์ฟเวอร์: ${err.message}` 
    });
});

// เริ่มการทำงานของเซิร์ฟเวอร์
const server = app.listen(PORT, HOST, () => {
    console.log(`Telegram Webhook Server กำลังทำงานที่ http://${HOST}:${PORT}`);
});

// จัดการการปิดเซิร์ฟเวอร์อย่างสมบูรณ์
process.on('SIGTERM', () => {
    console.log('ได้รับคำสั่งปิดเซิร์ฟเวอร์ (SIGTERM)');
    server.close(() => {
        console.log('ปิดเซิร์ฟเวอร์เรียบร้อย');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('ได้รับคำสั่งปิดเซิร์ฟเวอร์ (SIGINT)');
    server.close(() => {
        console.log('ปิดเซิร์ฟเวอร์เรียบร้อย');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    console.error('เกิดข้อผิดพลาดที่ไม่ได้จัดการ:', err);
    server.close(() => {
        console.log('ปิดเซิร์ฟเวอร์เนื่องจากข้อผิดพลาดร้ายแรง');
        process.exit(1);
    });
});
