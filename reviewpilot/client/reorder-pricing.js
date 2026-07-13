const fs = require('fs');

const file = 'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the navbar link for pricing
content = content.replace(
  /<Link href="\/pricing" className="relative/g,
  '<Link href="#pricing" className="relative'
);
content = content.replace(
  /<Link href="\/about" className="relative/g,
  '<Link href="#how-it-works" className="relative'
);

// 2. We need to extract the three product cards, reorder them, and replace them.
// Looking at the structure:
// <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
//   {/* Product 1 — Smart AI-Review QR Kit (Best Seller) */}
//   ...
//   {/* Product 2 — AI Telecalling Agent */}
//   ...
//   {/* Product 3 — WhatsApp Chatbot */}
//   ...
// </div>

const startMarker = '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">';
const p1Marker = '{/* Product 1 — Smart AI-Review QR Kit (Best Seller) */}';
const p2Marker = '{/* Product 2 — AI Telecalling Agent */}';
const p3Marker = '{/* Product 3 — WhatsApp Chatbot */}';
const endMarker = '{/* Bottom note */}';

const startIndex = content.indexOf(p1Marker);
const p2Index = content.indexOf(p2Marker);
const p3Index = content.indexOf(p3Marker);
const endIndex = content.indexOf(endMarker);

if (startIndex > -1 && p2Index > -1 && p3Index > -1 && endIndex > -1) {
  let product1 = content.slice(startIndex, p2Index);
  let product2 = content.slice(p2Index, p3Index);
  let product3 = content.slice(p3Index, endIndex);

  // Clean up product1 (Best Seller badge)
  product1 = product1.replace(
    /className="absolute -top-3 right-6 bg-blue-900 text-slate-900 text-\[9px\] font-bold px-3\.5 py-1\.5 rounded-\[14px\] uppercase tracking-wider shadow-md z-20"/,
    'className="absolute -top-4 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20 z-20 border border-amber-300"'
  );
  
  // Make the best seller card pop more
  product1 = product1.replace(
    /className="trust-card flex flex-col justify-between relative group transition-all duration-300 mt-4 lg:mt-0"/,
    'className="trust-card flex flex-col justify-between relative group transition-all duration-300 mt-4 lg:mt-0 scale-[1.02] lg:-mt-4 lg:mb-4 border-sky-200 shadow-xl shadow-sky-500/10 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-500/20"'
  );

  // Construct new order: Product 2, Product 1, Product 3
  const beforeCards = content.slice(0, startIndex);
  const afterCards = content.slice(endIndex);

  // We need to slightly adjust the end of product 3 since there's a div wrapper for the grid.
  // Wait, the grid closing div is right before the Bottom note.
  // Actually, the grid closing div is inside product3 if we slice up to endIndex.
  // Let's verify:
  //           </div>
  // 
  //           {/* Bottom note */}
  // The </div> closes the grid.
  
  content = beforeCards + product2 + product1 + product3 + afterCards;
  
  fs.writeFileSync(file, content, 'utf8');
  console.log("Successfully reordered pricing cards and fixed navbar link.");
} else {
  console.log("Could not find all markers.");
}
