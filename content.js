/**
 * content.js
 * * This script is injected directly into the Wikipedia page
 * *after* the background script detects a valid navigation.
 */

// A simple check to prevent the script from running multiple times on the same page
// (e.g., if the user navigates within the page using the History API)
if (!document.getElementById('grokipedia-banner')) {
  
  // 1. Create the banner element
  const banner = document.createElement('div');
  banner.id = 'grokipedia-banner';
  
  // 2. Generate the new Grokipedia URL
  const currentUrl = window.location.href;
  
  // *** NEW LOGIC BASED ON USER FEEDBACK ***
  // We need to extract the search term from the wiki path.
  //
  // Example:
  // https://en.wikipedia.org/wiki/JavaScript
  // We need to extract "JavaScript"
  
  let topic = "";
  let grokipediaUrl = "";
  const wikiPathParts = currentUrl.split('/wiki/');
  
  if (wikiPathParts.length > 1) {
    // This gets everything after /wiki/, e.g., "JavaScript" or "Stack_(abstract_data_type)"
    topic = wikiPathParts[1]; 
    
    // Decode URI components for topics with special characters
    topic = decodeURIComponent(topic); 

    // *** FIX: Replace underscores with spaces ***
    // Wikipedia uses underscores for spaces in URLs (e.g., "Stack_(abstract_data_type)")
    // We replace them with spaces for the search query.
    topic = topic.replace(/_/g, ' ');

    // Now construct the Grokipedia search URL
    // e.g., https://grokipedia.com/search?q=Stack (abstract data type)
    grokipediaUrl = `https://grokipedia.com/search?q=${topic}`;
  }

  // 3. Create the banner's inner content
  // Changed text to "search for this article"
  banner.innerHTML = `
    <div class="grokipedia-content">
      <span>Would you like to search for this article on <strong>Grokipedia</strong>?</span>
      <div class="grokipedia-buttons">
        <button id="grokipedia-open" class="grokipedia-btn grokipedia-btn-primary">Search on Grokipedia</button>
        <button id="grokipedia-dismiss" class="grokipedia-btn">Dismiss</button>
      </div>
    </div>
  `;
  
  // 4. Append the banner to the top of the page's body
  // Using prepend so it's the first element, but CSS will fix its position
  document.body.prepend(banner);

  // 5. Add event listeners for the buttons
  
  // Open button: Opens the new URL in a new tab and removes the banner
  document.getElementById('grokipedia-open').addEventListener('click', () => {
    // Only open if we successfully found a topic and built a URL
    if (topic && grokipediaUrl) {
      window.open(grokipediaUrl, '_blank');
    }
    banner.remove();
  });

  // Dismiss button: Just removes the banner
  document.getElementById('grokipedia-dismiss').addEventListener('click', () => {
    banner.remove();
  });
}

