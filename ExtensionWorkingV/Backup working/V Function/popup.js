function toggleScript(tabId, scriptFile, isEnabled, markerId) {
  if (isEnabled) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: [scriptFile]
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId },
      func: (id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
        if (id === "fr-wiki-box") window.__fr_wiki_active = false;
        if (id === "fr-ui-box") window.__fr_ui_active = false;
      },
      args: [markerId]
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    document.getElementById("enableCandlekeep").addEventListener("change", (e) => {
      toggleScript(tabId, "content.js", e.target.checked, "fr-wiki-box");
    });

    document.getElementById("enableUI").addEventListener("change", (e) => {
      toggleScript(tabId, "ui.js", e.target.checked, "fr-ui-box");
    });
  });
});
