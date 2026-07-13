const fs = require('fs');

function enhancePageTxs() {
  const file = 'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/page.tsx';
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Hero gradient upgrade
  content = content.replace(
    /from-sky-600 to-sky-400/g,
    'from-sky-500 via-blue-500 to-sky-400 drop-shadow-sm'
  );

  // Stats text
  content = content.replace(
    /text-2xl font-bold text-slate-900 mb-1/g,
    'text-3xl font-extrabold text-slate-900 mb-1 tracking-tight'
  );

  // Features Summary Section
  content = content.replace(
    /<h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mb-6">/g,
    '<h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">'
  );
  content = content.replace(
    /Scale Your Business <span className="text-sky-500">Automatically<\/span>/g,
    'Scale Your Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Automatically</span>'
  );

  // Wrapping icons in background for trust cards in features summary
  content = content.replace(
    /<QrCode className="w-10 h-10 text-sky-500 mb-6" \/>/g,
    '<div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center mb-6 shadow-sm"><QrCode className="w-7 h-7 text-sky-600" /></div>'
  );
  content = content.replace(
    /<Headphones className="w-10 h-10 text-sky-500 mb-6" \/>/g,
    '<div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center mb-6 shadow-sm"><Headphones className="w-7 h-7 text-sky-600" /></div>'
  );
  content = content.replace(
    /<MessageCircle className="w-10 h-10 text-sky-500 mb-6" \/>/g,
    '<div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center mb-6 shadow-sm"><MessageCircle className="w-7 h-7 text-sky-600" /></div>'
  );

  // Pricing header
  content = content.replace(
    /<h2 className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight font-bold tracking-tight leading-tight text-slate-900 mb-6">/g,
    '<h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-tight font-extrabold leading-tight text-slate-900 mb-6">'
  );

  // Button upgrades
  content = content.replace(
    /className="btn-primary inline-flex"/g,
    'className="btn-primary inline-flex shadow-lg hover:shadow-sky-500/25"'
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Enhanced ${file}`);
  }
}

function enhanceFeaturesTxs() {
  const file = 'c:/Users/ay946/OneDrive/Desktop/ReviewPilot/reviewpilot/client/app/features/page.tsx';
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Header
  content = content.replace(
    /Everything You Need to <br \/>\s*<span className="text-sky-500">Scale Automatically<\/span>/g,
    'Everything You Need to <br />\n            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 drop-shadow-sm">Scale Automatically</span>'
  );

  content = content.replace(
    /className="text-4xl md:text-6xl font-heading text-slate-900 font-bold tracking-tight"/g,
    'className="text-5xl md:text-7xl font-heading text-slate-900 font-extrabold tracking-tighter leading-tight"'
  );

  // Section Headers
  content = content.replace(
    /<h2 className="text-3xl font-heading text-slate-900 font-bold mb-4">/g,
    '<h2 className="text-4xl font-heading text-slate-900 font-extrabold tracking-tight mb-4">'
  );

  // Icons wrapper
  // We have multiple icons: QrCode, Search, KeyRound, MessageSquare, Award, Smartphone, Headphones, CalendarCheck, Filter, Languages, Globe, BarChart3, Zap, MessageCircle, Sparkles, CreditCard, Bot
  const icons = ['QrCode', 'Search', 'KeyRound', 'MessageSquare', 'Award', 'Smartphone', 'Headphones', 'CalendarCheck', 'Filter', 'Languages', 'Globe', 'BarChart3', 'Zap', 'MessageCircle', 'Sparkles', 'CreditCard', 'Bot'];
  
  icons.forEach(icon => {
    const regex = new RegExp(`<${icon} className="w-8 h-8 text-sky-500 mb-4" \/>`, 'g');
    content = content.replace(
      regex,
      `<div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><${icon} className="w-6 h-6 text-sky-600" /></div>`
    );
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Enhanced ${file}`);
  }
}

enhancePageTxs();
enhanceFeaturesTxs();
