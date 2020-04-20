import { iterateElement } from "./nodeIterator";

const synth = window.speechSynthesis;

let hasAutoRead = false;
let readSettings = {};

document.onkeydown = ({ keyCode, ctrlKey }) => {
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

window.onload = () => {
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
};