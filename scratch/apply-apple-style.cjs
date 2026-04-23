const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/SearchResults.jsx',
  'src/pages/SuitesPage.jsx',
  'src/pages/DiningPage.jsx',
  'src/pages/SpaPage.jsx',
  'src/pages/AboutPage.jsx',
  'src/pages/LoginPage.jsx',
  'src/pages/RegisterPage.jsx'
];

files.forEach(file => {
  const fullPath = path.join('c:/Users/pc/Desktop/hotel/golden-hills', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace font-serif
    content = content.replace(/\bfont-serif\b/g, '');
    
    // Replace italic
    content = content.replace(/\bitalic\b/g, '');
    
    // Replace leading-[0.9] with leading-[1.1] to make line height look better for sans-serif
    content = content.replace(/leading-\[0\.9\]/g, 'leading-[1.1]');
    
    // Replace tracking-tighter with tracking-tight
    content = content.replace(/\btracking-tighter\b/g, 'tracking-tight');
    
    // Clean up multiple spaces in className
    content = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classNames) => {
      const cleaned = classNames.replace(/\s+/g, ' ').trim();
      return `className=${quote}${cleaned}${quote}`;
    });
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('Not found', file);
  }
});
