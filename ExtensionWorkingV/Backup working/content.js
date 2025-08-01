(function () {
  if (window.__fr_wiki_active) return;
  window.__fr_wiki_active = true;

  let clickToSearch = true;
  let minimized = false;
  let entryList = [];

  const BLOCKED_WORDS = [
    "settings", "back", "narrator", "character", "sheet", "NarratorWelcome",
    "check", "api", "JanitorLLM", "Open", "AI", "Claude", "Proxy", "Custom", "Enter",
    "Summary", "Select", "Temperature", "backusing", "viewer"
  ];

  const toTitleCase = str => str.replace(
    /\w\S*/g,
    (txt, i) => (["the", "of"].includes(txt.toLowerCase()) && i !== 0)
      ? txt.toLowerCase()
      : txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );

  const box = document.createElement("div");
  box.id = "fr-wiki-box";
  box.style.cssText = `
    all: initial;
    position: fixed !important; top: 50px; right: 50px; width: 500px; height: 400px;
    background: #111; color: white; overflow: hidden;
    border: 2px solid #444; z-index: 999999 !important;
    resize: both; display: flex; flex-direction: column;
    box-shadow: 0 0 10px rgba(0,0,0,0.5); font-family: sans-serif !important;
    box-sizing: border-box;
  `;

  const restoreBtn = document.createElement("button");
  restoreBtn.textContent = "+";
  restoreBtn.title = "Restore Candlekeep";
  restoreBtn.style.cssText = `
    position: fixed !important; top: 10px; left: 10px; z-index: 100000;
    display: none; padding: 4px 8px; font-size: 18px;
    background: rgba(0, 123, 255, 0.2); color: white;
    border: 1px solid rgba(0,123,255,0.4);
    border-radius: 3px; cursor: pointer; font-family: sans-serif;
  `;
  restoreBtn.onclick = () => {
    box.style.display = "flex";
    restoreBtn.style.display = "none";
    minimized = false;
  };
  document.body.appendChild(restoreBtn);

  const header = document.createElement("div");
  header.style.cssText = `
    height: 28px; background: #222; color: white;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 10px; font-size: 14px; font-weight: bold;
    font-family: sans-serif;
    user-select: none;
  `;
  header.textContent = "Candlekeep";

  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = `display: flex; align-items: center; gap: 4px;`;

  const toggleClicks = document.createElement("input");
  toggleClicks.type = "checkbox";
  toggleClicks.checked = true;
  toggleClicks.title = "Toggle word-click lookup";
  toggleClicks.style.cssText = `cursor: pointer;`;

  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = "Search...";
  searchBar.style.cssText = `
    padding: 2px 4px; font-size: 12px; border-radius: 2px;
    border: none; margin-left: 6px; width: 130px;
    background: white; color: black; z-index: 100002;
  `;

  const minimizeBtn = document.createElement("button");
  minimizeBtn.textContent = "–";
  minimizeBtn.title = "Minimize";
  minimizeBtn.style.cssText = `
    background: none; color: white; border: none;
    font-size: 18px; cursor: pointer;
  `;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.title = "Clear content";
  closeBtn.style.cssText = `
    background: none; color: white; border: none;
    font-size: 18px; cursor: pointer;
  `;

  btnContainer.append(toggleClicks, searchBar, minimizeBtn, closeBtn);
  header.append(btnContainer);
  box.append(header);

  const suggestionBox = document.createElement("div");
  suggestionBox.style.cssText = `
    position: absolute; top: 28px; right: 0; z-index: 100001;
    background: #fff; color: black; max-height: 200px; overflow-y: auto;
    font-size: 14px; font-family: sans-serif; width: 200px;
    border: 1px solid #ccc; display: none;
  `;
  box.appendChild(suggestionBox);

  const contentArea = document.createElement("div");
  contentArea.style.cssText = `
    padding: 10px; overflow-y: auto; flex: 1;
    font-family: sans-serif !important; box-sizing: border-box;
  `;
  contentArea.innerHTML = "<em>Click a word to load Forgotten Realms content...</em>";
  box.append(contentArea);

  const resizer = document.createElement("div");
  resizer.style.cssText = `
    position: absolute; width: 16px; height: 16px;
    bottom: 2px; right: 2px; cursor: nwse-resize;
    background: white; border-radius: 3px;
    z-index: 100000;
  `;
  box.append(resizer);
  document.body.appendChild(box);

  fetch("https://bimaadizi.github.io/test/index.html")
    .then(res => res.text())
    .then(html => {
      const matches = html.match(/href="([^"]+)\.html"/g);
      entryList = matches ? matches.map(x => x.match(/"([^"]+)\.html"/)[1]) : [];
    });

  searchBar.addEventListener("input", () => {
    const q = searchBar.value.toLowerCase();
    suggestionBox.innerHTML = "";
    if (!q) {
      suggestionBox.style.display = "none";
      return;
    }
    const matches = entryList.filter(name => name.toLowerCase().includes(q)).slice(0, 15);
    matches.forEach(name => {
      const div = document.createElement("div");
      div.textContent = name;
      div.style.cssText = `padding: 4px 8px; cursor: pointer;`;
      div.onmouseenter = () => div.style.background = "#eee";
      div.onmouseleave = () => div.style.background = "#fff";
      div.onclick = () => {
        fetchFromGitHub(name);
        suggestionBox.style.display = "none";
        searchBar.value = "";
      };
      suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = matches.length ? "block" : "none";
  });

  suggestionBox.addEventListener("mousedown", e => e.stopPropagation());
  searchBar.addEventListener("mousedown", e => e.stopPropagation());
  searchBar.addEventListener("click", e => e.stopPropagation());
  document.addEventListener("click", (e) => {
    if (!suggestionBox.contains(e.target) && e.target !== searchBar) {
      suggestionBox.style.display = "none";
    }
  });

  header.onmousedown = function (e) {
    if (e.target.tagName === "INPUT") return;
    e.preventDefault();
    let shiftX = e.clientX - box.getBoundingClientRect().left;
    let shiftY = e.clientY - box.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      box.style.left = pageX - shiftX + "px";
      box.style.top = pageY - shiftY + "px";
      box.style.right = "auto";
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      document.onmouseup = null;
    };
  };

  resizer.onmousedown = function (e) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = box.offsetWidth;
    const startHeight = box.offsetHeight;

    function onMouseMove(e) {
      box.style.width = startWidth + (e.clientX - startX) + "px";
      box.style.height = startHeight + (e.clientY - startY) + "px";
    }

    document.addEventListener("mousemove", onMouseMove);
    document.onmouseup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.onmouseup = null;
    };
  };

  minimizeBtn.onclick = () => {
    minimized = true;
    box.style.display = "none";
    restoreBtn.style.display = "block";
  };

  closeBtn.onclick = () => {
    contentArea.innerHTML = "<em>Click a word to load Forgotten Realms content...</em>";
  };

  toggleClicks.onchange = () => {
    clickToSearch = toggleClicks.checked;
  };

  function fetchFromGitHub(originalWord) {
    const tryFetch = (url, label) => {
      contentArea.innerHTML = `<em style="color:gray">Loading "${label}" from GitHub Pages...</em>`;
      return fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("Not found");
          return res.text();
        })
        .then(html => {
          contentArea.innerHTML = `<strong>${label}</strong><br><br>` + html;

          contentArea.querySelectorAll("p").forEach(p => {
            p.style.marginBottom = "1.6em";
            p.style.lineHeight = "1.6";
          });

          contentArea.querySelectorAll("h1").forEach(h => {
            h.style.color = "#b33";
            h.style.fontSize = "1.8em";
            h.style.marginTop = "1.4em";
            h.style.marginBottom = "0.6em";
          });

          contentArea.querySelectorAll("h2").forEach(h => {
            h.style.color = "#d66";
            h.style.fontSize = "1.4em";
            h.style.marginTop = "1.3em";
            h.style.marginBottom = "0.5em";
          });

          contentArea.querySelectorAll("h3").forEach(h => {
            h.style.color = "#faa";
            h.style.fontSize = "1.2em";
            h.style.marginTop = "1.2em";
            h.style.marginBottom = "0.4em";
          });

          contentArea.querySelectorAll("table").forEach(t => {
            t.style.borderCollapse = "collapse";
            t.style.width = "100%";
            t.style.marginBottom = "1em";
          });

          contentArea.querySelectorAll("th, td").forEach(cell => {
            cell.style.border = "1px solid #666";
            cell.style.padding = "6px 10px";
            cell.style.color = "#eee";
          });
          return true;
        });
    };

    const titleWord = toTitleCase(originalWord);
    const titleUrl = `https://bimaadizi.github.io/test/${encodeURIComponent(titleWord)}.html`;
    const rawUrl = `https://bimaadizi.github.io/test/${encodeURIComponent(originalWord)}.html`;

    tryFetch(titleUrl, titleWord)
      .catch(() => tryFetch(rawUrl, originalWord))
      .catch(() => {
        contentArea.innerHTML = `<em style="color:red">❌ No entry found for "${originalWord}"</em>`;
      });
  }

  document.addEventListener("click", function (e) {
    if (!clickToSearch || box.contains(e.target)) return;

    let word = "";
    const selected = window.getSelection();
    if (selected && selected.toString().trim().length > 1) {
      word = selected.toString().trim();
    } else {
      let range;
      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.setEnd(pos.offsetNode, pos.offset);
      }

      if (range) {
        const text = range.startContainer.textContent;
        if (text) {
          let offset = range.startOffset, start = offset, end = offset;
          while (start > 0 && /\w/.test(text[start - 1])) start--;
          while (end < text.length && /\w/.test(text[end])) end++;
          word = text.slice(start, end);
        }
      }
    }

    if (!word) return;
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/gi, "");
    if (BLOCKED_WORDS.includes(cleanWord)) return;
    if (cleanWord.endsWith("enhance")) return;

    fetchFromGitHub(word);
  });

  document.addEventListener("keydown", function (e) {
    const activeTag = document.activeElement.tagName.toLowerCase();
    if (["input", "textarea"].includes(activeTag)) return;

    if (!e.ctrlKey) return;

    if (e.key.toLowerCase() === "x") {
      e.preventDefault();
      closeBtn.click();
    }

    if (e.key.toLowerCase() === "m") {
      e.preventDefault();
      if (minimized) {
        restoreBtn.click();
      } else {
        minimizeBtn.click();
      }
    }

    if (e.key.toLowerCase() === "i") {
      e.preventDefault();
      toggleClicks.checked = !toggleClicks.checked;
      clickToSearch = toggleClicks.checked;
    }
  });
})();
