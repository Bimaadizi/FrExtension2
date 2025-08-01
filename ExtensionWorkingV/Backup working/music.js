// music.js v7 - Shuffle Fixes w/ Filename Compare, UI polish

let currentState = {
  track: null,
  background: null,
  soundbite: null,
};

let audioObjects = {
  track: null,
  background: null,
  soundbite: null,
};

let lastPlayed = {
  track: null,
  background: null,
  soundbite: null,
};

let soundbiteInterval = null;
let masterVolume = 1.0;

const audioFolders = {
  track: "Audio/Theme",
  background: "Audio/Backing Tracks",
  soundbite: "Audio/Sound Bites",
};

const categories = {
  track: [
    "Beauty", "Boss", "City", "Cold", "Combat", "Desert", "EpicMusic", "Hell",
    "Night", "Ominous", "Religion", "Solemn", "Tavern", "Tension", "Underdark",
    "Whimsical", "Wilderness", "None"
  ],
  background: [
    "AmbientFire", "Cave", "CityWallaNight", "ConversationWalla", "CrowdedWalla",
    "Forest", "ForestNight", "ForestOminous", "MarketWalla", "Nautical",
    "RagingFire", "Rain", "Train", "Waterfall", "Wind", "None"
  ],
  soundbite: [
    "Armor", "BarkerAdvertiser", "Bartender", "Bat", "Bow", "Collapsing",
    "Coughing", "Creaking", "Door", "Drink", "Drunkard", "EtherealWhisper",
    "FarmAnimals", "Footsteps", "GhoulGhastGhost", "GhoulGhasts", "Horse",
    "IndustrialClamor", "MenWorking", "Monster", "Rat", "Rummaging", "SmallWalla",
    "StrangersFighting", "Sword", "VagueExclaimations", "Wail", "WaterDripping",
    "Zombie", "None"
  ],
};

// 🔥🔥🔥 >>>> UPDATE YOUR VARIANT COUNTS HERE!!! 👇👇👇 <<<< 🔥🔥🔥
const categoryCounts = {
track: {
  Beauty: 2,
  Boss: 2,
  City: 13,
  Cold: 7,
  Combat: 10,
  Desert: 13,
  EpicMusic: 10,
  Hell: 4,
  Night: 8,
  Ominous: 1,
  Religion: 5,
  Solemn: 13,
  Tavern: 14,
  Tension: 10,
  Underdark: 10,
  Whimsical: 2,
  Wilderness: 12,
},
background: {
  AmbientFire: 2,
  Cave: 11,
  CityWallaNight: 10,
  ConversationWalla: 2,
  CrowdedWalla: 5,
  Forest: 6,
  ForestNight: 9,
  ForestOminous: 1,
  MarketWalla: 16,
  Nautical: 7,
  RagingFire: 2,
  Rain: 6,
  Train: 2,
  Waterfall: 1,
  Wind: 1,
},
soundbite: {
  Armor: 4,
  BarkerAdvertiser: 10,
  Bartender: 6,
  Bat: 3,
  Bow: 3,
  Collapsing: 2,
  Coughing: 3,
  Creaking: 2,
  Door: 19,
  Drink: 3,
  Drunkard: 7,
  EtherealWhisper: 6,
  FarmAnimals: 7,
  Footsteps: 7,
  GhoulGhasts: 29,
  Horse: 14,
  MenWorking: 18,
  Monster: 15,
  Rat: 4,
  Rummaging: 7,
  SmallWalla: 13,
  StrangersFighting: 2,
  Sword: 13,
  VagueExclaimations: 23,
  WaterDripping: 2,
  Zombie: 25,
},
};
// 🔥🔥🔥 >>>> END OF VARIANT COUNT ZONE 😎 <<<< 🔥🔥🔥

function getAudioTagMatches() {
  const regex = /\[\[\[?AUDIO:([^\]]+)\]\]?\]/gi;
  const paragraphs = Array.from(document.querySelectorAll("p, span, div"));
  const matches = [];

  paragraphs.forEach(p => {
    const match = regex.exec(p.textContent);
    if (match) {
      const parsed = Object.fromEntries(match[1].split(';').map(pair => {
        const [k, v] = pair.split('=');
        return [k.trim().toLowerCase(), v.trim()];
      }));
      matches.push(parsed);
    }
  });

  return matches.length > 0 ? matches[matches.length - 1] : null;
}

function getAvailableTracks(type, category) {
  const basePath = `${audioFolders[type]}/${category}/`;
  const count = categoryCounts[type]?.[category] || 1;
  return Array.from({ length: count }, (_, i) => chrome.runtime.getURL(`${basePath}${category}${i + 1}.mp3`));
}

function basename(path) {
  return path.split("/").pop();
}

function playAudio(type, category, forceDifferent = false) {
  if (!category || !categories[type].includes(category)) return;

  const sources = getAvailableTracks(type, category);
  let src;
  let attempts = 0;
  do {
    src = sources[Math.floor(Math.random() * sources.length)];
    attempts++;
    if (attempts > 10) break; // avoid infinite loop
  } while (forceDifferent && basename(lastPlayed[type]) === basename(src) && sources.length > 1);

  if (audioObjects[type]) {
    audioObjects[type].pause();
    audioObjects[type] = null;
  }

  const audio = new Audio(src);
  const individualVol = parseFloat(document.getElementById(`vol-${type}`)?.value || 0.5);
  audio.volume = individualVol * masterVolume;
  audio.loop = (type !== "soundbite");
  audio.play().catch(err => console.error(`Failed to play ${type}:`, err));
  audioObjects[type] = audio;
  lastPlayed[type] = src;

  updateTrackLabel(type, src);
}

