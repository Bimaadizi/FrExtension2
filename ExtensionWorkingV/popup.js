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
        if (id === "fr-music-box") {
<<<<<<< HEAD
          if (window.__music_cleanup) window.__music_cleanup();
          window.__fr_music_active = false;
        }
        if (id === "fr-spell-box") window.__fr_spell_active = false;
        if (id === "custom-sidebar-frame") window.__fr_sidebar_active = false;
        if (id === "journal-root") window.__journal_active = false;
=======
          if (window.__music_cleanup) window.__music_cleanup(); // optional hook
          window.__fr_music_active = false;
        }
>>>>>>> 77dcb1c7d3c69d97038e1e9bed8a2f3472d53d80
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

    document.getElementById("enableMusic").addEventListener("change", (e) => {
      toggleScript(tabId, "music.js", e.target.checked, "fr-music-box");
    });
<<<<<<< HEAD

    document.getElementById("enableSpells").addEventListener("change", (e) => {
      toggleScript(tabId, "spellOverlay.js", e.target.checked, "fr-spell-box");
    });

    document.getElementById("enableSidebar").addEventListener("change", (e) => {
      toggleScript(tabId, "Sidebar.js", e.target.checked, "custom-sidebar-frame");
    });

    document.getElementById("enableJournal").addEventListener("change", (e) => {
      toggleScript(tabId, "journal.js", e.target.checked, "journal-root");
    });

    // ✅ CORRECT: showReadme hooked up properly using the tabId from above
    document.getElementById("showReadme").addEventListener("click", () => {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["readme.js"]
      });
    });
=======
>>>>>>> 77dcb1c7d3c69d97038e1e9bed8a2f3472d53d80
  });
});
