(function initUIViewer() {
  if (window.location.href.includes("ui.html")) return;
  if (document.getElementById("ui-box")) return;

  console.log("✅ UI Viewer Initialized");

  let minimized = false;

  const container = document.createElement("div");
  container.id = "ui-box";
  container.style.cssText = `
    all: initial;
    position: fixed !important;
    top: 60px;
    right: 60px;
    width: 500px;
    height: 600px;
    background: #111;
    color: white;
    border: 2px solid #444;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    font-family: sans-serif !important;
    display: flex;
    flex-direction: column;
    resize: both;
    z-index: 999999 !important;
    box-sizing: border-box;
    overflow: hidden;
  `;

  const restoreBtn = document.createElement("button");
  restoreBtn.textContent = "+";
  restoreBtn.title = "Restore UI Viewer";
  restoreBtn.style.cssText = `
    position: fixed !important;
    top: 70px;
    left: 10px;
    z-index: 100000;
    display: none;
    padding: 4px 8px;
    font-size: 18px;
    background: rgba(255, 0, 0, 0.2);
    color: white;
    border: 1px solid rgba(255,0,0,0.4);
    border-radius: 3px;
    cursor: pointer;
    font-family: sans-serif;
    margin-top: 0px;
  `;
  restoreBtn.onclick = () => {
    container.style.display = "flex";
    restoreBtn.style.display = "none";
    minimized = false;
  };
  document.body.appendChild(restoreBtn);

  const bar = document.createElement("div");
  bar.style.cssText = `
    height: 28px;
    background: #222;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 14px;
    font-weight: bold;
    font-family: sans-serif;
    user-select: none;
    cursor: move;
  `;
  bar.innerHTML = `<span>UI Viewer</span>`;

  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = `display: flex; align-items: center; gap: 4px;`;

  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "⟳";
  refreshBtn.title = "Refresh";
  refreshBtn.style.cssText = `
    background: none;
    color: white;
    border: none;
    font-size: 16px;
    cursor: pointer;
  `;

  const minimizeBtn = document.createElement("button");
  minimizeBtn.textContent = "–";
  minimizeBtn.title = "Minimize";
  minimizeBtn.style.cssText = `
    background: none;
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
  `;

  btnContainer.append(refreshBtn, minimizeBtn);
  bar.appendChild(btnContainer);

  const iframe = document.createElement("iframe");
  iframe.id = "ui-frame";
  iframe.src = chrome.runtime.getURL("ui.html");
  iframe.style.cssText = `
    flex: 1;
    border: none;
    width: 100%;
    height: 100%;
  `;

  const resizeHandle = document.createElement("div");
  resizeHandle.style.cssText = `
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 2px;
    right: 2px;
    cursor: nwse-resize;
    background: white;
    border-radius: 3px;
    z-index: 100000;
  `;

  container.appendChild(bar);
  container.appendChild(iframe);
  container.appendChild(resizeHandle);
  document.body.appendChild(container);

  refreshBtn.addEventListener("click", () => {
    iframe.contentWindow.postMessage({ type: "force-refresh" }, "*");
  });

  minimizeBtn.addEventListener("click", () => {
    container.style.display = "none";
    restoreBtn.style.display = "block";
    minimized = true;
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
      iframe.contentWindow.postMessage({ type: "update-character", link: latest }, "*");
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
