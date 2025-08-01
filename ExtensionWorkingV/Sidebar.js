(function () {
  const SIDEBAR_ID = 'custom-sidebar-frame';
  const TOGGLE_LAYOUT_ID = 'layout-toggle-button';

  const PADDING_PX = 5; // Adjustable padding here

  const PANEL_MAP = {
    "Restore Candlekeep": { wrapperId: "fr-wiki-box", maximizeId: "", restoreViaClick: true },
    "Restore UI Viewer": { wrapperId: "ui-box", maximizeId: "", restoreViaClick: true },
    "Restore Journal": { wrapperId: "journal-wrapper", maximizeId: "maximize-journal" },
    "Show Music Panel": { wrapperId: "fr-music-box", maximizeId: "maximize-music" },
    "Maximize-music": { wrapperId: "fr-music-box", maximizeId: "maximize-music" },
    "Show Spell Panel": { wrapperId: "spell-overlay", maximizeId: "maximize-spellpanel" },
    "Maximize-spellpanel": { wrapperId: "spell-overlay", maximizeId: "maximize-spellpanel" }
  };

  const BUTTON_CONFIG = {
    "Restore Candlekeep": { file: "https://i.imgur.com/BFhAbR7.png", label: "Candlekeep" },
    "Restore UI Viewer": { file: "https://i.imgur.com/UvgsRjF.png", label: "UI" },
    "Show Music Panel": { file: "https://i.imgur.com/Obqle4f.png", label: "Audio" },
    "Maximize-music": { file: "https://i.imgur.com/Obqle4f.png", label: "Audio" },
    "Maximize-spellpanel": { file: "https://i.imgur.com/NKtvGSO.png", label: "Spellbook" },
    "Show Spell Panel": { file: "https://i.imgur.com/NKtvGSO.png", label: "Spellbook" },
    "Restore Journal": { file: "https://i.imgur.com/WoKxM1M.png", label: "Journal" }
  };

  if (document.getElementById(SIDEBAR_ID)) return;

  const sidebar = document.createElement('div');
  sidebar.id = SIDEBAR_ID;
  sidebar.dataset.layout = 'grid';
  Object.assign(sidebar.style, {
    position: 'fixed',
    top: '100px',
    left: '100px',
    width: '250px',
    height: '300px',
    resize: 'both',
    overflow: 'hidden',
    zIndex: '2147483647',
    background: 'white url("https://i.imgur.com/ROVpYOy.png") center/cover',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    padding: `${PADDING_PX}px`
  });

const dragHandle = document.createElement('div');
dragHandle.style.cssText = `
  height: 3px;
  background: rgba(128, 128, 128, 0.6); /* semi-transparent gray */
  cursor: move;
  user-select: none;
  width: 100%;
`;

  sidebar.appendChild(dragHandle);

  const buttonContainer = document.createElement('div');
  Object.assign(buttonContainer.style, {
    flex: '1',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    width: '100%',
    height: '100%'
  });
  sidebar.appendChild(buttonContainer);

  const toggleButton = document.createElement('div');
  toggleButton.id = TOGGLE_LAYOUT_ID;
  toggleButton.textContent = 'Layout';
  toggleButton.title = 'Switch layout';
  Object.assign(toggleButton.style, {
    position: 'absolute',
    top: '2px',
    right: '4px',
    padding: '2px 6px',
    fontSize: '10px',
    fontFamily: 'sans-serif',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    borderRadius: '2px',
    opacity: '0',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    zIndex: '2147483648'
  });
  sidebar.appendChild(toggleButton);

  sidebar.addEventListener('mouseenter', () => toggleButton.style.opacity = '1');
  sidebar.addEventListener('mouseleave', () => toggleButton.style.opacity = '0');

  const layouts = ['grid', 'column', 'row'];
  toggleButton.onclick = () => {
    const current = sidebar.dataset.layout;
    const next = layouts[(layouts.indexOf(current) + 1) % layouts.length];
    sidebar.dataset.layout = next;
    updateLayout();
    resizeAllButtons();
  };

  function updateLayout() {
    const layout = sidebar.dataset.layout;
    if (layout === 'grid') {
      Object.assign(buttonContainer.style, { flexDirection: 'row', flexWrap: 'wrap' });
    } else if (layout === 'column') {
      Object.assign(buttonContainer.style, { flexDirection: 'column', flexWrap: 'nowrap' });
    } else {
      Object.assign(buttonContainer.style, { flexDirection: 'row', flexWrap: 'nowrap' });
    }
  }

  document.body.appendChild(sidebar);

  // Dragging logic
  let isDragging = false, offsetX = 0, offsetY = 0;
  dragHandle.onmousedown = (e) => {
    isDragging = true;
    offsetX = e.clientX - sidebar.offsetLeft;
    offsetY = e.clientY - sidebar.offsetTop;
    document.body.style.userSelect = 'none';
  };
  document.onmousemove = (e) => {
    if (isDragging) {
      sidebar.style.left = `${e.clientX - offsetX}px`;
      sidebar.style.top = `${e.clientY - offsetY}px`;
    }
  };
  document.onmouseup = () => {
    isDragging = false;
    document.body.style.userSelect = '';
  };

  const addedButtons = new Map();

  function createButtonElement(config, originalBtn, title) {
    const container = document.createElement('div');
    container.className = 'sidebar-button';
    Object.assign(container.style, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      boxSizing: 'border-box'
    });

    const img = new Image();
    img.src = config.file || '';
    img.alt = config.label || 'Unknown';
    Object.assign(img.style, {
      objectFit: 'contain',
      width: '100%',
      height: '100%'
    });

    img.onerror = () => {
      img.remove();
      const fallback = document.createElement('div');
      fallback.textContent = config.label || 'Unknown';
      Object.assign(fallback.style, {
        color: 'white',
        background: 'black',
        fontSize: '10px',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      });
      container.appendChild(fallback);
    };

    container.appendChild(img);
    container.onclick = () => {
      const panel = PANEL_MAP[title];
      if (panel) {
        const wrapper = document.getElementById(panel.wrapperId);
        if (!wrapper) return;
        const isVisible = wrapper.style.display !== 'none';
        wrapper.style.display = isVisible ? 'none' : 'block';
        if (!isVisible && panel.maximizeId) {
          const maxBtn = document.getElementById(panel.maximizeId);
          if (maxBtn) maxBtn.click();
        } else if (isVisible && panel.maximizeId) {
          const maxBtn = document.getElementById(panel.maximizeId);
          if (maxBtn) maxBtn.style.display = 'block';
        }
        if (!isVisible && panel.restoreViaClick) {
          originalBtn.click();
        }
      } else {
        originalBtn.click();
      }
      setTimeout(updateSidebarButtonStates, 100);
    };

    buttonContainer.appendChild(container);
    return container;
  }

  function processButton(originalBtn) {
    const title = originalBtn.title || originalBtn.id || "";
    if (!title || addedButtons.has(title)) return;
    const config = BUTTON_CONFIG[title] || { label: title };
    const container = createButtonElement(config, originalBtn, title);
    addedButtons.set(title, { container, originalBtn });
    originalBtn.style.opacity = '0';
    originalBtn.style.pointerEvents = 'none';
  }

  function resizeAllButtons() {
    const layout = sidebar.dataset.layout;
    const btns = Array.from(buttonContainer.children);
    const total = btns.length;

    const containerWidth = buttonContainer.clientWidth;
    const containerHeight = buttonContainer.clientHeight;
    const gap = 4;

    if (layout === 'grid') {
      const cols = Math.ceil(Math.sqrt(total));
      const rows = Math.ceil(total / cols);
      const cellW = Math.floor((containerWidth - gap * (cols - 1)) / cols);
      const cellH = Math.floor((containerHeight - gap * (rows - 1)) / rows);
      btns.forEach(btn => {
        btn.style.width = `${cellW}px`;
        btn.style.height = `${cellH}px`;
      });
    } else if (layout === 'column') {
      const cellH = Math.floor((containerHeight - gap * (total - 1)) / total);
      btns.forEach(btn => {
        btn.style.height = `${cellH}px`;
        btn.style.width = '100%';
      });
    } else {
      const cellW = Math.floor((containerWidth - gap * (total - 1)) / total);
      btns.forEach(btn => {
        btn.style.width = `${cellW}px`;
        btn.style.height = '100%';
      });
    }
  }

  function updateSidebarButtonStates() {
    for (const [title, { container, originalBtn }] of addedButtons) {
      const panel = PANEL_MAP[title];
      let isVisible = false;
      if (panel?.wrapperId) {
        const wrapper = document.getElementById(panel.wrapperId);
        isVisible = wrapper && wrapper.style.display !== 'none';
      } else {
        isVisible = getComputedStyle(originalBtn).display !== 'none';
      }
      container.style.opacity = isVisible ? '0.3' : '1';
    }
  }

  function scanAndProcessButtons() {
    Array.from(document.querySelectorAll('button')).filter(btn => {
      const style = getComputedStyle(btn);
      return style.position === 'fixed' && style.left === '10px';
    }).forEach(processButton);
    updateSidebarButtonStates();
    resizeAllButtons();
  }

  new ResizeObserver(resizeAllButtons).observe(sidebar);
  scanAndProcessButtons();
  setInterval(updateSidebarButtonStates, 500);
  updateLayout();
})();
