const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = [...walkSync('app'), ...walkSync('components')].filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Primary buttons to navy (#1A1F5C)
  content = content.replace(/bg-\\[#14142B\\] text-white/g, 'bg-[#1A1F5C] text-white border-none shadow-sm rounded-full hover:bg-[#181C4C]');
  content = content.replace(/bg-blue-900 text-white/g, 'bg-[#1A1F5C] text-white border-none shadow-sm rounded-full hover:bg-[#181C4C]');
  
  // Also, any button with rounded-xl or rounded-2xl should be rounded-full if it's a primary CTA
  // (We'll just map some generic things)
  
  // The coral orange badges
  content = content.replace(/text-\\[#FF5A3C\\] bg-white/g, 'text-white bg-[#FF5A3C] rounded-full px-2 py-0.5');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated button styles in ${file}`);
  }
});
