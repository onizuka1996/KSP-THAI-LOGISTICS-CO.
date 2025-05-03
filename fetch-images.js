// Script to download appropriate logistics service images

const fs = require('fs');
const https = require('https');
const path = require('path');

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'images', 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Function to download an image
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'images', filename);
        const fileStream = fs.createWriteStream(filePath);
        
        // Create backup of existing file if it exists
        if (fs.existsSync(filePath)) {
            const backupPath = `${filePath}.bak`;
            if (!fs.existsSync(backupPath)) {
                fs.copyFileSync(filePath, backupPath);
                console.log(`Backup created: ${backupPath}`);
            }
        }
        
        console.log(`Downloading ${filename} from ${url}...`);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }
            
            response.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Successfully downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            reject(err);
        });
    });
}

// Image URLs (royalty-free images from Unsplash and Pexels)
const images = [
    {
        name: 'customs.jpg',
        url: 'https://images.unsplash.com/photo-1568234928966-359c35dd8aba?w=1600&q=80',
        description: 'Customs documentation and cargo inspection image'
    },
    {
        name: 'logistics-banner.jpg',
        url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80',
        description: 'Logistics banner showing shipping containers and transport'
    }
];

// Download all images
async function downloadAllImages() {
    console.log('Starting image downloads...');
    
    for (const image of images) {
        try {
            await downloadImage(image.url, image.name);
            console.log(`Description for ${image.name}: ${image.description}`);
        } catch (error) {
            console.error(`Error downloading ${image.name}:`, error.message);
        }
    }
    
    console.log('All downloads completed!');
}

// Run the download
downloadAllImages();
