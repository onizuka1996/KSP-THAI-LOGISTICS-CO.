// ฟังก์ชันสำหรับส่งข้อมูลแบบฟอร์มสมัครงานไปยัง Telegram

// กำหนดค่า Telegram Bot Token และ Chat ID
// ต้องสร้าง Bot ใน Telegram ผ่าน BotFather และรับ Token มาใส่ที่นี่
const TELEGRAM_BOT_TOKEN = '7992354555:AAFm96-DSMUK9ayG7f92xwCIfxMcmnAF_hE'; // เปลี่ยนเป็น Token ของคุณ
const TELEGRAM_CHAT_ID = '7596659509';     // เปลี่ยนเป็น Chat ID ของคุณ

// ฟังก์ชันสำหรับการส่งข้อความไปยัง Telegram
async function sendToTelegram(message) {
    try {
        console.log('กำลังส่งข้อมูลไปยัง Telegram:', message.substring(0, 100) + '...');
        console.log('Token:', TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');
        console.log('Chat ID:', TELEGRAM_CHAT_ID);
        
        // ตรวจสอบ token และ chat_id
        if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes('YOUR_TELEGRAM_BOT_TOKEN')) {
            throw new Error('Telegram Bot Token ไม่ถูกต้อง');
        }
        
        if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID.includes('YOUR_TELEGRAM_CHAT_ID')) {
            throw new Error('Telegram Chat ID ไม่ถูกต้อง');
        }

        // URL สำหรับ Telegram Bot API
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        console.log('กำลังส่งไปยัง URL:', telegramApiUrl);
        
        // ข้อมูลที่จะส่งไปยัง Telegram
        const data = {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        };
        
        console.log('ข้อมูลที่จะส่ง: chat_id=' + TELEGRAM_CHAT_ID + ', ความยาวข้อความ=' + message.length + ' ตัวอักษร');
        
        // ทำให้แน่ใจว่ามีการส่งข้อมูลจริงๆ
        try {
            // ส่งข้อมูลด้วย fetch API
            console.log('กำลังเริ่ม fetch ไปยัง Telegram API');
            const response = await fetch(telegramApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('ได้รับการตอบกลับ HTTP Status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Telegram API error:', errorText);
                throw new Error(`HTTP error ${response.status}: ${errorText}`);
            }
            
            const responseData = await response.json();
            console.log('ข้อมูลตอบกลับจาก Telegram:', JSON.stringify(responseData));
            
            if (!responseData.ok) {
                throw new Error(`Telegram API รายงานว่าเกิดข้อผิดพลาด: ${responseData.description}`);
            }
            
            return responseData;
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            throw new Error(`ไม่สามารถเชื่อมต่อกับ Telegram API ได้: ${fetchError.message}`);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Telegram:', error);
        // แสดง alert เพื่อให้ผู้ใช้รู้ว่ามีข้อผิดพลาด
        alert(`เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Telegram: ${error.message}`);
        throw error;
    }
}

// ฟังก์ชันส่งไฟล์ไปยัง Telegram โดยตรงผ่าน Telegram Bot API
async function sendFileToTelegram(file, caption) {
    try {
        console.log('กำลังส่งข้อมูลไฟล์ไปยัง Telegram:', file.name);
        
        // ตรวจสอบว่ามีไฟล์หรือไม่
        if (!file) {
            throw new Error('ไม่พบไฟล์');
        }
        
        // ตรวจสอบขนาดไฟล์ (Telegram มีขีดจำกัด 50MB)
        if (file.size > 50 * 1024 * 1024) {
            throw new Error('ไฟล์มีขนาดใหญ่เกินไป (มากกว่า 50MB)');
        }
        
        // เนื่องจากเบราว์เซอร์ไม่สามารถส่งไฟล์โดยตรงไปยัง Telegram API ได้ (CORS issues)
        // เราจะส่งเฉพาะข้อมูลเกี่ยวกับไฟล์ไปแทน
        const fileInfo = `
- ชื่อไฟล์: ${file.name}
- ขนาด: ${(file.size / 1024).toFixed(2)} KB
- ประเภท: ${file.type}`;
        
        // สร้างข้อความที่จะส่งไปยัง Telegram
        const message = `${caption || 'ไฟล์'}${fileInfo}

หมายเหตุ: ไฟล์จะถูกจัดเก็บในแบบฟอร์ม กรุณาติดต่อผู้สมัครเพื่อขอไฟล์`;
        
        // ส่งข้อความเกี่ยวกับไฟล์ไปแทนการส่งไฟล์จริง
        await sendToTelegram(message);
        
        console.log('ส่งข้อมูลไฟล์สำเร็จ');
        return { success: true, message: 'ส่งข้อมูลไฟล์สำเร็จ' };
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งข้อมูลไฟล์:', error);
        
        // พยายามส่งข้อความแจ้งเตือนเกี่ยวกับข้อผิดพลาดไปยัง Telegram
        try {
            if (file) {
                const errorMessage = `ไม่สามารถส่งไฟล์ ${file.name} (${(file.size / 1024).toFixed(2)} KB)

ข้อผิดพลาด: ${error.message}`;
                await sendToTelegram(errorMessage);
            }
        } catch (innerError) {
            console.error('ไม่สามารถส่งข้อความแจ้งเตือน:', innerError);
        }
        
        throw error;
    }
}

