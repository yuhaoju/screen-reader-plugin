const synth = window.speechSynthesis;
const Utterance = window.SpeechSynthesisUtterance;

const readUtterance = (utterance) => {
  utterance.rate = 1;
  utterance.pitch = 1;
  synth.speak(utterance);
}

const iterateElement = (rootElement) => {
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
        utterance.onend = readOnend
        readUtterance(utterance);
      }
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      iterateElement(childNode)
    }
  });
};

document.onkeydown = ({ keyCode, ctrlKey }) => {
  console.log('keyCode', keyCode);
  if (ctrlKey) {
    switch (keyCode) {
      case 82: // ctrl + R => read through
        iterateElement(document.body);
        break;
      case 83: // ctrl + S => stop
        synth.cancel();
        break;
      case 80: // ctrl + P => play/pause
        synth.paused ? synth.resume() : synth.pause();
        break;
      default:
        break;
    }
  }
};
