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

const files = walkSync('app').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Force all hero/pricing cards to white
  content = content.replace(/bg-gradient-to-b from-\\[#14142B\\] to-\\[#1A1F5C\\]/g, 'bg-white');
  
  // 2. Button on Hero: The original was bg-[#18181b] which was replaced by bg-[#14142B] earlier. Let's find exactly that.
  content = content.replace(/bg-\\[#14142B\\] text-white hover:bg-\\[#27272a\\]/g, 'btn-primary');
  
  // 3. Fix the "Get Started" buttons in pricing cards
  content = content.replace(/className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-\\[#2361F5\\] to-\\[#d4b88e\\] text-\\[#14142B\\][^"]+"/g, 'className="btn-primary w-full mt-4"');
  content = content.replace(/className="w-full flex items-center justify-center gap-2 bg-white border-none shadow-\\[0_4px_20px_rgba\\(26,31,92,0\\.08\\)\\] text-blue-900[^"]+"/g, 'className="btn-primary w-full mt-4"');
  
  // 4. Force checkmarks to coral
  content = content.replace(/<Check className="[^"]*"/g, '<Check className="w-4 h-4 text-[#FF5A3C] shrink-0"');
  
  // 5. Force specific elements to be trust-card
  content = content.replace(/border-none shadow-\\[0_4px_20px_rgba\\(26,31,92,0\\.08\\)\\] rounded-\\[14px\\]/g, 'trust-card');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Force applied trust blue to ${file}`);
  }
});
