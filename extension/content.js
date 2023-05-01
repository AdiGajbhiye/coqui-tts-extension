let focusableElements;
let prevBg = "transparent";

function init() {
  focusableElements = document.querySelectorAll("[data-selectable-paragraph]");
  const buffer = [];
  for (let i = 0; i < focusableElements.length; i++) {
    buffer.push({
      id: i,
      textContent: focusableElements[i].textContent.trim(),
    });
  }

  highlightText(0);
  return buffer;
}

function processElement(i) {
  focusableElements[i - 1].style.backgroundColor = prevBg;
  highlightText(i);
}

function highlightText(i) {
  const element = focusableElements[i];
  prevbg = element.style.backgroundColor;
  element.style.backgroundColor = "yellow";
  element.scrollIntoView({ behavior: "smooth", block: "center" });
}

const getResult = ({ command, args }) => {
  console.log(command, args);
  if (command === "next") return processElement(args.i);
  if (command === "init") return init();
};

chrome.runtime.onMessage.addListener((message, _, sendResponse) =>
  sendResponse(getResult(message))
);
