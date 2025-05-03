// Script to add fix-encoding.css to all HTML files
const fs = require('fs');
const path = require('path');

// Get list of all HTML files
const htmlFiles = [
  'about.html',
  'careers.html',
  'contact.html',
  'employee.html',
  'index.html',
  'services.html'
];

// Function to add fix-encoding.css link to each file
function addEncodingFix(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if fix-encoding.css is already included
    if (content.includes('fix-encoding.css')) {
      console.log(`${filePath} already has encoding fix`);
      return;
    }
    
    // Add fix-encoding.css after style.css
    content = content.replace(
      '<link rel="stylesheet" href="css/style.css">',
      '<link rel="stylesheet" href="css/style.css">\n    <link rel="stylesheet" href="css/fix-encoding.css">'
    );
    
    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Applied encoding fix to ${filePath}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

// Process each HTML file
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  addEncodingFix(filePath);
});

console.log('Encoding fix applied to all HTML files');
