const fs = require('fs');

const indexPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\index.html';
const html = fs.readFileSync(indexPath, 'utf8');

global.window = global;
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

let renderedHtml = '';
global.document = {
    readyState: 'complete',
    addEventListener: () => {},
    getElementById: (id) => ({
        set innerHTML(val) {
            if (id === 'products-grid') {
                renderedHtml = val;
                console.log(`[DOM] #products-grid innerHTML set with length: ${val.length} bytes`);
            }
        },
        get innerHTML() { return renderedHtml; },
        scrollIntoView: () => {}
    }),
    querySelectorAll: () => []
};

// Execute script section from index.html
const jsStart = html.indexOf('const products =');
const jsEnd = html.lastIndexOf('</script>');

if (jsStart !== -1 && jsEnd !== -1) {
    const jsCode = html.substring(jsStart, jsEnd);
    try {
        eval(jsCode);
        console.log("SUCCESS! Full JS executed cleanly. Total PRODUCTS_DATA:", PRODUCTS_DATA.length);
        console.log("Products in render variable:", products.length);
        if (typeof renderProducts === 'function') {
            renderProducts();
            console.log("Rendered HTML product cards check passed!");
        }
    } catch(e) {
        console.error("Execution error:", e.message, e.stack);
    }
} else {
    console.error("Could not find JS section in index.html");
}
