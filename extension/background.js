class AudioHandler {
  id;
  isLoaded = false;
  audio;
  constructor({ id, textContent }, onEnd, isInit) {
    this.id = id;
    this.audio = new Audio(
      "http://localhost:8000/?q=" + encodeURIComponent(textContent)
    );

    this.audio.addEventListener("canplaythrough", () => {
      this.isLoaded = true;
      if (isInit) this.start();
    });

    this.audio.addEventListener("ended", () => onEnd(id));
  }

  start() {
    if (!this.isLoaded) {
      this.audio.addEventListener("canplaythrough", () => {
        this.audio.play();
      });
      return;
    }
    this.audio.play();
  }
}

const audioQueue = [];
let textContents;
let BUFFER_LEN = 10;

chrome.browserAction.onClicked.addListener((tab) => {
  function onEnd(prevIndex) {
    const index = prevIndex + 1;
    audioQueue.shift();
    if (index >= textContents.length) return;
    next(index);
    audioQueue[0].start();
    if (index + BUFFER_LEN >= textContents.length) return;
    audioQueue.push(
      new AudioHandler(textContents[index + BUFFER_LEN], onEnd, false)
    );
  }

  function init() {
    chrome.tabs.sendMessage(tab.id, { command: "init" }, (data) => {
      textContents = data;
      textContents.slice(0, BUFFER_LEN).forEach((element, i) => {
        audioQueue.push(new AudioHandler(element, onEnd, 0 === i));
      });
    });
  }

  function next(i) {
    chrome.tabs.sendMessage(tab.id, { command: "next", args: { i } });
  }

  init();
});
