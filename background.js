chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { command: "getElements" }, (response) => {
    if (response) {
      // Read the elements out loud
      for (let i = 0; i < response.elements.length; i++) {
        const element = response.elements[i];
        const textToRead = `Element ${i + 1} of ${response.elements.length}. ${
          element.textContent
        } (${element.tagName})`;
        // Use text-to-speech API to read the element
        console.log(textToRead);
        chrome.tts.speak(textToRead);
      }
    }
  });
});
