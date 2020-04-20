import { iterateElement, readElement } from "./nodeIterator";
import { defaultSettings } from './constants';

const synth = window.speechSynthesis;

let hasAutoRead = false;
let readSettings = defaultSettings;

document.onkeydown = (e) => {
  const { keyCode, ctrlKey } = e;
  if (ctrlKey) {
    switch (keyCode) {
      case 82: // ctrl + R => read through
        iterateElement(document.body, readSettings);
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

document.body.onkeyup = (e) => {
  const { keyCode } = e;
  if (keyCode === 9) { //  TAB
    const textContent = document.activeElement.innerText.trim();
    readElement(textContent, document.activeElement, readSettings);
  }
};

window.onload = () => {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ dom: document.domain }, (settings) => {
      readSettings = settings;
      if (settings.autoRead && !hasAutoRead) {
        hasAutoRead = true;
        iterateElement(document.body, readSettings);
      }
    });
    chrome.runtime.onMessage.addListener((settings) => {
      readSettings = settings;
    });
  }
};