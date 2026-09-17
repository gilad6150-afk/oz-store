const fs = require('fs');

const cleanNavPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\clean_nav.html';
let content = fs.readFileSync(cleanNavPath, 'utf8');

// Ensure whitespace-nowrap is added to nav links and nav container
content = content.replace(
    'class="hidden lg:flex items-center justify-center gap-6 xl:gap-8 font-bold text-xs xl:text-[13px] text-slate-800 flex-grow text-center"',
    'class="hidden lg:flex items-center justify-center gap-3 xl:gap-6 font-bold text-xs xl:text-[13px] text-slate-800 flex-grow text-center whitespace-nowrap"'
);

// Add whitespace-nowrap to spans inside nav links
content = content.replace(/<span>(.*?)<\/span>/g, '<span class="whitespace-nowrap">$1</span>');

fs.writeFileSync(cleanNavPath, content, 'utf8');
console.log("Updated clean_nav.html with whitespace-nowrap for single line layout!");
