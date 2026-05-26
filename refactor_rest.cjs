const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/CartScreen/CartScreen.jsx',
  'src/pages/AboutUsScreen/AboutUsScreen.jsx',
  'src/pages/ServicesScreen/ServicesScreen.jsx',
  'src/pages/LoginScreen/LoginScreen.jsx',
  'src/pages/RegisterScreen/RegisterScreen.jsx'
];

files.forEach(relativePath => {
  const file = path.join(__dirname, relativePath);
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Typography - Large Headings
  content = content.replace(/className="(.*?)text-5xl lg:text-7xl(.*?)drop-shadow-lg"/g, 'className="$1font-serif text-5xl lg:text-7xl$2"');
  content = content.replace(/className="(.*?)text-4xl lg:text-5xl(.*?)drop-shadow-lg"/g, 'className="$1font-serif text-4xl lg:text-5xl$2"');
  content = content.replace(/className="(.*?)text-3xl lg:text-4xl(.*?)drop-shadow-lg"/g, 'className="$1font-serif text-3xl lg:text-4xl$2"');
  content = content.replace(/className="(.*?)text-4xl lg:text-5xl(.*?)font-bold"/g, 'className="$1font-serif text-4xl lg:text-5xl$2font-bold"');
  content = content.replace(/className="(.*?)text-2xl font-bold(.*?)text-\\[#682535\\]"/g, 'className="$1font-serif text-2xl font-bold$2text-[#682535]"');

  // Cards and Containers
  content = content.replace(/bg-white rounded-3xl shadow-xl/g, 'bg-white rounded-none shadow-sm border border-[#EAD2D8]/50');
  content = content.replace(/bg-white rounded-3xl shadow-2xl/g, 'bg-white rounded-none shadow-md border border-[#EAD2D8]/50');
  content = content.replace(/rounded-3xl/g, 'rounded-none');
  content = content.replace(/rounded-2xl/g, 'rounded-none');
  content = content.replace(/rounded-xl/g, 'rounded-none');
  content = content.replace(/rounded-lg/g, 'rounded-none');
  content = content.replace(/rounded-full/g, 'rounded-none');

  // Buttons
  content = content.replace(/w-full py-4 rounded-full bg-gradient-to-r from-\\[#C599A6\\] to-\\[#A47784\\] text-white text-lg font-bold shadow-xl/g, 'w-full py-4 rounded-none bg-[#682535] text-[#FFFFFF] text-sm uppercase tracking-widest font-semibold shadow-sm hover:bg-[#874D5F] transition-colors');
  content = content.replace(/bg-linear-to-r from-\\[#C599A6\\] to-\\[#A47784\\]/g, 'bg-[#682535] hover:bg-[#874D5F] transition-colors');
  content = content.replace(/bg-gradient-to-r from-\\[#C599A6\\] to-\\[#A47784\\]/g, 'bg-[#682535] hover:bg-[#874D5F] transition-colors');

  fs.writeFileSync(file, content);
  console.log(`${relativePath} refactored successfully.`);
});
