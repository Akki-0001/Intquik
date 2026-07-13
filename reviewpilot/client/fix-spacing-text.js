const fs = require('fs');

function increaseFontAndReducePadding(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Reduce excessive vertical spacing
  content = content.replace(/py-24/g, 'py-16');
  content = content.replace(/pt-24/g, 'pt-16');
  content = content.replace(/pb-24/g, 'pb-16');
  content = content.replace(/mb-20/g, 'mb-12');
  content = content.replace(/mt-20/g, 'mt-12');

  // 2. Increase text sizes
  // Under How It Works
  content = content.replace(/text-xs text-\[\#6B6B6B\]/g, 'text-sm text-slate-600');
  content = content.replace(/text-xs md:text-sm/g, 'text-sm md:text-base');
  
  // Product details (Hardware)
  content = content.replace(/text-\[11px\]/g, 'text-sm');
  
  // Replace all text-xs that are used for body text (excluding labels/eyebrows which usually have uppercase/tracking-widest)
  // We'll just be careful. We can do targeted replacements for the pricing cards.
  content = content.replace(/text-\[10px\] text-gray-500/g, 'text-xs text-slate-500');
  content = content.replace(/text-xs text-gray-500/g, 'text-sm text-slate-600');
  content = content.replace(/text-xs text-slate-500/g, 'text-sm text-slate-600');
  content = content.replace(/text-xs text-slate-600 leading-relaxed font-semibold italic/g, 'text-sm text-slate-600 leading-relaxed font-medium italic');
  content = content.replace(/text-\[9px\]/g, 'text-[11px]');
  
  // "Collect verified reviews with absolutely zero friction." 
  content = content.replace(/className="text-slate-600 max-w-sm font-medium"/g, 'className="text-slate-600 max-w-md text-lg font-medium"');
  // Similar description under products
  content = content.replace(/className="text-gray-400 max-w-md font-medium text-sm"/g, 'className="text-slate-500 max-w-lg text-lg font-medium"');
  content = content.replace(/className="text-slate-500 max-w-md font-medium text-base"/g, 'className="text-slate-500 max-w-lg text-lg font-medium"');

  // Fix button text sizes
  content = content.replace(/text-xs py-4/g, 'text-sm py-4');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

const files = [
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/page.tsx',
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/pricing/page.tsx',
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/contact/page.tsx',
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/features/page.tsx'
];

files.forEach(increaseFontAndReducePadding);
