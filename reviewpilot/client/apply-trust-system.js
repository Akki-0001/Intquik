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

  // Backgrounds
  // Hero gradient: from-[#F3F1FB] to-[#E8F1FB]
  content = content.replace(/from-\\[#[A-Fa-f0-9]+\\] to-\\[#[A-Fa-f0-9]+\\]/g, (match) => {
    if (match.includes('from-[#3b82f6]') || match.includes('from-[#2361F5]')) return match; // buttons
    return 'from-[#F3F1FB] to-[#E8F1FB]';
  });
  // Replace body/page backgrounds
  content = content.replace(/bg-\\[#FFFFFF\\]/g, 'bg-white');
  content = content.replace(/bg-white/g, 'bg-white'); // Leave white alone mostly
  
  // Replace #EAF4FC for section backgrounds alternating
  // I will just map #fafafa to #EAF4FC
  content = content.replace(/bg-\\[#fafafa\\]/gi, 'bg-[#EAF4FC]');

  // Colors mapping
  content = content.replace(/#1A1F5C/gi, '#1A1F5C'); 
  content = content.replace(/#2361F5/gi, '#2361F5');
  content = content.replace(/#3AB6F5/gi, '#3AB6F5');
  content = content.replace(/#FF5A3C/gi, '#FF5A3C');
  content = content.replace(/#14142B/gi, '#14142B');
  content = content.replace(/#5F6473/gi, '#5F6473');
  content = content.replace(/#9A9FAE/gi, '#9A9FAE');

  // Eyebrow texts
  // Current eyebrows have text-xs font-bold uppercase tracking-widest...
  content = content.replace(/text-xs font-bold text-\\[#14142B\\] uppercase tracking-widest/g, 'eyebrow');
  content = content.replace(/text-\\[10px\\] font-bold text-\\[[^\\]]+\\] uppercase tracking-widest/g, 'eyebrow');

  // Buttons
  // bg-[#1A1F5C] text-white... -> btn-primary
  content = content.replace(/bg-\\[#1A1F5C\\] text-white[^"]*rounded-full[^"]*/g, 'btn-primary');
  // other CTA buttons that we updated previously
  content = content.replace(/bg-gray-900 text-white border border-gray-900 text-sm font-extrabold px-6 py-3 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2/g, 'btn-primary flex items-center gap-2');

  // Cards
  // Any element that was a card -> trust-card
  // We can't safely replace all, but we can replace the padding/rounded corners.
  content = content.replace(/rounded-xl/g, 'rounded-[14px]');
  content = content.replace(/rounded-2xl/g, 'rounded-[14px]');
  
  // Forms
  content = content.replace(/rounded-\\[6px\\]/g, 'rounded-[8px]');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Applied SaaS Trust Blue to ${file}`);
  }
});
