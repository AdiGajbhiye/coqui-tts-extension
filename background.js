chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { command: "getText" }, (response) => {
    if (response) {
      const { value: textToRead, done } = response;
      if (!done) {
        console.log(textToRead);
        chrome.tts.speak(textToRead);
      }
    }
  });
});
