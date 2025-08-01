(function initUIViewer() {
  if (window.location.href.includes("ui.html")) return;
  if (document.getElementById("ui-box")) return;

  console.log("✅ UI Viewer Initialized");

  const container = document.createElement("div");
  container.id = "ui-box";
  container.style = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 500px;
    height: 600px;
    background: black;
    border: 2px solid white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 2147483647;
    box-shadow: 0 0 15px rgba(255,255,255,0.3);
  `;

  const bar = document.createElement("div");
  bar.style = `
    background: #333;
    color: white;
    padding: 5px 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
  `;
  bar.innerHTML = `
    <span>📘 UI Viewer</span>
    <div>
      <button id="ui-refresh" style="margin-right: 8px;">⟳</button>
      <button id="ui-close">✖</button>
    </div>
  `;

  const iframe = document.createElement("iframe");
  iframe.id = "ui-frame";
  iframe.src = chrome.runtime.getURL("ui.html");
  iframe.style = "flex: 1; border: none; width: 100%; height: 100%;";

  const resizeHandle = document.createElement("div");
  resizeHandle.style = `
    width: 16px;
    height: 16px;
    background: #666;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: nwse-resize;
    z-index: 2147483648;
  `;

  container.appendChild(bar);
  container.appendChild(iframe);
  container.appendChild(resizeHandle);
  document.body.appendChild(container);

  document.getElementById("ui-close").addEventListener("click", () => {
    container.remove();
    window.__fr_ui_active = false;
  });

  document.getElementById("ui-refresh").addEventListener("click", () => {
    iframe.contentWindow.postMessage({ request: "characterData" }, "*");
  });

  let isDragging = false;
  let offsetX = 0, offsetY = 0;
  bar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    container.style.left = `${e.clientX - offsetX}px`;
    container.style.top = `${e.clientY - offsetY}px`;
    container.style.right = "auto";
    container.style.bottom = "auto";
    container.style.position = "fixed";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });

  let isResizing = false;
  resizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isResizing = true;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const rect = container.getBoundingClientRect();
    container.style.width = `${e.clientX - rect.left}px`;
    container.style.height = `${e.clientY - rect.top}px`;
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
    document.body.style.userSelect = "";
  });

  function findLatestCharacterLink() {
    const paragraphs = Array.from(document.querySelectorAll("p"));
    const validLinks = paragraphs
      .map(p => p.textContent.trim())
      .filter(t => t.startsWith("http://bimaadizi.github.io/F/"));

    if (!validLinks.length) return;

    const latest = validLinks[validLinks.length - 1];
    const required = ["name=", "race=", "class=", "alignment=", "level=", "exp=", "hp=", "str=", "dex=", "con=", "int=", "wis=", "cha="];
    const complete = required.every(part => latest.includes(part));
    if (!complete) return;

    const current = localStorage.getItem("fr-character-link");
    if (current !== latest) {
      console.log("🔗 New character link detected:", latest);
      localStorage.setItem("fr-character-link", latest);
      iframe.contentWindow.postMessage({ request: "characterData" }, "*");
    }
  }

  const observer = new MutationObserver(() => {
    setTimeout(findLatestCharacterLink, 800);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("message", (event) => {
    if (event.data?.type === "request-character") {
      const latest = localStorage.getItem("fr-character-link");
      event.source.postMessage({ type: "update-character", link: latest }, "*");
    }
  });
})();
