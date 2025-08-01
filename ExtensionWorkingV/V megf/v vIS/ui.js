(function initUIViewer() {
  if (document.getElementById("ui-box")) return;

  console.log("✅ UI Module Loaded");

  const existingBox = document.getElementById("ui-box");
  if (existingBox) existingBox.remove();

  const container = document.createElement("div");
  container.id = "ui-box";
  container.style = `
    position: fixed;
    bottom: 0;
    right: 0;
    width: 520px;
    height: 680px;
    z-index: 999999;
    background: transparent;
    border: 2px solid white;
    resize: both;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `;

  const bar = document.createElement("div");
  bar.style = `
    background: #222;
    color: white;
    padding: 6px 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
  `;
  bar.innerHTML = `
    <span>🧾 Character Sheet</span>
    <div>
      <button id="close-ui" style="margin-right: 10px; background:none; color:white; border:none; cursor:pointer;">✖</button>
      <button id="refresh-ui" style="background:none; color:white; border:none; cursor:pointer;">⟳</button>
    </div>
  `;

  const iframe = document.createElement("iframe");
  iframe.id = "ui-frame";
  iframe.src = chrome.runtime.getURL("ui.html");
  iframe.style = "flex: 1; border: none; background: white;";

  container.appendChild(bar);
  container.appendChild(iframe);
  document.body.appendChild(container);

  // Close button
  document.getElementById("close-ui").addEventListener("click", () => {
    container.remove();
    window.__fr_ui_active = false;
  });

  // Refresh button
  document.getElementById("refresh-ui").addEventListener("click", () => {
    iframe.contentWindow.location.reload();
  });

  // --- Core: Find latest link and send data ---
  function parseCharacterLink(link) {
    const params = new URLSearchParams(link.split("?")[1]);
    const obj = {};
    for (const [key, value] of params.entries()) {
      obj[key.replace("-", "")] = decodeURIComponent(value);
    }
    return obj;
  }

  function findLatestLink() {
    const allParagraphs = Array.from(document.querySelectorAll("p"));
    const matches = allParagraphs.map(p => p.textContent.trim()).filter(t => t.startsWith("http://bimaadizi.github.io/F/"));
    if (!matches.length) return null;

    const latest = matches[matches.length - 1];

    const required = ["name=", "race=", "class=", "alignment=", "level=", "exp=", "hp=", "str=", "dex=", "con=", "int=", "wis=", "cha="];
    const isComplete = required.every(part => latest.includes(part));
    return isComplete ? latest : null;
  }

  function sendCharacterData() {
    const link = findLatestLink();
    if (!link) return;

    const current = localStorage.getItem("fr-character-link");
    if (link !== current) {
      console.log("🔄 Sending character data to iframe...");
      const data = parseCharacterLink(link);
      localStorage.setItem("fr-character-link", link);
      iframe.contentWindow.postMessage({ type: "character-data", payload: data }, "*");
    }
  }

  // Listen for DOM updates
  const observer = new MutationObserver(() => {
    setTimeout(sendCharacterData, 1000);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial data load
  setTimeout(sendCharacterData, 1000);
})();
