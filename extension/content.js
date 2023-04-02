function* textGenerator() {
  const focusableElements = document.querySelectorAll(
    "[data-selectable-paragraph]"
  );
  for (let i = 0; i < focusableElements.length; i++) {
    const element = focusableElements[i];
    const prevBg = element.style.backgroundColor;
    element.style.backgroundColor = "yellow";
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    yield element.textContent.trim();
    element.style.backgroundColor = prevBg;
  }
}

const gen = textGenerator();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "getText") {
    sendResponse(gen.next());
  }
});
