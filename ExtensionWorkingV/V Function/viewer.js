let lastLink = "";

function getLatestCharacterLink() {
  const paragraphs = Array.from(document.querySelectorAll("p"));
  const matches = paragraphs
    .map(p => p.textContent.trim())
    .filter(text => text.includes("http://bimaadizi.github.io/F/"));

  console.log(`🔍 Scanned ${paragraphs.length} paragraphs, found ${matches.length} link(s).`);

  return matches.length > 0 ? matches[matches.length - 1] : null;
}

function parseCharacterData(url) {
  console.log("🧩 Parsing character URL:", url);
  const params = new URLSearchParams(new URL(url).search);
  const sanitize = (val) =>
    val ? decodeURIComponent(val).replace(/-+$/, "").replace(/_/g, " ") : "--";

  const data = {
    type: "update-character",
    link: url,
    name: sanitize(params.get("name")),
    race: sanitize(params.get("race")),
    class: sanitize(params.get("class")),
    alignment: sanitize(params.get("alignment")),
    level: sanitize(params.get("level")),
    exp: sanitize(params.get("exp")),
    hp: sanitize(params.get("hp")),
    str: sanitize(params.get("str")),
    dex: sanitize(params.get("dex")),
    con: sanitize(params.get("con")),
    int: sanitize(params.get("int")),
    wis: sanitize(params.get("wis")),
    cha: sanitize(params.get("cha")),
  };

  console.log("✅ Parsed character data:", data);
  return data;
}

function sendToUI(data) {
  const iframe = document.querySelector("iframe[src*='ui.html']");
  if (!iframe) {
    console.warn("⚠️ UI iframe not found in DOM. Aborting send.");
    return;
  }

  if (iframe.contentWindow) {
    console.log("📤 Sending character data to UI iframe:", data);
    iframe.contentWindow.postMessage(data, "*");
  } else {
    console.warn("⚠️ iframe.contentWindow not ready. Adding load event.");
    iframe.addEventListener("load", () => {
      console.log("📤 Sending data after iframe load:", data);
      iframe.contentWindow.postMessage(data, "*");
    });
  }
}

async function checkForNewLink() {
  console.log("🔄 Running checkForNewLink...");

  const latestLink = getLatestCharacterLink();

  if (!latestLink) {
    console.log("❌ No character link found.");
    return;
  }

  if (latestLink === lastLink) {
    console.log("🟰 No new character link detected.");
    return;
  }

  console.log("🆕 New character link detected:", latestLink);
  lastLink = latestLink;

  // Delay before parsing/sending
  await new Promise(resolve => setTimeout(resolve, 1200));

  const data = parseCharacterData(latestLink);
  sendToUI(data);
}

// Start polling
setInterval(checkForNewLink, 3000);
console.log("✅ viewer.js loaded and interval started.");

window.addEventListener("message", (event) => {
  if (event.data?.request === "characterData") {
    console.log("↩️ Received characterData request from iframe. Rechecking...");
    checkForNewLink();
  }
});
