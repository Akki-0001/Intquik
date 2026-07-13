const fs = require('fs');

const files = [
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/page.tsx',
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/features/page.tsx',
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/components/navbar.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Background colors
  content = content.replace(/bg-\[#EAF4FC\]/g, 'bg-slate-50');
  content = content.replace(/from-\[#EAF4FC\]/g, 'from-slate-50');
  content = content.replace(/bg-\[#F3F1FB\]/g, 'bg-slate-50');
  content = content.replace(/to-\[#E8F1FB\]/g, 'to-white');
  content = content.replace(/from-\[#F3F1FB\] to-\[#E8F1FB\]/g, 'from-slate-50 to-white');
  content = content.replace(/bg-gradient-to-br from-\[#14142B\] to-\[#0c1322\]/g, 'bg-white'); 
  content = content.replace(/bg-\[#070B14\]/g, 'bg-white'); 

  // Text colors
  content = content.replace(/text-\[#14142B\]/g, 'text-slate-900');
  content = content.replace(/text-\[#5F6473\]/g, 'text-slate-600');
  content = content.replace(/text-\[#9A9FAE\]/g, 'text-slate-400');
  
  // Specific old brand colors
  content = content.replace(/text-\[#1A1F5C\]/g, 'text-slate-900');
  content = content.replace(/bg-\[#1A1F5C\]/g, 'bg-slate-900');
  content = content.replace(/text-\[#2361F5\]/g, 'text-sky-500');
  content = content.replace(/bg-\[#2361F5\]/g, 'bg-sky-500');
  content = content.replace(/text-\[#FF5A3C\]/g, 'text-amber-500');
  content = content.replace(/bg-\[#FF5A3C\]/g, 'bg-amber-500');

  // Other colors like text-blue-900 to text-slate-900
  content = content.replace(/text-blue-900/g, 'text-sky-600');
  content = content.replace(/text-blue-950/g, 'text-slate-900');
  
  // Clean up old borders
  content = content.replace(/border-\[#E2DDD1\]/g, 'border-slate-200');
  content = content.replace(/border-\[#EAF4FC\]/g, 'border-slate-100');

  // Footers
  content = content.replace(/<footer className="relative bg-\[#EAF4FC\] text-\[#14142B\]/g, '<footer className="relative footer-dark');
  content = content.replace(/<footer className="border-t border-\[#E2E8F0\] bg-white py-12 px-6 text-\[#5F6473\]/g, '<footer className="relative footer-dark py-12 px-6');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Applied clean white theme to ${file}`);
  }
});
