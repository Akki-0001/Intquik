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

  // Replace text and bg colors
  content = content.replace(/#18181b/g, '#14142B'); // heading text/near black -> navy
  content = content.replace(/#1a202c/g, '#14142B');
  content = content.replace(/#0f172a/g, '#1A1F5C');
  content = content.replace(/#64748B/gi, '#5F6473'); // medium gray
  content = content.replace(/#475569/gi, '#5F6473');
  content = content.replace(/#94a3b8/gi, '#9A9FAE'); // muted gray
  content = content.replace(/#fafafa/gi, '#EAF4FC'); // inner pages bg
  content = content.replace(/#3b82f6/gi, '#2361F5'); // royal blue
  content = content.replace(/#25D366/gi, '#FF5A3C'); // coral orange
  content = content.replace(/slate-800/g, 'blue-900'); // map slate to deep blue
  content = content.replace(/slate-900/g, 'blue-950');
  content = content.replace(/slate-700/g, 'blue-800');
  content = content.replace(/slate-600/g, 'gray-500');
  content = content.replace(/slate-500/g, 'gray-500');
  content = content.replace(/slate-400/g, 'gray-400');
  
  // Specific tweaks
  content = content.replace(/from-\\[#fafafa\\] to-white/g, 'from-[#F3F1FB] to-[#E8F1FB]'); // Hero bg
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
