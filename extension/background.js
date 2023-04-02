chrome.browserAction.onClicked.addListener((tab) => {
  function handleGetText(response) {
    if (!response) return;
    const { value: textToRead, done } = response;
    if (done) return;
    console.log(textToRead);
    const audio = new Audio(
      "http://localhost:8000/?q=" + encodeURIComponent(textToRead)
    );
    audio.addEventListener("canplaythrough", () => {
      audio.play();
    });

    audio.addEventListener("ended", () => {
      sendGetTextMessage();
    });
  }

  function sendGetTextMessage() {
    chrome.tabs.sendMessage(tab.id, { command: "getText" }, handleGetText);
  }

  sendGetTextMessage();
});
