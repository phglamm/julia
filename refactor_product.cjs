const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/ProductDetailScreen/ProductDetailScreen.jsx');
let content = fs.readFileSync(file, 'utf8');

// Typography
content = content.replace(/className="(.*?)text-4xl lg:text-6xl(.*?)drop-shadow-lg"/g, 'className="$1font-serif text-4xl lg:text-6xl$2"');
content = content.replace(/className="(.*?)text-4xl mb-4 text-\\[#682535\\] font-bold"/g, 'className="$1font-serif text-4xl mb-4 text-[#682535] font-bold"');
content = content.replace(/className="text-2xl font-bold text-\\[#682535\\]/g, 'className="font-serif text-2xl font-bold text-[#682535]');

// Cards and Containers
content = content.replace(/bg-white rounded-3xl shadow-2xl/g, 'bg-white rounded-none shadow-sm border border-[#EAD2D8]/50');
content = content.replace(/bg-white rounded-3xl shadow-xl/g, 'bg-white rounded-none shadow-sm border border-[#EAD2D8]/50');
content = content.replace(/rounded-2xl/g, 'rounded-none');
content = content.replace(/rounded-xl/g, 'rounded-none');

// Button
content = content.replace(/w-full py-5 rounded-full bg-linear-to-r from-\\[#C599A6\\] to-\\[#A47784\\] text-white text-xl font-bold flex items-center justify-center gap-2 shadow-xl/g, 'w-full py-5 rounded-none bg-[#682535] text-[#FFFFFF] text-lg uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-[#874D5F] transition-colors');
content = content.replace(/px-6 py-3 bg-\\[#C599A6\\] text-white rounded-full font-bold/g, 'px-6 py-3 bg-[#682535] text-[#FFFFFF] rounded-none text-sm uppercase tracking-widest font-semibold hover:bg-[#874D5F] transition-colors');

fs.writeFileSync(file, content);
console.log("ProductDetailScreen.jsx refactored successfully.");
