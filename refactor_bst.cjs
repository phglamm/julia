const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/BstScreen/BstScreen.jsx');
let content = fs.readFileSync(file, 'utf8');

// Typography
content = content.replace(/className="(.*?)text-5xl lg:text-7xl(.*?)drop-shadow-lg"/g, 'className="$1font-serif text-5xl lg:text-7xl$2"');
content = content.replace(/className="(.*?)text-2xl font-bold(.*?)text-\\[#682535\\]"/g, 'className="$1font-serif text-2xl font-bold$2text-[#682535]"');

// Filter Button
content = content.replace(/className="flex items-center gap-2 px-6 py-3 bg-\\[#682535\\] text-\\[#FFFFFF\\] rounded-full font-semibold shadow-lg"/g, 'className="flex items-center gap-2 px-6 py-3 bg-[#682535] text-[#FFFFFF] rounded-none text-sm uppercase tracking-widest font-semibold border border-transparent hover:bg-transparent hover:text-[#682535] hover:border-[#682535] transition-colors"');

// Filter Panel
content = content.replace(/bg-white rounded-3xl shadow-xl p-8/g, 'bg-white rounded-none border border-[#EAD2D8]/50 shadow-sm p-8');

// Size buttons
content = content.replace(/px-4 py-2 rounded-full font-semibold transition-all (.*?)bg-\\[#C599A6\\] text-\\[#682535\\]/g, 'px-4 py-2 rounded-none text-sm uppercase tracking-widest font-semibold transition-all border border-[#682535] $1bg-[#682535] text-[#FFFFFF]');
content = content.replace(/bg-\\[#FFFFFF\\] text-\\[#874D5F\\] hover:bg-\\[#EAD2D8\\]/g, 'bg-transparent text-[#874D5F] hover:bg-[#EAD2D8]/30 border border-[#EAD2D8]/50');

// Product Cards
content = content.replace(/bg-white rounded-3xl shadow-xl overflow-hidden/g, 'bg-white rounded-none border border-[#EAD2D8]/50 shadow-sm overflow-hidden');

// Card "Xem Chi Tiet" button
content = content.replace(/w-full py-3 rounded-full bg-gradient-to-r from-\\[#C599A6\\] to-\\[#A47784\\] text-\\[#682535\\] font-bold shadow-lg flex items-center justify-center gap-2/g, 'w-full py-3 rounded-none bg-transparent border-t border-[#EAD2D8]/50 text-[#682535] text-sm uppercase tracking-widest font-semibold hover:bg-[#682535] hover:text-[#FFFFFF] transition-colors flex items-center justify-center gap-2');

fs.writeFileSync(file, content);
console.log("BstScreen.jsx refactored successfully.");
