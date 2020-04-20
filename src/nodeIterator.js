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

const getEleementDescription = (rootElement) => {
  const { tagName } = rootElement;
  switch(tagName.toLowerCase()) {
    case 'a':
      return 'link';
    case 'h1':
      return 'title';
    case 'h2':
      return 'sub title';
    default:
      return '';
  }
}

const isElementShouldBeRead = (childNode, rootElement) => {
  const { tagName } = rootElement;
  const tagsShouldBeRead = ['h1', 'h2', 'a', 'button'];
  return tagsShouldBeRead.includes(tagName.toLowerCase()) && isElementInViewport(rootElement)
}

export const iterateElement = (rootElement, settings) => {
  const childNodes = rootElement.childNodes || [];
  const readOnstart = () => {
    rootElement.style.outline = '4px solid rgba(50, 132, 220, .6)';
  }
  const readOnend = () => {
    rootElement.style.outline = '';
  }

  childNodes.forEach((childNode) => {
    if (childNode.nodeType === Node.TEXT_NODE) {
      if (isElementShouldBeRead(childNode, rootElement)) {
        const textContent = childNode.textContent.trim();
        if (!textContent) return;

        const utterance = new Utterance(`${textContent}, ${getEleementDescription(rootElement)}`);
        utterance.onstart = readOnstart;
        utterance.onend = readOnend;
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        synth.speak(utterance);
      }
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      iterateElement(childNode, settings)
    }
  });
};