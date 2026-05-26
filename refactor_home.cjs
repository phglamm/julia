const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/HomeScreen/HomeScreen.jsx');
let content = fs.readFileSync(file, 'utf8');

// Typography
content = content.replace(/className="(.*?)text-5xl lg:text-7xl(.*?)drop-shadow-lg"/g, 'className="$1font-serif text-5xl lg:text-7xl$2"');
content = content.replace(/className="(.*?)text-4xl lg:text-5xl(.*?)drop-shadow-lg"/g, 'className="$1font-serif text-4xl lg:text-5xl$2"');
content = content.replace(/className="(.*?)text-2xl lg:text-3xl(.*?)drop-shadow-lg"/g, 'className="$1font-serif text-2xl lg:text-3xl$2"');
content = content.replace(/className="text-4xl lg:text-5xl/g, 'className="font-serif text-4xl lg:text-5xl');
content = content.replace(/className="text-2xl lg:text-3xl/g, 'className="font-serif text-2xl lg:text-3xl');
content = content.replace(/className="text-3xl font-bold/g, 'className="font-serif text-3xl font-bold');

// Buttons and Interactions
content = content.replace(/bg-gradient-to-r from-\\[#C599A6\\] to-\\[#A47784\\]/g, 'bg-[#682535] hover:bg-[#874D5F]');
content = content.replace(/text-\\[#FFFFFF\\] px-8 py-4 rounded-full text-lg font-bold shadow-xl/g, 'text-[#FFFFFF] px-8 py-4 rounded-none text-sm uppercase tracking-widest font-semibold border border-[#682535]');
content = content.replace(/bg-transparent text-\\[#FFFFFF\\] px-8 py-4 rounded-full text-lg font-bold border-2 border-\\[#FFFFFF\\] transition-all/g, 'bg-transparent text-[#FFFFFF] px-8 py-4 rounded-none text-sm uppercase tracking-widest font-semibold border border-[#FFFFFF] transition-all hover:bg-[#FFFFFF] hover:text-[#682535]');

// Cards and Containers
content = content.replace(/rounded-3xl/g, 'rounded-none');
content = content.replace(/rounded-full/g, 'rounded-none');
content = content.replace(/shadow-xl/g, 'shadow-sm border border-[#EAD2D8]/50');
content = content.replace(/shadow-2xl/g, 'shadow-md border border-[#EAD2D8]/50');

fs.writeFileSync(file, content);
console.log("HomeScreen.jsx refactored successfully.");
