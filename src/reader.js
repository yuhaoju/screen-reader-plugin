import { iterateElement, readElement, stopReading } from "./nodeIterator";
import { defaultSettings } from './constants';

const synth = window.speechSynthesis;

let readSettings = defaultSettings;

document.onkeydown = (e) => {
  const { keyCode, ctrlKey } = e;
  if (ctrlKey) {
    switch (keyCode) {
      case 82: // ctrl + R => read through
        readElement(document.title, document.documentElement, readSettings);
        iterateElement(document.body, readSettings);
        break;
      case 83: // ctrl + S => stop
        stopReading();
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
    });
    chrome.runtime.onMessage.addListener((settings) => {
      readSettings = settings;
    });
  }
};