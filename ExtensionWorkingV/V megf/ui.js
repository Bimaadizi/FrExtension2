(function () {
  if (window.__fr_ui_active) return;          // prevent double‑inject
  window.__fr_ui_active = true;

  /**************  CONSTANTS  **************/
  const CONTAINER_ID = "fr-ui-box";
  const IFRAME_ID    = "ui-viewer-frame";
  const LINK_PREFIX  = "http://bimaadizi.github.io/F/?";

  /**************  STATE  **************/
  let lastLinkDetected = null;               // full GitHub‑style link
  let debounceTimeout  = null;

  /**************  CREATE UI CONTAINER  **************/
  const box = document.createElement("div");
  box.id = CONTAINER_ID;
  box.style.cssText = `
    all: initial;
    position: fixed !important;
    bottom: 50px; left: 50px;
    width: 650px; height: 550px;
    background: #000; color: #fff;
    border: 2px solid #555;
    z-index: 999999 !important;
    display: flex; flex-direction: column;
    resize: both; overflow: hidden;
    box-shadow: 0 0 12px rgba(0,0,0,.6);
    font-family: sans-serif;
  `;

  /* === header bar === */
  const top = document.createElement("div");
  top.textContent = "UI Viewer";
  top.style.cssText = `
    background:#222; padding:6px 10px;
    font-weight:bold; font-size:14px;
    user-select:none; cursor:move;
  `;
  box.appendChild(top);

  /* === fallback message === */
  const fallback = document.createElement("div");
  fallback.id = "ui-fallback";
  fallback.textContent = "No Link Detected, Ensure you have the UI Module enabled and functioning";
  fallback.style.cssText = `
    color:white; padding:12px; text-align:center;
    flex:1; display:flex; justify-content:center; align-items:center;
  `;
  box.appendChild(fallback);

  /* === iframe (hidden until a link is found) === */
  const frame = document.createElement("iframe");
  frame.id = IFRAME_ID;
  frame.sandbox = "allow-scripts allow-same-origin";
  frame.style.cssText = "flex:1; border:none; display:none; background:white;";
  frame.onload = () => {
    // hide fallback once ui.html loads successfully
    fallback.style.display = "none";
    frame.style.display = "block";
  };
  box.appendChild(frame);

  /* === resizer handle === */
  const resizer = document.createElement("div");
  resizer.style.cssText = `
    position:absolute; width:16px; height:16px;
    bottom:2px; right:2px; background:white;
    cursor:nwse-resize; border-radius:3px;
  `;
  box.appendChild(resizer);

  document.body.appendChild(box);
  console.log("✅ UI module injected.");

  /**************  DRAG / RESIZE  **************/
  top.onmousedown = (e) => {
    e.preventDefault();
    const startX = e.clientX - box.offsetLeft;
    const startY = e.clientY - box.offsetTop;
    const move = (ev) => {
      box.style.left = ev.clientX - startX + "px";
      box.style.top  = ev.clientY - startY + "px";
      box.style.right = "auto"; // keep position fixed
    };
    document.addEventListener("mousemove", move);
    document.onmouseup = () => document.removeEventListener("mousemove", move);
  };

  resizer.onmousedown = (e) => {
    e.preventDefault();
    const startW = box.offsetWidth;
    const startH = box.offsetHeight;
    const sx = e.clientX;
    const sy = e.clientY;
    const move = (ev) => {
      box.style.width  = startW + (ev.clientX - sx) + "px";
      box.style.height = startH + (ev.clientY - sy) + "px";
    };
    document.addEventListener("mousemove", move);
    document.onmouseup = () => document.removeEventListener("mousemove", move);
  };

  /**************  LINK DETECTION  **************/
  function latestCharacterLink() {
    const ps = Array.from(document.querySelectorAll("p")).reverse();
    for (const p of ps) {
      const txt = p.textContent.trim();
      if (txt.startsWith(LINK_PREFIX) && txt.endsWith("-")) return txt;
    }
    return null;
  }

  function loadIntoIframe(link) {
    const paramsPart = link.split("?")[1];
    if (!paramsPart) return;
    const localURL = `${chrome.runtime.getURL("ui.html")}?${paramsPart}`;
    console.log("📥 Loading:", localURL);
    frame.src = localURL;               // set src (onload will show it)
  }

  function checkForNewLink() {
    const link = latestCharacterLink();
    if (!link || link === lastLinkDetected) return;

    lastLinkDetected = link;

    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      // After 1 s confirm nothing newer has appeared
      const confirmLink = latestCharacterLink();
      if (confirmLink && confirmLink === lastLinkDetected) {
        loadIntoIframe(confirmLink);
      }
    }, 1000);
  }

  // Observe DOM changes (chat messages appearing)
  const observer = new MutationObserver(checkForNewLink);
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial scan (in case link already present)
  checkForNewLink();
})();
