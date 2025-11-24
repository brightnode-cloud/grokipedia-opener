const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read the content of the HTML and JS files
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
const contentJs = fs.readFileSync(path.resolve(__dirname, '../content.js'), 'utf8');

// Create a JSDOM instance
const dom = new JSDOM(html, {
  url: "https://en.wikipedia.org/wiki/JavaScript",
  runScripts: "dangerously",
  resources: "usable"
});

// Expose the window and document objects to the global scope
global.window = dom.window;
global.document = dom.window.document;

// Run the content script in the JSDOM context
const scriptEl = document.createElement("script");
scriptEl.textContent = contentJs;
document.body.appendChild(scriptEl);

// Manually trigger the DOMContentLoaded event
document.dispatchEvent(new window.Event('DOMContentLoaded'));

// Run tests
console.log('Running tests...');

// Test 1: Banner is created
const banner = document.getElementById('grokipedia-banner');
console.assert(banner, 'Test Failed: Banner not found');
if (banner) {
    console.log('Test Passed: Banner found');
}

// Test 2: Buttons are present
const openButton = document.getElementById('grokipedia-open');
console.assert(openButton, 'Test Failed: Open button not found');
if (openButton) {
    console.log('Test Passed: Open button found');
}

const dismissButton = document.getElementById('grokipedia-dismiss');
console.assert(dismissButton, 'Test Failed: Dismiss button not found');
if (dismissButton) {
    console.log('Test Passed: Dismiss button found');
}

// Test 3: Grokipedia URL is correct
const expectedUrl = 'https://grokipedia.com/search?q=JavaScript';
let actualUrl = '';
// The URL is generated inside an event listener, so we need to simulate a click
// and override window.open to capture the URL.
window.open = (url) => {
    actualUrl = url;
};
openButton.click();
console.assert(actualUrl === expectedUrl, `Test Failed: URL is incorrect. Expected ${expectedUrl}, but got ${actualUrl}`);
if (actualUrl === expectedUrl) {
    console.log('Test Passed: Grokipedia URL is correct');
}


// Test 4: Dismiss button removes the banner
if (dismissButton) {
    // Re-create the banner since the previous test removed it
    document.body.prepend(banner);
    dismissButton.click();
    console.assert(!document.getElementById('grokipedia-banner'), 'Test Failed: Banner not dismissed');
    if (!document.getElementById('grokipedia-banner')) {
        console.log('Test Passed: Banner dismissed successfully');
    }
}


console.log('Tests finished.');
