chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "getElements") {
    const elements = [];
    // Find all elements on the page that should be read by the screen reader
    const focusableElements = document.querySelectorAll(
      "a[href], [tabindex]:not([tabindex='-1']), p"
    );
    for (let i = 0; i < focusableElements.length; i++) {
      const element = focusableElements[i];
      const textContent = element.textContent.trim();
      if (textContent !== "") {
        elements.push({ textContent, tagName: element.tagName });
      }
    }
    // Send the elements back to the background script
    sendResponse({ elements });
  }
});
