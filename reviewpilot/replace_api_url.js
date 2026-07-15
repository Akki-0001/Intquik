const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const API_URL = 'http://localhost:5000';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(clientDir);
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace: "http://localhost:5000/something" -> `${process.env.NEXT_PUBLIC_API_URL}/something`
  // And also single quotes if any: 'http://localhost:5000/something'
  
  let newContent = content.replace(/(["'])http:\/\/localhost:5000([^"']*)["']/g, '`${process.env.NEXT_PUBLIC_API_URL}$2`');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log('Updated:', file);
  }
});

console.log(`Replaced hardcoded API URL in ${changedCount} files.`);
