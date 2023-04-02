chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { command: "getText" }, (response) => {
    if (response) {
      const { value: textToRead, done } = response;
      if (!done) {
        console.log(textToRead);
        const audio = new Audio();
        audio.src =
          "http://localhost:8000/?q=" + encodeURIComponent(textToRead);
        audio.play();
      }
    }
  });
});
