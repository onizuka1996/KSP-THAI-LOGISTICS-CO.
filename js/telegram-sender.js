// ฟังก์ชันสำหรับส่งข้อมูลแบบฟอร์มสมัครงานไปยัง Telegram

// กำหนดค่า Telegram Bot Token และ Chat ID
// ต้องสร้าง Bot ใน Telegram ผ่าน BotFather และรับ Token มาใส่ที่นี่
const TELEGRAM_BOT_TOKEN = '7992354555:AAFm96-DSMUK9ayG7f92xwCIfxMcmnAF_hE'; // เปลี่ยนเป็น Token ของคุณ
const TELEGRAM_CHAT_ID = '7596659509';     // เปลี่ยนเป็น Chat ID ของคุณ

// เซิร์ฟเวอร์สำหรับส่งไฟล์ไปยัง Telegram (webhook server)
const WEBHOOK_SERVER = 'http://localhost:3000/forward-to-telegram';

// ฟังก์ชันสำหรับการส่งข้อความไปยัง Telegram
async function sendToTelegram(message) {
    try {
        console.log('กำลังส่งข้อมูลไปยัง Telegram:', message);
        console.log('Token:', TELEGRAM_BOT_TOKEN);
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
        
        // ข้อมูลที่จะส่งไปยัง Telegram
        const data = {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
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
        // แสดง alert เพื่อให้ผู้ใช้รู้ว่ามีข้อผิดพลาด
        alert(`เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Telegram: ${error.message}`);
        throw error;
    }
}

// ฟังก์ชันส่งไฟล์ไปยัง Telegram ผ่าน webhook server
async function sendFileToTelegram(file, caption) {
    try {
        // สร้าง FormData สำหรับส่งไปยัง webhook server
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', TELEGRAM_BOT_TOKEN);
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('caption', caption || '');
        
        // ส่งไปยัง webhook server
        const response = await fetch(WEBHOOK_SERVER, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            // หากไม่สามารถส่งไฟล์ได้ ให้ส่งข้อความแจ้งรายละเอียดไฟล์แทน
            const errorData = await response.json();
            console.error('ไม่สามารถส่งไฟล์ไปยัง Telegram ได้:', errorData);
            
            // สร้างข้อความแจ้งรายละเอียดไฟล์แทน
            const fileInfo = {
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
                type: file.type,
                lastModified: new Date(file.lastModified).toLocaleString('th-TH')
            };
            
            let fileMessage = `<b>ข้อมูลไฟล์:</b> ${caption}

`;
            fileMessage += `<b>ชื่อไฟล์:</b> ${fileInfo.name}
`;
            fileMessage += `<b>ขนาด:</b> ${fileInfo.size}
`;
            fileMessage += `<b>ประเภท:</b> ${fileInfo.type}
`;
            fileMessage += `<b>แก้ไขล่าสุด:</b> ${fileInfo.lastModified}

`;
            fileMessage += `<i>หมายเหตุ: ไม่สามารถส่งไฟล์ไปยัง Telegram ได้ โปรดตรวจสอบว่า webhook server กำลังทำงานหรือไม่</i>`;
            
            return sendToTelegram(fileMessage);
        }
        
        const result = await response.json();
        console.log('ส่งไฟล์ไปยัง Telegram สำเร็จ:', result);
        return result;
        
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งไฟล์ไปยัง Telegram:', error);
        
        // หากไม่สามารถส่งไฟล์ได้ ให้ส่งข้อความแจ้งรายละเอียดไฟล์แทน
        try {
            const fileInfo = {
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
                type: file.type,
                lastModified: new Date(file.lastModified).toLocaleString('th-TH')
            };
            
            let fileMessage = `<b>ข้อมูลไฟล์ (ไม่สามารถส่งไฟล์ได้):</b> ${caption}

`;
            fileMessage += `<b>ชื่อไฟล์:</b> ${fileInfo.name}
`;
            fileMessage += `<b>ขนาด:</b> ${fileInfo.size}
`;
            fileMessage += `<b>ประเภท:</b> ${fileInfo.type}
`;
            fileMessage += `<b>แก้ไขล่าสุด:</b> ${fileInfo.lastModified}

`;
            fileMessage += `<i>ข้อผิดพลาด: ${error.message}</i>`;
            
            return sendToTelegram(fileMessage);
        } catch (innerError) {
            console.error('เกิดข้อผิดพลาดซ้อน:', innerError);
            throw error; // ส่งต่อ error เดิม
        }
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
