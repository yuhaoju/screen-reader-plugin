chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlMatches: 'https?://.+' },
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

const settings = {
  isEnabled: true,
  rate: 1,
  pitch: 1,
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('connected', request);
  sendResponse(settings);
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    // handle settings change
    const { key, value } = JSON.parse(message);
    settings[key] = value;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, settings);
      }
    });
  });
});
