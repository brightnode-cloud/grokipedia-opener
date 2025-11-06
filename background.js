/**
 * background.js
 * * This is the service worker for the extension.
 * Its main job is to listen for navigation events.
 */

// Listen for when a navigation is completed
chrome.webNavigation.onCompleted.addListener((details) => {
  
  // We only care about the main frame (not iframes inside the page)
  if (details.frameId === 0) {
    
    // Inject the CSS file to style our banner
    chrome.scripting.insertCSS({
      target: { tabId: details.tabId },
      files: ["style.css"]
    });

    // Inject the content script that will create and manage the banner
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["content.js"]
    });
  }
}, {
  // This filter ensures the listener only runs for URLs that:
  // 1. Contain ".wikipedia.org" in the host (catches en.wikipedia.org, de.wikipedia.org, etc.)
  // 2. Have a path that starts with "/wiki/" (which is where articles live)
  url: [
    { hostContains: ".wikipedia.org", pathPrefix: "/wiki/" }
  ]
});
