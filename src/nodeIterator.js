const synth = window.speechSynthesis;
const Utterance = window.SpeechSynthesisUtterance;

const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= document.documentElement.scrollHeight &&
      rect.right <= document.documentElement.scrollWidth
  );
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
    default:
      return '';
  }
}

const isElementShouldBeRead = (childNode, rootElement) => {
  const { tagName } = rootElement;
  const tagsShouldBeRead = ['h1', 'h2', 'a', 'button', 'input'];
  return tagsShouldBeRead.includes(tagName.toLowerCase()) && isElementInViewport(rootElement)
}

export const readElement = (textContent, rootElement, settings = {}) => {
  const readOnstart = () => {
    rootElement.style.outline = '4px solid rgba(50, 132, 220, .6)';
  }
  const readOnend = () => {
    rootElement.style.outline = '';
  }
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
        if (!textContent) return;

        readElement(textContent, rootElement, settings);
      }
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      iterateElement(childNode, settings)
    }
  });
};