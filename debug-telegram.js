// ไฟล์สำหรับทดสอบการเชื่อมต่อกับ Telegram API

const TELEGRAM_BOT_TOKEN = '7992354555:AAFm96-DSMUK9ayG7f92xwCIfxMcmnAF_hE';
const TELEGRAM_CHAT_ID = '7596659509';

// ฟังก์ชันสำหรับส่งข้อความทดสอบไปยัง Telegram
async function testTelegramConnection() {
    try {
        console.log('ทดสอบการส่งข้อความไปยัง Telegram');
        console.log('Token:', TELEGRAM_BOT_TOKEN);
        console.log('Chat ID:', TELEGRAM_CHAT_ID);
        
        // URL สำหรับ Telegram Bot API
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        // ข้อความทดสอบ
        const testMessage = 'นี่คือข้อความทดสอบจาก KSP Thai Logistics Website';
        
        // ข้อมูลที่จะส่งไปยัง Telegram
        const data = {
            chat_id: TELEGRAM_CHAT_ID,
            text: testMessage,
            parse_mode: 'HTML'
        };
        
        // ส่งข้อมูลด้วย fetch API
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const responseData = await response.json();
        console.log('ข้อมูลตอบกลับจาก Telegram:', responseData);
        
        if (!response.ok) {
            throw new Error(`ไม่สามารถส่งข้อมูลไปยัง Telegram ได้: ${responseData.description || response.statusText}`);
        }
        
        return responseData;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Telegram:', error);
        alert(`เกิดข้อผิดพลาดในการทดสอบ Telegram: ${error.message}`);
        throw error;
    }
}

// เพิ่มปุ่มทดสอบในหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    // สร้างปุ่มทดสอบ
    const testButton = document.createElement('button');
    testButton.textContent = 'ทดสอบการเชื่อมต่อ Telegram';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '20px';
    testButton.style.right = '20px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '10px 15px';
    testButton.style.backgroundColor = '#4CAF50';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    
    // เพิ่ม event listener
    testButton.addEventListener('click', function() {
        testTelegramConnection()
            .then(result => {
                alert('การทดสอบสำเร็จ! ตรวจสอบ Console สำหรับรายละเอียดเพิ่มเติม');
            })
            .catch(error => {
                alert(`การทดสอบล้มเหลว: ${error.message}`);
            });
    });
    
    // เพิ่มปุ่มลงในหน้าเว็บ
    document.body.appendChild(testButton);
});
