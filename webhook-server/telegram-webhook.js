/**
 * Telegram Webhook Server
 * รับไฟล์จากฟอร์มสมัครงานและส่งต่อไปยัง Telegram API
 */
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// สร้าง Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // อนุญาต Cross-Origin Requests
app.use(express.json()); // รองรับ JSON request
app.use(express.urlencoded({ extended: true })); // รองรับ form data
app.use(morgan('dev')); // สำหรับ logging requests

// โฟลเดอร์สำหรับเก็บไฟล์ชั่วคราว
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ตั้งค่า Multer สำหรับการรับไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // จำกัดขนาดไฟล์ไว้ที่ 10MB
  }
});

// ตรวจสอบ token และ chat_id
function validateTelegramCredentials(req, res, next) {
  const token = req.body.token;
  const chatId = req.body.chat_id;

  if (!token || !chatId) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุ Telegram Bot Token และ Chat ID'
    });
  }

  // ในระบบจริงคุณอาจต้องการเพิ่มการตรวจสอบที่มีความปลอดภัยมากขึ้น
  // เช่น การเปรียบเทียบกับค่าที่กำหนดไว้หรือการใช้ authentication

  next();
}

/**
 * รับไฟล์และส่งต่อไปยัง Telegram
 * POST /forward-to-telegram
 * 
 * รับ: multipart/form-data ที่มี fields:
 * - file: ไฟล์ที่จะส่งไป Telegram
 * - token: Telegram Bot Token
 * - chat_id: Chat ID ปลายทาง
 * - caption: คำอธิบายไฟล์ (optional)
 */
app.post('/forward-to-telegram', upload.single('file'), validateTelegramCredentials, async (req, res) => {
  try {
    const { token, chat_id, caption = '' } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'ไม่พบไฟล์ กรุณาอัปโหลดไฟล์'
      });
    }

    // สร้าง FormData สำหรับส่งไป Telegram
    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('caption', caption || '');

    // เลือก API endpoint ตามประเภทไฟล์
    let apiEndpoint = 'sendDocument'; // default เป็นเอกสาร
    const fileType = file.mimetype;
    
    if (fileType.startsWith('image/')) {
      apiEndpoint = 'sendPhoto';
      formData.append('photo', fs.createReadStream(file.path));
    } else {
      formData.append('document', fs.createReadStream(file.path));
    }

    // ส่งไปยัง Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${token}/${apiEndpoint}`;
    const response = await axios.post(telegramApiUrl, formData, {
      headers: formData.getHeaders()
    });

    // ลบไฟล์หลังจากส่งเสร็จ
    fs.unlinkSync(file.path);

    res.json({
      success: true,
      message: 'ส่งไฟล์ไปยัง Telegram สำเร็จ',
      telegram_response: response.data
    });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งไฟล์ไปยัง Telegram:', error);
    
    // ลบไฟล์หากเกิดข้อผิดพลาด
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งไฟล์ไปยัง Telegram',
      error: error.message
    });
  }
});

/**
 * สำหรับทดสอบว่าเซิร์ฟเวอร์ทำงานอยู่
 * GET /
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Telegram Webhook Server กำลังทำงาน',
    endpoints: {
      forward_to_telegram: {
        method: 'POST',
        url: '/forward-to-telegram',
        content_type: 'multipart/form-data',
        parameters: ['file', 'token', 'chat_id', 'caption']
      }
    }
  });
});

// เริ่มต้น server
app.listen(PORT, () => {
  console.log(`Telegram Webhook Server กำลังทำงานที่พอร์ต ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
