chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "optionData") {
    // forward price updates to chart page
    chrome.tabs.query({ url: "https://tv.dhan.co/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: "priceUpdate",
          payload: message.payload,
        });
      });
    });
  }
  return true; // keeps message channel alive for async
});
