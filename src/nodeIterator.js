const synth = window.speechSynthesis;
const Utterance = window.SpeechSynthesisUtterance;

const readUtterance = (utterance) => {
  synth.speak(utterance);
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
      const textContent = childNode.textContent.trim();
      if (textContent) {
        const utterance = new Utterance(`${textContent}, ${rootElement.tagName}`);
        utterance.onstart = readOnstart;
        utterance.onend = readOnend;
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        readUtterance(utterance, settings);
      }
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      iterateElement(childNode, settings)
    }
  });
};