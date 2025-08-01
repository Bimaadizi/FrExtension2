// ==UserScript==
// @name         Spell Overlay
// @version      Final
// ==/UserScript==
(function () {
    const SPELLBOOK_TAB = "Spellbook";
    const SPELL_DIR = "Spells/";
    const BACKGROUND_IMAGE = chrome.runtime.getURL("SpellBackground.jpg");
    const overlayId = 'spell-overlay';
    const minimizeId = 'maximize-spellpanel';
    const indexUrl = chrome.runtime.getURL(`${SPELL_DIR}index.txt`);

    const chatId = (location.pathname.match(/\/chats\/(\d+)/) || [])[1] || "default";
    const storageKey = `spellbook_${chatId}`;
    let spellbook = JSON.parse(localStorage.getItem(storageKey) || "[]");
    let spellList = [];

    const tabs = {};
    let spellEntries = [];
    let currentSpellIndex = -1;

    const overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.tabIndex = 0;
    overlay.style.cssText = `
        position: fixed;
        top: 60px;
        left: 60px;
        width: 500px;
        height: 400px;
        background-image: url('${BACKGROUND_IMAGE}');
        background-size: cover;
        background-repeat: repeat;
        border: 2px solid black;
        resize: both;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 9999;
        font-family: sans-serif;
        color: black;
    `;

    makeDraggable(overlay);

    const minimizeBtn = document.createElement("button");
    minimizeBtn.id = minimizeId;
    minimizeBtn.title = "Show Spell Panel";
    minimizeBtn.innerText = "+";
    minimizeBtn.style.cssText = `
        display: none;
        top: 190px;
        left: 10px;
        z-index: 100000;
        padding: 4px 8px;
        font-size: 18px;
        background: rgba(245, 245, 220, 0.3);
    border: 1px solid rgba(245, 245, 220, 0.6);
        border-radius: 3px;
        cursor: pointer;
        font-family: sans-serif;
        position: fixed !important;
    `;
    minimizeBtn.addEventListener("click", () => {
        overlay.style.display = "flex";
        minimizeBtn.style.display = "none";
    });
    document.body.appendChild(minimizeBtn);

    const tabBar = document.createElement("div");
    tabBar.style.cssText = `
        display: flex;
        background: #ccc;
        border-bottom: 1px solid black;
    `;

    const search = document.createElement("input");
    search.type = "text";
    search.placeholder = "Search spells...";
    search.style.cssText = `
        padding: 5px;
        border: 1px solid black;
        width: 98%;
        margin: 4px auto 0 auto;
    `;
    const datalist = document.createElement("datalist");
    datalist.id = "spell-suggestions";
    document.body.appendChild(datalist);

    search.setAttribute("list", "spell-suggestions");
    search.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            const name = search.value.trim();
            if (name) {
                loadSpell(name, true);
                search.value = "";
            }
        }
    });

    const contentArea = document.createElement("div");
    contentArea.style.cssText = `
        flex: 1;
        overflow: auto;
        padding: 10px;
        min-height: 0;
    `;

    const minimizeToggle = document.createElement("button");
    minimizeToggle.textContent = "−";
    minimizeToggle.title = "Minimize";
    minimizeToggle.style.cssText = `
        position: absolute;
        right: 5px;
        top: 2px;
        background: transparent;
        border: none;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        color: black;
    `;
    minimizeToggle.addEventListener("click", () => {
        overlay.style.display = "none";
        minimizeBtn.style.display = "block";
    });

    overlay.appendChild(minimizeToggle);
    overlay.appendChild(tabBar);
    overlay.appendChild(search);
    overlay.appendChild(contentArea);
    document.body.appendChild(overlay);

    addTab(SPELLBOOK_TAB, renderSpellbook());

    fetch(indexUrl)
        .then(resp => resp.text())
        .then(txt => {
            spellList = txt.split('\n')
                .map(line => line.trim().replace(/\.txt$/i, ''))
                .filter(Boolean);
            datalist.innerHTML = spellList.map(name =>
                `<option value="${name}"></option>`
            ).join('');
        });

    document.addEventListener("mouseup", () => {
        const selection = window.getSelection().toString().trim();
        if (selection) loadSpell(selection, false);
    });

    function loadSpell(name, showError) {
        const url = chrome.runtime.getURL(`${SPELL_DIR}${name}.txt`);
        fetch(url)
            .then(resp => {
                if (!resp.ok) throw new Error("Not found");
                return resp.text();
            })
            .then(text => {
                const wrapper = renderSpellContent(text, name);

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = spellbook.includes(name);
                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) {
                        if (!spellbook.includes(name)) spellbook.push(name);
                    } else {
                        spellbook = spellbook.filter(s => s !== name);
                    }
                    localStorage.setItem(storageKey, JSON.stringify(spellbook));
                    tabs[SPELLBOOK_TAB].content = renderSpellbook();
                    if (tabs[SPELLBOOK_TAB].active) selectTab(SPELLBOOK_TAB);
                });

                const labelWrap = document.createElement("label");
                labelWrap.appendChild(checkbox);
                labelWrap.append(" Add to spellbook");
                wrapper.appendChild(labelWrap);

                addTab(name, wrapper, true);
            })
            .catch(() => {
                if (showError) console.warn(`Spell not found: "${name}"`);
            });
    }

    function renderSpellContent(rawText, fallbackName) {
        const spell = parseSpell(rawText);
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";

        const levelSchool = document.createElement("div");
        levelSchool.textContent = `Level ${spell.Level || "?"} - ${spell.School || "Unknown"}`;
        levelSchool.style.marginBottom = "10px";

        wrapper.appendChild(levelSchool);

        const ignored = ['Name', 'Level', 'School'];
        for (const key in spell) {
            if (ignored.includes(key)) continue;
            const row = document.createElement("div");
            row.innerHTML = `<strong>${key}:</strong> ${spell[key]}`;
            row.style.marginTop = "4px";
            wrapper.appendChild(row);
        }

        return wrapper;
    }

    function parseSpell(rawText) {
        const lines = rawText.split('\n');
        const result = {};
        let currentField = null;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            const match = line.match(/^([^:]+):\s*(.*)$/);
            if (match) {
                currentField = match[1].trim();
                result[currentField] = match[2].trim();
            } else if (currentField) {
                result[currentField] += "\n" + line;
            }
        }

        return result;
    }

    function addTab(name, contentElement, closable = false) {
        if (tabs[name]) {
            selectTab(name);
            return;
        }

        const tab = document.createElement("div");
        tab.style.cssText = `
            padding: 5px 10px;
            border-right: 1px solid black;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
        `;

        const titleSpan = document.createElement("span");
        titleSpan.textContent = name;
        titleSpan.style.flex = "1";
        tab.appendChild(titleSpan);

        if (closable && name !== SPELLBOOK_TAB) {
            const closeBtn = document.createElement("span");
            closeBtn.textContent = "✖";
            closeBtn.style.cssText = `
                margin-left: 8px;
                color: red;
                cursor: pointer;
            `;
            closeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                tab.remove();
                delete tabs[name];
                contentArea.innerHTML = "";
                selectTab(SPELLBOOK_TAB);
            });
            tab.appendChild(closeBtn);
        }

        tab.addEventListener("click", () => selectTab(name));
        tabBar.appendChild(tab);
        tabs[name] = { tab, content: contentElement, active: false };
        selectTab(name);
    }

    function selectTab(name) {
        for (const t in tabs) {
            tabs[t].tab.style.background = "#ccc";
            tabs[t].active = false;
        }
        if (tabs[name]) {
            tabs[name].tab.style.background = "#fff";
            tabs[name].active = true;
            contentArea.innerHTML = "";
            contentArea.appendChild(tabs[name].content);
            if (name === SPELLBOOK_TAB) updateSpellEntryRefs();
        }
    }

    function renderSpellbook() {
        const container = document.createElement("div");
        spellEntries = [];

        spellbook.forEach((name, index) => {
            const entry = document.createElement("div");
            entry.classList.add("spell-entry");
            entry.dataset.spellIndex = index;
            entry.tabIndex = -1;

            const header = document.createElement("div");
            header.style.display = "flex";
            header.style.alignItems = "center";
            header.style.cursor = "pointer";

            const toggleArrow = document.createElement("span");
            toggleArrow.textContent = "▼";
            toggleArrow.style.marginRight = "6px";
            toggleArrow.style.cursor = "pointer";
            toggleArrow.style.userSelect = "none";

            const titleText = document.createElement("strong");
            titleText.textContent = name;
            titleText.style.color = "#6D0000";
            titleText.style.fontFamily = "Times New Roman";
            titleText.style.fontSize = "24px";

            header.appendChild(toggleArrow);
            header.appendChild(titleText);
            entry.appendChild(header);

            const content = document.createElement("div");
            content.style.marginLeft = "16px";
            content.style.marginTop = "4px";

            fetch(chrome.runtime.getURL(`${SPELL_DIR}${name}.txt`))
                .then(r => r.text())
                .then(txt => {
                    const parsed = parseSpell(txt);
                    const full = renderSpellContent(txt, name);
                    content.appendChild(full);
                });

            toggleArrow.addEventListener("click", () => {
                const visible = content.style.display !== "none";
                content.style.display = visible ? "none" : "block";
                toggleArrow.textContent = visible ? "►" : "▼";
            });

            entry.appendChild(content);
            spellEntries.push(entry);
            container.appendChild(entry);
        });

        return container;
    }

    function updateSpellEntryRefs() {
        spellEntries = Array.from(contentArea.querySelectorAll(".spell-entry"));
        currentSpellIndex = -1;
    }

    overlay.addEventListener("keydown", (e) => {
        if (!tabs[SPELLBOOK_TAB]?.active) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (currentSpellIndex < spellEntries.length - 1) {
                currentSpellIndex++;
                spellEntries[currentSpellIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (currentSpellIndex > 0) {
                currentSpellIndex--;
                spellEntries[currentSpellIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });

    function makeDraggable(el) {
        let isDragging = false, offsetX, offsetY;

        el.addEventListener("mousedown", e => {
            const rect = el.getBoundingClientRect();
            const resizeThreshold = 20;
            const isResizingArea =
                e.clientX > rect.right - resizeThreshold &&
                e.clientY > rect.bottom - resizeThreshold;

            if (isResizingArea || e.target.tagName === "INPUT" || e.target.closest("button")) return;

            isDragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", stop);
        });

        function move(e) {
            if (!isDragging) return;
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        }

        function stop() {
            isDragging = false;
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", stop);
        }
    }
})();
