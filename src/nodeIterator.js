const synth = window.speechSynthesis;
const Utterance = window.SpeechSynthesisUtterance;

const isElementVisible = (element) => {
  // check position
  const rect = element.getBoundingClientRect();
  const isElementInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= document.documentElement.scrollHeight &&
      rect.right <= document.documentElement.scrollWidth
  );
  if (!isElementInViewport) return false;

  // check css styles
  const { display, visibility, opacity } = getComputedStyle(element);
  if (display === 'none') return false;
  if (visibility === 'hidden') return false;
  if (opacity === 0) return false;
  if (rect.width === 0 || rect.height === 0) return false;

  return true;
}

const getElementDescription = (rootElement) => {
  const { tagName } = rootElement;
  switch(tagName.toLowerCase()) {
    case 'a':
      return 'link';
    case 'h1':
      return 'title';
    case 'h2':
      return 'sub title';
    case 'input':
      return `${rootElement.type}, ${rootElement.placeholder}`;
    case 'button':
      return 'button';
    default:
      return '';
  }
}

const isElementShouldBeRead = (childNode, rootElement) => {
  const { tagName } = rootElement;
  const tagsShouldBeRead = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'input'];
  return tagsShouldBeRead.includes(tagName.toLowerCase()) && isElementVisible(rootElement)
}

const updateSettings = (callback) => {
  if (chrome.runtime) {
    chrome.runtime.sendMessage({ dom: document.domain }, (settings) => callback(settings));
  } else {
    callback();
  }
}

const readerQueue = [];

export const stopReading = () => {
  synth.cancel();
  readerQueue.length = 0;
}

const readyToRead = (textContent, rootElement, settings) => {
  if (readerQueue.length === 0 && !synth.speaking) {
    readElement(textContent, rootElement, settings);
  } else {
    readerQueue.push({
      textContent,
      rootElement,
    });
  }
}

export const readElement = (textContent, rootElement, settings = {}) => {
  const readOnstart = () => {
    console.log('[DEBUG] current element: ', rootElement);

    const { y } = rootElement.getBoundingClientRect();
    window.scrollTo({
      top: y + window.scrollY - (document.documentElement.clientHeight / 2),
      left: 0,
      behavior: 'smooth'
    });
    rootElement.style.outline = '4px solid rgba(50, 132, 220, .6)';
  };

  const readOnend = () => {
    rootElement.style.outline = '';

    updateSettings((updatedSettings) => {
      if (updatedSettings && !updatedSettings.isEnabled) {
        return stopReading();
      }

      if (readerQueue.length > 0) {
        const { textContent, rootElement } = readerQueue.shift();
        readElement(textContent, rootElement, updatedSettings || settings);
      }
    });
  };

  const utterance = new Utterance(`${textContent}, ${getElementDescription(rootElement)}`);
  utterance.onstart = readOnstart;
  utterance.onend = readOnend;
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  synth.speak(utterance);
};

export const iterateElement = (rootElement, settings) => {
  const childNodes = rootElement.childNodes || [];
  childNodes.forEach((childNode) => {
    if (childNode.nodeType === Node.TEXT_NODE) {
      if (isElementShouldBeRead(childNode, rootElement)) {
        const textContent = childNode.textContent.trim();
        if (textContent) readyToRead(textContent, rootElement, settings);
      }
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      switch (childNode.tagName) {
        case 'INPUT':
          if (childNode.type === 'search') readyToRead('input', childNode, settings);
          break;
        case 'BUTTON':
          if (childNode.innerText.trim().length > 0) readyToRead(childNode.innerText, childNode, settings);
          break;
        default:
          iterateElement(childNode, settings);
          break;
      }
    }
  });
};