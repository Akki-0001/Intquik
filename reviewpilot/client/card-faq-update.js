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

  // Make checkmarks red (#FF5A3C)
  content = content.replace(/Check className="[^"]*"/g, (match) => {
    // replace whatever color is in there with text-[#FF5A3C]
    return 'Check className="w-4 h-4 text-[#FF5A3C] shrink-0"';
  });

  // Make sure cards have white bg and right rounded corners
  // Wait, replacing all bg-gradient-to-b from-[#14142B] to-[#1A1F5C] with bg-white
  content = content.replace(/bg-gradient-to-b from-\\[#14142B\\] to-\\[#1A1F5C\\]/g, 'bg-white');
  // the text colors on the dark cards were white, so they need to be navy/black now
  content = content.replace(/text-white/g, 'text-[#14142B]');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated cards/checkmarks in ${file}`);
  }
});