// ฟังก์ชันสำหรับรวบรวมข้อมูลจากฟอร์มและฟอร์แมตเป็นข้อความ
function formatFormData(formData) {
    // แสดงข้อมูลทั้งหมดใน console เพื่อตรวจสอบ
    console.log('ข้อมูลทั้งหมดจากฟอร์ม:', Object.fromEntries(formData.entries()));
    
    let message = '<b>🔔 มีผู้สมัครงานใหม่</b>

';
    
    // ข้อมูลพื้นฐาน
    message += `<b>ชื่อ-นามสกุล:</b> ${formData.get('fullname') || '-'}
`;
    message += `<b>อีเมล:</b> ${formData.get('email') || '-'}
`;
    message += `<b>เบอร์โทรศัพท์:</b> ${formData.get('phone') || '-'}
`;
    message += `<b>อายุ:</b> ${formData.get('age') || '-'} ปี
`;
    
    // ที่อยู่
    message += `<b>ที่อยู่:</b> ${formData.get('address') || '-'}

`;
    
    // ข้อมูลการสมัครงาน
    // ตรวจสอบทั้ง hidden field และ select field
    const jobPosition = formData.get('job_position') || formData.get('job-position') || '-';
    message += `<b>ตำแหน่งที่สมัคร:</b> ${jobPosition}
`;
    message += `<b>เวลาการทำงาน:</b> ${formData.get('work_time') || '-'}
`;
    message += `<b>วุฒิการศึกษา:</b> ${formData.get('education') || '-'}
`;
    message += `<b>ประสบการณ์ทำงาน:</b> ${formData.get('experience') || '-'}
`;
    
    // ข้อมูลเพิ่มเติม
    message += `<b>อาชีพเดิม:</b> ${formData.get('previous_job') || '-'}
`;
    message += `<b>รายได้ต่อเดือน:</b> ${formData.get('monthly_income') || '-'} บาท
`;
    message += `<b>รายได้ที่คาดหวัง:</b> ${formData.get('expected_daily_income') || '-'} บาท
`;
    message += `<b>ช่องทางติดต่อ:</b> ${formData.get('social_contact') || '-'}

`;
    
    // ความสามารถพิเศษ (เช็คทั้ง skills และ cover-letter)
    const skills = formData.get('skills') || formData.get('cover-letter') || '-';
    message += `<b>ความสามารถพิเศษ:</b>
${skills}

`;
    
    message += `<i>ส่งเมื่อ: ${new Date().toLocaleString('th-TH')}</i>`;
    
    return message;
}

// เมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    // หาแบบฟอร์มสมัครงาน
    const jobApplicationForm = document.getElementById('job-application-form');
    
    // เพิ่ม event listener สำหรับการ submit ฟอร์ม
    if (jobApplicationForm) {
        jobApplicationForm.addEventListener('submit', function(event) {
            // ป้องกันการ submit แบบปกติ
            event.preventDefault();
            
            // รวบรวมข้อมูลจากฟอร์ม
            const formData = new FormData(jobApplicationForm);
            
            // สร้างข้อความที่จะส่งไปยัง Telegram
            const message = formatFormData(formData);
            
            // ตรวจสอบว่ามีการกำหนด Token และ Chat ID หรือไม่
            if (TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN' || TELEGRAM_CHAT_ID === 'YOUR_TELEGRAM_CHAT_ID') {
                alert('กรุณากำหนดค่า TELEGRAM_BOT_TOKEN และ TELEGRAM_CHAT_ID ในไฟล์ telegram-sender.js');
                console.error('ไม่ได้กำหนดค่า Telegram Bot Token หรือ Chat ID');
                return;
            }
            
            // แสดง Loading
            const submitBtn = document.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'กำลังส่งข้อมูล...';
            
            // ส่งข้อมูลไปยัง Telegram
            sendToTelegram(message)
                .then(async response => {
                    console.log('ส่งข้อมูลไปยัง Telegram สำเร็จ:', response);
                    
                    // ส่งไฟล์รูปภาพ (ถ้ามี)
                    const photoInput = document.getElementById('photo');
                    if (photoInput && photoInput.files && photoInput.files.length > 0) {
                        try {
                            const photoFile = photoInput.files[0];
                            await sendFileToTelegram(photoFile, 'รูปถ่ายของผู้สมัคร: ' + formData.get('fullname'));
                            console.log('ส่งรูปภาพสำเร็จ');
                        } catch (error) {
                            console.error('ไม่สามารถส่งรูปภาพได้:', error);
                        }
                    }
                    
                    // ส่งไฟล์เรซูเม่ (ถ้ามี)
                    const resumeInput = document.getElementById('resume');
                    if (resumeInput && resumeInput.files && resumeInput.files.length > 0) {
                        try {
                            const resumeFile = resumeInput.files[0];
                            await sendFileToTelegram(resumeFile, 'เรซูเม่ของผู้สมัคร: ' + formData.get('fullname'));
                            console.log('ส่งเรซูเม่สำเร็จ');
                        } catch (error) {
                            console.error('ไม่สามารถส่งเรซูเม่ได้:', error);
                        }
                    }
                    
                    // แสดงข้อความสำเร็จ
                    alert('ส่งใบสมัครงานสำเร็จ! ข้อมูลของคุณได้ถูกส่งไปยังทีมรับสมัครของเราเรียบร้อยแล้ว เราจะติดต่อกลับภายใน 3 วันทำการ');
                    
                    // รีเซ็ตฟอร์ม
                    jobApplicationForm.reset();
                })
                .catch(error => {
                    console.error('เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Telegram:', error);
                    
                    // บันทึกข้อมูลลงไฟล์สำรองแม้ว่าส่งไปยัง Telegram จะล้มเหลว
                    try {
                        // สร้างข้อมูล JSON จาก FormData
                        const formDataObj = {};
                        formData.forEach((value, key) => {
                            formDataObj[key] = value;
                        });
                        
                        // เพิ่มข้อมูลเกี่ยวกับเวลาที่ส่ง
                        formDataObj.timestamp = new Date().toISOString();
                        formDataObj.errorInfo = error.message;
                        
                        // สร้างข้อความสำหรับบันทึก
                        const logEntry = JSON.stringify(formDataObj, null, 2);
                        console.log('สร้างล็อกสำรอง:', logEntry);
                        
                        // บันทึกข้อมูลใน localStorage เพื่อเป็นสำรอง
                        const backupKey = 'application_backup_' + new Date().getTime();
                        localStorage.setItem(backupKey, logEntry);
                        console.log('บันทึกข้อมูลสำรองเรียบร้อยแล้ว - ' + backupKey);
                    } catch (backupError) {
                        console.error('ไม่สามารถบันทึกข้อมูลสำรอง:', backupError);
                    }
                    
                    // แสดงข้อความผิดพลาดแต่บอกว่าข้อมูลถูกบันทึกแล้ว
                    alert('ข้อมูลของคุณถูกบันทึกไว้แล้ว แต่พบปัญหาในการส่งไปยังทีมงาน กรุณาติดต่อเบอร์โทร 02-778-6522 เพื่อแจ้งว่าคุณได้ส่งใบสมัครแล้วแต่มีข้อผิดพลาดทางเทคนิค');
                })
                .finally(() => {
                    // คืนค่าปุ่มกลับเป็นปกติ
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }
    
    // เพิ่มความสามารถในการเลือกตำแหน่งงานจากการกดปุ่มสมัครในหน้ารายการตำแหน่งงาน
    const jobApplyButtons = document.querySelectorAll('.job-apply-btn');
    
    jobApplyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // รับชื่อตำแหน่งงานจาก data attribute
            const jobTitle = this.getAttribute('data-job');
            
            // เลื่อนไปยังแบบฟอร์มสมัครงาน
            const applicationForm = document.getElementById('application-form');
            applicationForm.scrollIntoView({ behavior: 'smooth' });
            
            // ใส่ค่าตำแหน่งงานในฟิลด์ที่ซ่อนอยู่
            const jobPositionField = document.getElementById('job-position');
            if (jobPositionField) {
                jobPositionField.value = jobTitle;
            }
            
            // เลือกตำแหน่งงานในช่อง dropdown (ถ้ามี)
            const jobPositionDropdown = document.getElementById('job_position');
            if (jobPositionDropdown) {
                Array.from(jobPositionDropdown.options).forEach(option => {
                    if (option.value === jobTitle || option.text === jobTitle) {
                        jobPositionDropdown.value = option.value;
                    }
                });
            }
        });
    });
});
