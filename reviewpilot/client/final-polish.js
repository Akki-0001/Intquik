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

  // 1. Fix Hero Button
  content = content.replace(/bg-\\[#18181b\\] text-white/g, 'bg-[#1A1F5C] text-white');
  content = content.replace(/bg-\\[#14142B\\] text-white/g, 'bg-[#1A1F5C] text-white');

  // 2. Fix Pricing / Feature Cards
  // Any gradient backgrounds on pricing/feature cards should be white.
  // There are cards with `bg-gradient-to-b from-[#14142B] to-[#1A1F5C]` or `from-[#18181b] to-[#0f172a]`
  content = content.replace(/bg-gradient-to-b from-\\[#[0-9a-fA-F]+\\] to-\\[#[0-9a-fA-F]+\\]/g, 'bg-white');
  
  // Make all text on these cards dark
  // We need to change text-white to text-[#14142B] in these specific sections
  // It's safer to just replace 'text-white' with 'text-[#14142B]' generally on cards, 
  // but let's target specific headings
  content = content.replace(/text-white/g, 'text-[#14142B]');
  
  // Restore the text-white on our primary buttons we just set
  content = content.replace(/bg-\\[#1A1F5C\\] text-\\[#14142B\\]/g, 'bg-[#1A1F5C] text-white');

  // 3. Fix checkmarks in lists
  content = content.replace(/<Check className="[^"]*"/g, '<Check className="w-4 h-4 text-[#FF5A3C] shrink-0"');
  
  // 4. Buttons should not have visible borders
  content = content.replace(/border-2 border-slate-200/g, 'border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]');
  content = content.replace(/border border-slate-200/g, 'border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]');

  // Specific button styles for generic CTA buttons to follow rounded-full solid navy
  content = content.replace(/bg-gradient-to-r from-\\[#2361F5\\] to-\\[#d4b88e\\]/g, 'bg-[#1A1F5C]');
  content = content.replace(/bg-gradient-to-r from-\\[#3b82f6\\] to-\\[#d4b88e\\]/g, 'bg-[#1A1F5C]');
  content = content.replace(/bg-white border-none shadow-\\[0_4px_20px_rgba\\(26,31,92,0\\.08\\)\\] text-blue-900/g, 'bg-[#1A1F5C] text-white rounded-full');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Final polish applied to ${file}`);
  }
});
