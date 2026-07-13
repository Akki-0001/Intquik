const fs = require('fs');

function makeTextMoreVisible(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Make text darker and larger
  content = content.replace(/text-sm text-slate-600/g, 'text-base text-slate-800');
  content = content.replace(/text-sm md:text-base/g, 'text-base md:text-lg');
  
  // Make smaller text larger
  content = content.replace(/text-xs text-slate-500/g, 'text-sm text-slate-700');
  content = content.replace(/text-xs text-slate-600/g, 'text-sm text-slate-800');
  
  // For standard paragraphs that just have text-slate-600
  content = content.replace(/text-slate-600 font-semibold/g, 'text-slate-700 font-semibold');
  content = content.replace(/text-slate-600 max-w-md/g, 'text-slate-700 max-w-md');
  content = content.replace(/text-slate-500 max-w-lg/g, 'text-slate-700 max-w-lg');
  
  // Explicit pixel sizes
  content = content.replace(/text-\[11px\] text-slate-600/g, 'text-sm text-slate-700');
  content = content.replace(/text-\[11px\] font-extrabold/g, 'text-sm font-extrabold');
  
  // Footer bg - if it's inline anywhere
  content = content.replace(/bg-\[\#0F172A\]/g, 'bg-slate-800');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

const files = [
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/page.tsx',
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/pricing/page.tsx',
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/contact/page.tsx',
  'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/features/page.tsx'
];

files.forEach(makeTextMoreVisible);
