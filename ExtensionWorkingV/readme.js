(() => {
  if (document.getElementById("__readme_overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "__readme_overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    zIndex: "999999999",
    overflow: "hidden",
    fontFamily: "serif"
  });

  const svgNS = "http://www.w3.org/2000/svg";

  const slideGroups = [
    {
      title: "Introduction",
      slides: [
        {
          content: "Welcome to the Forgotten Realms Toolkit. This interactive readme will guide you through every feature.",
          position: { x: 275, y: 650, width: 1386, height: 300 } // 🧭 Intro
        }
      ]
    },
    {
title: "Candlekeep",
slides: [
  {
    content: `
      <p style="margin-bottom: 16px;">Candlekeep is a feature of this extension which allows to to quickly look up terms, locations, items, races, and names in a simplified mirror of the Forgotten Realms containing over 45,000 entries. Click or highlight a word/phrase with the extension active, or use the search bar.</p>

      <p style="margin-bottom: 16px;">On the UI Bar/Top Bar you can drag the element to your desired location, you can also drag it to your desired size using the square in the right corner.</p>

      <p style="margin-bottom: 16px;">On the UI bar there is:</p>
      <ul style="margin-bottom: 16px; padding-left: 20px;">
        <li><strong>An Enable/Disable toggle:</strong> The blue checkmark indicates if the extension is active. When disabled clicking/highlighting will not search for that word. But the search bar still will.</li>
        <li><strong>The Search Bar:</strong> Will search for whichever word you are looking for. Features autofill.</li>
        <li><strong>Minimize Button:</strong> Will minimize the extension. Can be maximized again using the blue + button on the left or using sidebar if it's enabled.</li>
        <li><strong>X Button:</strong> Clears the current search.</li>
      </ul>

      <p style="margin-bottom: 16px;">Candlekeep also features a few shortcuts - no other features have shortcuts because I didn't realize how big the scope of this project would become.</p>
      <ul style="padding-left: 20px;">
        <li><kbd>Ctrl+M</kbd> - Minimizes/Maximizes</li>
        <li><kbd>Ctrl+I</kbd> - Enables/Disables extension.</li>
        <li><kbd>Ctrl+X</kbd> - Clears current entry.</li>
      </ul>
    `,
    position: { x: 840, y: 200, width: 750, height: 700 }, // 🧭 Candlekeep
    customImage: {
        href: "https://i.imgur.com/VCAxtXm.png",
        x: 393,
        y: 260,
        width: 390,
        height: 580
   }
  }
]

    },
    {
      title: "Character Sheet",
      slides: [
        {
          content: `
  <p style="margin-bottom: 16px;">Character sheet is a feature of the extension that draws reads the data stored in the UI module from the Forgotten Realms website and loads it into a viewable iframe. It will update automatically and can be dragged and resized.</p>

  <p style="margin-bottom: 16px;">This data is stored in a link because the AI will not mess with the structure of the link while it may mess with the structure of raw text. It is not loading Bimaadizi.github.io.</p>

  <p style="margin-bottom: 16px;">You can find the UI extension at this link: 
    <a href="https://bimaadizi.github.io/Forgotten-Realms-RPG/#UI%20Modules" target="_blank" style="color: #00d0ff;">
      https://bimaadizi.github.io/Forgotten-Realms-RPG/#UI%20Modules
    </a>
  </p>

  <p style="margin-bottom: 16px;">Note: This module is primarily recommended for Deepseek - It works with Gemini but may have some issues.</p>

  <p style="margin-bottom: 16px;"><strong>Avtatars:</strong> The UI module features a list of avatars which are saved to the cache of your chat. Each chat can have a different avatar. Upon hovering over the UI viewer you can find a list of images sorted by race. If you have any images you would like added, let me know in the discord.</p>

  <p style="margin-bottom: 16px;"><strong>Layouts:</strong> There are multiple layouts in the Character sheet, Dynamic, Grid, Horizontal, and Vertical. You can adjust them to your liking.</p>

  <p style="margin-bottom: 16px;"><strong>The UI bar/Top Bar has a few features:</strong></p>
  <ul style="margin-bottom: 16px; padding-left: 20px;">
    <li><strong>Refresh Button:</strong> Manually searches for new links</li>
    <li><strong>Minimize button:</strong> Closes the UI, can be re-maximized using the Red + Button or sidebar extension if active.</li>
  </ul>

  <p style="margin-bottom: 16px;">If you have issues with this feature it might be because you opened the read me (oops!) and is now trying to inject into the readme instead of your janitorai page. Try refreshing and not opening me this time. If that isn't the issue check that the AI is generating the link properly.</p>

`,
              position: { x: 840, y: 200, width: 750, height: 700 }, // 🧭 Character Sheet
    customImage: {
        href: "https://i.imgur.com/cPNIu0F.png",
        x: 393,
        y: 260,
        width: 390,
        height: 580
}
        }
      ]
    },
    {
      title: "Music Themes",
      slides: [
        {
          content: ".",
          position: { x: 840, y: 200, width: 750, height: 700 }, // 🧭 Music Themes
    customImage: {
        href: "https://i.imgur.com/S8FNhm5.png",
        x: 393,
        y: 260,
        width: 390,
        height: 580
}
        }
      ]
    },
    {
      title: "Spellbook",
      slides: [
        {
          content: `
  <p style="margin-bottom: 16px;">The spellbook is a feature of this extension which allows the user to highlight spells in order to look them up, track what spells they have, and what they do.</p>

  <p style="margin-bottom: 16px;">The AI is prone to misunderstanding and misusing spells, this extension does not prevent this - but - you can use the spellbook to make an OOC comment explaining the spell to the AI.</p>

  <p style="margin-bottom: 16px;">Like other features, your spellbook is saved to the chat’s cache - meaning each chat can have a different list of saved spells.</p>

  <p style="margin-bottom: 16px;"><strong>Searchbar:</strong> You can search for spells to open them up and view information about them.</p>

  <p style="margin-bottom: 16px;"><strong>Adding to spellbook:</strong> At the bottom of each page (from either highlighting or searching a spell) you will see a checkbox that says “Add to spellbook”. When selecting it, it will now appear in your ‘Spellbook’ which can be accessed by clicking that tab.</p>

  <p style="margin-bottom: 16px;"><strong>Collapsing/Expanding spells:</strong> In your spellbook, you can click the arrow next to the name of the spell to collapse or expand it.</p>

  <p style="margin-bottom: 16px;"><strong>Navigation:</strong> You can use the arrow keys to move up and down through the various entries of the spellbook</p>

  <p style="margin-bottom: 16px;"><strong>Minimization:</strong> You can press the minimize button to minimize the spellbook, it can be maximized again either by using the + button on the left of the screen or by using the Sidebar.</p>
`,
          position: { x: 840, y: 200, width: 750, height: 700 }, // 🧭 Spell Overlay 
    customImage: {
        href: "https://i.imgur.com/nz6FBtm.png",
        x: 393,
        y: 260,
        width: 390,
        height: 580
}
        }
      ]
    },
    {
      title: "Journal",
      slides: [
        {
content: `
  <p style="margin-bottom: 16px;">The journal is a feature that allows you to take notes in game. It features multiple tabs which are saved to each chat, basic markdown, and various fonts/colors that can be integrated. It also features bolding, italics, underscores, and font resizing.</p>

  <p style="margin-bottom: 16px;"><strong>Renaming:</strong> To rename a tab, double click on it twice.</p>

  <p style="margin-bottom: 16px;"><strong>WYSIWYG:</strong> Various markdown options, such as bolding (B), Italics (I), Underlining (_), font increase (A+/A-) and various colors/fonts.</p>

  <p style="margin-bottom: 16px;"><strong>New Tabs:</strong> Press the + button to make a new tab, and the X button to delete it.</p>

  <p style="margin-bottom: 16px;"><strong>Minimization:</strong> Use the - button to minimize the tab, it can then be maximized again using the + button on the left side of the screen or the sidebar extension.</p>
`,
          position: { x: 840, y: 200, width: 750, height: 700 }, // 🧭 Journal
    customImage: {
        href: "https://i.imgur.com/Nvu9ZMQ.png",
        x: 393,
        y: 260,
        width: 390,
        height: 580
}
        }
      ]
    },
    {
      title: "Sidebar",
      slides: [
        {
          content: `
  <p style="margin-bottom: 16px;">The sidebar is a function that allows you to minimize/maximize the other features of this extension. It can be dragged using the thin grey bar at the top and resized using the right corner.</p>

  <p style="margin-bottom: 16px;"><strong>Minimize/Maximize:</strong> You can click the buttons to minimize and maximize the features of the extension. The buttons turn opaque when that feature is open.</p>

  <p style="margin-bottom: 16px;"><strong>Layout:</strong> Press the layout button to cycle through the various layouts. There exist 3 modes: Grid, vertical, and horizontal.</p>
`,
          position: { x: 840, y: 200, width: 750, height: 700 }, // 🧭 Sidebar
    customImage: {
        href: "https://i.imgur.com/MxpZisn.png",
        x: 393,
        y: 260,
        width: 390,
        height: 580
}
        }
      ]
    },
    {
      title: "Complimentary Material",
      slides: [
        {
          content: "Complimentary material coming LATER.",
          position: { x: 275, y: 650, width: 1386, height: 300 } // 🧭 CM Slide 1
        },
        {
          content: "PLACEHOLDER !!!.",
          position: { x: 500, y: 600, width: 1000, height: 300 } // 🧭 CM Slide 2
        }
      ]
    },
    {
      title: "Credits",
      slides: [
        {
          content: "Created by Bimaadizi. Special thanks to contributors.",
          position: { x: 0, y: 0, width: 0, height: 0 } // 🧭 Credits
        }
      ]
    }
  ];

  // Flatten for easy navigation
  const flatSlides = [];
  const tocMap = [];

  slideGroups.forEach((group, groupIndex) => {
    group.slides.forEach((slide, slideOffset) => {
      flatSlides.push({
        title: group.title,
        content: slide.content,
        position: slide.position,
        groupIndex,
        slideOffset,
        isFirstOfGroup: slideOffset === 0
      });
      if (slideOffset === 0) tocMap.push(flatSlides.length - 1);
    });
  });

  let currentSlide = 0;

  // SVG setup
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", "0 0 1920 1080");

  const bg = document.createElementNS(svgNS, "image");
  bg.setAttributeNS(null, "href", "https://i.imgur.com/pzJsulV.png");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", "0");
  bg.setAttribute("width", "1920");
  bg.setAttribute("height", "1080");

  const slideGroup = document.createElementNS(svgNS, "g");

  const textBox = document.createElementNS(svgNS, "foreignObject");
  const html = document.createElement("div");
  html.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  Object.assign(html.style, {
    height: "100%",
    overflow: "auto",
    background: "rgba(0, 0, 0, 0.6)",
    color: "white",
    fontSize: "24px",
    padding: "20px",
    borderRadius: "10px",
    boxSizing: "border-box"
  });
  textBox.appendChild(html);
  slideGroup.appendChild(textBox);

  const proceed = document.createElementNS(svgNS, "foreignObject");
  proceed.setAttribute("x", "1480");
  proceed.setAttribute("y", "900");
  proceed.setAttribute("width", "300");
  proceed.setAttribute("height", "100");

  const proceedBtn = document.createElement("button");
  proceedBtn.textContent = "Proceed →";
  proceedBtn.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  Object.assign(proceedBtn.style, {
    fontSize: "24px",
    padding: "15px 30px",
    background: "#111",
    color: "#fff",
    border: "2px solid white",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%"
  });

  proceedBtn.onclick = () => {
    currentSlide = (currentSlide + 1) % flatSlides.length;
    renderSlide();
  };

  proceed.appendChild(proceedBtn);
  slideGroup.appendChild(proceed);

  svg.appendChild(bg);
  svg.appendChild(slideGroup);

  // Sidebar nav
  const sidebar = document.createElement("div");
  Object.assign(sidebar.style, {
    position: "fixed",
    top: "0",
    left: "0",
    height: "100vh",
    width: "220px",
    background: "#000",
    color: "#fff",
    padding: "20px",
    boxSizing: "border-box",
    zIndex: "1000000",
    overflowY: "auto",
    fontSize: "18px"
  });

  const title = document.createElement("div");
  title.textContent = "Table of Contents";
  title.style.fontSize = "20px";
  title.style.marginBottom = "20px";
  title.style.borderBottom = "1px solid #444";
  sidebar.appendChild(title);

  slideGroups.forEach((group, i) => {
    const link = document.createElement("div");
    link.textContent = `${i + 1}. ${group.title}`;
    link.style.margin = "10px 0";
    link.style.cursor = "pointer";
    link.style.color = "#ccc";
    link.onmouseenter = () => link.style.color = "#fff";
    link.onmouseleave = () => link.style.color = "#ccc";
    link.onclick = () => {
      currentSlide = tocMap[i];
      renderSlide();
    };
    sidebar.appendChild(link);
  });

  // Close button
  const closeBtn = document.createElement("button");
  Object.assign(closeBtn.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    fontSize: "18px",
    padding: "10px 16px",
    background: "#222",
    color: "white",
    border: "2px solid white",
    cursor: "pointer",
    borderRadius: "6px",
    zIndex: "1000001"
  });
  closeBtn.textContent = "Close";
  closeBtn.onclick = () => overlay.remove();

function renderSlide() {
  const s = flatSlides[currentSlide];

  // Set text box position
  textBox.setAttribute("x", s.position.x);
  textBox.setAttribute("y", s.position.y);
  textBox.setAttribute("width", s.position.width);
  textBox.setAttribute("height", s.position.height);

  // Set background image based on slide
  if (s.title === "Credits") {
    bg.setAttributeNS(null, "href", "https://i.imgur.com/jtvzKsw.png");
  } else if (currentSlide >= 1 && currentSlide <= 6) {
    bg.setAttributeNS(null, "href", "https://i.imgur.com/Efc9W3m.png");
  } else {
    bg.setAttributeNS(null, "href", "https://i.imgur.com/pzJsulV.png");
  }

  // Remove old injected image if any
  const oldInjected = document.getElementById("custom-slide-img");
  if (oldInjected) oldInjected.remove();

  // Inject image if slide has customImage metadata
  const slideData = slideGroups[s.groupIndex].slides[s.slideOffset];
  if (slideData.customImage) {
    const { href, x, y, width, height } = slideData.customImage;
    const imgEl = document.createElementNS(svgNS, "image");
    imgEl.setAttribute("id", "custom-slide-img");
    imgEl.setAttributeNS(null, "href", href);
    imgEl.setAttribute("x", x);
    imgEl.setAttribute("y", y);
    imgEl.setAttribute("width", width);
    imgEl.setAttribute("height", height);
    slideGroup.insertBefore(imgEl, textBox);
  }

  html.innerHTML = `
    <h2 style="margin-top:0; color: gold;">${s.title}</h2>
    ${s.content}
  `;
}


  renderSlide();
  overlay.appendChild(svg);
  overlay.appendChild(closeBtn);
  overlay.appendChild(sidebar);
  document.body.appendChild(overlay);
})();
