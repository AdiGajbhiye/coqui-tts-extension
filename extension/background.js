class AudioHandler {
  isLoaded = false;
  id;
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

    this.audio.addEventListener("ended", () => {
      onEnd();
    });
  }

  start() {
    this.audio.play();
  }
}

const audioQueue = [];
let textContents;
let index;
let BUFFER_LEN = 10;

chrome.browserAction.onClicked.addListener((tab) => {
  function onEnd() {
    if (index + 1 >= textContents.length) return;
    index += 1;
    next(index);
    audioQueue[index].start();
  }

  function init() {
    chrome.tabs.sendMessage(tab.id, { command: "init" }, (data) => {
      textContents = data;

      index = 0;
      textContents.slice(0, BUFFER_LEN).forEach((element, i) => {
        audioQueue.push(new AudioHandler(element, onEnd, index === i));
      });
    });
  }

  function next(i) {
    chrome.tabs.sendMessage(tab.id, { command: "next", args: { i } });
  }

  init();
});
