const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Cart.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Backgrounds
  ['#0E0E10', '#FAFAFA'],
  ['#161618', '#FFFFFF'],
  ['#1E1E22', '#F8FAFC'],
  ['rgba(0,0,0,0.85)', 'rgba(15,23,42,0.65)'], // modal backdrop
  
  // Borders
  ['#2A2A30', '#E2E8F0'],
  
  // Text
  ['#E8E8F0', '#0F172A'],
  ['#C8C8D4', '#1E293B'],
  ['#9898A8', '#475569'],
  ['#707080', '#64748B'],
  ['#505060', '#94A3B8'],
  
  // Gradients
  ['linear-gradient(135deg, #1A1A1E, #161618)', '#FFFFFF'],
  ['linear-gradient(145deg,#1E1E22,#161618)', '#F8FAFC'],
  ['linear-gradient(135deg,#1E1E22,#161618)', '#FFFFFF'],
  
  // Reds
  ['#D42B2B', '#E31E24'],
  ['#A01E1E', '#1A2856'], // Update the gradient from red-red to red-navy or just use solid
  ['linear-gradient(135deg,#D42B2B,#A01E1E)', '#1A2856'], // Main buttons to Navy
  ['#FF7070', '#E31E24']
];

for (const [oldVal, newVal] of replacements) {
  content = content.split(oldVal).join(newVal);
}

// Special fix for the main button box shadow which might have red
content = content.replace(/boxShadow: '0 8px 24px rgba\(212,43,43,0.3\)'/g, "boxShadow: '0 4px 12px rgba(26,40,86,0.15)'");
content = content.replace(/boxShadow: '0 12px 32px rgba\(212,43,43,0.45\)'/g, "boxShadow: '0 8px 24px rgba(26,40,86,0.25)'");

fs.writeFileSync(filePath, content);
console.log('Cart.jsx styling successfully updated to light theme!');
