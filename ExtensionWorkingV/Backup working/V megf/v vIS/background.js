chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url) return;

  const allowed = /com\/chats\/\d+$/;
  if (!allowed.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => alert("❌ This extension only works on /com/chats/[number] pages.")
    });
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});
