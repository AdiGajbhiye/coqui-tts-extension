function* textGenerator() {
  const focusableElements = document.querySelectorAll(
    "[data-selectable-paragraph]"
  );
  for (let i = 0; i < focusableElements.length; i++) {
    const element = focusableElements[i];
    yield element.textContent.trim();
  }
}

const gen = textGenerator();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "getText") {
    sendResponse(gen.next());
  }
});