function setupSoundbiteRandom(category) {
  if (soundbiteInterval) clearInterval(soundbiteInterval);
  soundbiteInterval = setInterval(() => {
    shuffleAudio("soundbite", true);
  }, Math.floor(Math.random() * 15000) + 10000);
}

function updateTrackLabel(type, filename) {
  const label = document.getElementById(`label-${type}`);
  if (label) label.textContent = `${type.toUpperCase()}: ${basename(filename)}`;
}

function updateFromLatestTag() {
  const match = getAudioTagMatches();
  if (!match) return;

  ["track", "background", "soundbite"].forEach(type => {
    if (!match[type]) return;
    if (currentState[type]?.toLowerCase() !== match[type].toLowerCase()) {
      console.log(`New ${type}: ${match[type]}`);
      currentState[type] = match[type];
      playAudio(type, match[type]);
      if (type === "soundbite" && document.getElementById("soundbite-random")?.checked) {
        setupSoundbiteRandom(match[type]);
      }
    }
  });
}

function shuffleAudio(type, forceDifferent = true) {
  if (!currentState[type]) return;
  console.log(`🔀 Shuffling ${type} category: ${currentState[type]}`);
  playAudio(type, currentState[type], forceDifferent);
}

function createPlayerUI() {
  const container = document.createElement("div");
  container.id = "fr-music-box";
  container.style = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: url('${chrome.runtime.getURL("musicbg.jpg")}') no-repeat center center / cover;
    color: white;
    padding: 12px;
    border: 2px solid #555;
    resize: both;
    overflow: auto;
    z-index: 9999;
    font-family: sans-serif;
    width: 270px;
    cursor: default;
    border-radius: 0px;
    box-shadow: 0 0 10px rgba(0,0,0,0.6);
  `;

  container.innerHTML = `
    <div id="drag-handle" style="cursor: grab; font-weight: bold; margin-bottom: 8px;">
      Audio Panel <button id="minimize-music" style="float:right;background:none;border:none;color:white;font-size:16px;cursor:pointer;">–</button>
    </div>
    <div id="label-track">TRACK: --</div>
    <div id="label-background">BACKGROUND: --</div>
    <div id="label-soundbite">SOUNDBITE: --</div>
    <label><input type="checkbox" id="soundbite-random"> Random Play</label><br/><br/>
    <details>
      <summary style="cursor:pointer;">Volume</summary>
      <label>Master <input type="range" id="vol-master" min="0" max="1" step="0.01" value="1.0"></label><br/>
      <label>Track <input type="range" id="vol-track" min="0" max="1" step="0.01" value="0.5"></label><br/>
      <label>Background <input type="range" id="vol-background" min="0" max="1" step="0.01" value="0.5"></label><br/>
      <label>Soundbite <input type="range" id="vol-soundbite" min="0" max="1" step="0.01" value="0.5"></label>
    </details>
  `;

  document.body.appendChild(container);

  // ▶️ Add maximize (+) button (initially hidden)
  const maxBtn = document.createElement("button");
  maxBtn.id = "maximize-music";
  maxBtn.textContent = "+";
  maxBtn.title = "Show Music Panel";
  maxBtn.style = `
    display: none;
    position: fixed !important;
    top: 130px;
    left: 10px;
    z-index: 100000;
    padding: 4px 8px;
    font-size: 18px;
    background: rgba(0, 255, 0, 0.2);
    color: white;
    border: 1px solid rgba(0, 255, 0, 0.4);
    border-radius: 3px;
    cursor: pointer;
    font-family: sans-serif;
  `;
  document.body.appendChild(maxBtn);

  // Toggle hide/show
  document.getElementById("minimize-music").onclick = () => {
    container.style.display = "none";
    maxBtn.style.display = "block";
  };
  maxBtn.onclick = () => {
    container.style.display = "block";
    maxBtn.style.display = "none";
  };

  // 🎨 Range styling
  const style = document.createElement("style");
  style.textContent = `
    #fr-music-box input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      background: transparent;
      height: 6px;
      border: 1px solid gold;
      border-radius: 0;
    }
    #fr-music-box input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      background: red;
      width: 14px;
      height: 14px;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      cursor: pointer;
      border: 1px solid gold;
    }
    #fr-music-box input[type="range"]::-moz-range-thumb {
      background: red;
      width: 14px;
      height: 14px;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      cursor: pointer;
      border: 1px solid gold;
    }
    #fr-music-box input[type="range"]::-webkit-slider-runnable-track {
      background: transparent;
    }
    #fr-music-box input[type="range"]::-moz-range-track {
      background: transparent;
    }
  `;
  document.head.appendChild(style);

  // 🎚 Hook up volume sliders
  ["track", "background", "soundbite"].forEach(type => {
    document.getElementById(`vol-${type}`).addEventListener("input", (e) => {
      if (audioObjects[type]) audioObjects[type].volume = parseFloat(e.target.value) * masterVolume;
    });
  });

  document.getElementById("vol-master").addEventListener("input", (e) => {
    masterVolume = parseFloat(e.target.value);
    ["track", "background", "soundbite"].forEach(type => {
      const vol = parseFloat(document.getElementById(`vol-${type}`)?.value || 0.5);
      if (audioObjects[type]) audioObjects[type].volume = vol * masterVolume;
    });
  });
}
createPlayerUI();
function makeDraggable(el, handle) {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.position = "fixed";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });
}

makeDraggable(document.getElementById("fr-music-box"), document.getElementById("drag-handle"));

setInterval(updateFromLatestTag, 3000);
console.log("✅ Shuffle now compares filenames, UI cursor and edge radius updated");
