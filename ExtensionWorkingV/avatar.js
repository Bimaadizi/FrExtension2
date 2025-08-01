// avatar.js

let currentChatId = null;
const AVATAR_PREFIX = "avatarPathForChat:";

function getAvatarKey(chatId) {
  return `${AVATAR_PREFIX}${chatId}`;
}

function setAvatar(src) {
  const avatarImg = document.getElementById("avatar");
  if (avatarImg) {
    const resolvedSrc = chrome.runtime.getURL(src);
    avatarImg.src = resolvedSrc;
    console.log(`[avatar.js] ✅ Avatar applied for chat ${currentChatId}: ${resolvedSrc}`);
  } else {
    console.warn("[avatar.js] ⚠️ Avatar image not found.");
  }
}

function loadCachedAvatar() {
  if (!currentChatId) {
    console.warn("[avatar.js] ⚠️ No chat ID. Cannot load avatar.");
    return;
  }

  const cached = localStorage.getItem(getAvatarKey(currentChatId));
  if (!cached) {
    console.log("[avatar.js] ℹ️ No avatar cached for chat:", currentChatId);
    return;
  }

  setAvatar(cached);
}

// Listen for chat ID and avatar selection
window.addEventListener("message", (event) => {
  const { type, chatId, src } = event.data || {};

  if (type === "SET_CHAT_ID" && chatId) {
    currentChatId = chatId;
    console.log("[avatar.js] ✅ Received chat ID:", currentChatId);
    loadCachedAvatar();
  }

  if (type === "SET_AVATAR" && src) {
    if (!currentChatId) {
      console.warn("[avatar.js] ⚠️ Cannot save avatar: chat ID not yet received");
      return;
    }
    localStorage.setItem(getAvatarKey(currentChatId), src);
    setAvatar(src);
  }
});

// Ask parent for the chat ID immediately
window.parent.postMessage({ type: "REQUEST_CHAT_ID" }, "*");
console.log("[avatar.js] 🚀 Requested chat ID from parent");

// Open overlay when avatar-toggle clicked
document.getElementById("avatar-toggle")?.addEventListener("click", () => {
  window.parent.postMessage({ type: "OPEN_AVATAR_OVERLAY" }, "*");
});
