function getChatId() {
  const match = window.location.href.match(/chats\/(\d+)/);
  return match ? match[1] : null;
}

function injectIframe() {
  if (document.getElementById('spell-iframe')) return;

  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('iframe.html');
  iframe.id = 'spell-iframe';
  iframe.style = 'position:fixed;right:0;top:0;width:400px;height:100%;z-index:9999;border:none;';
  document.body.appendChild(iframe);
}

document.addEventListener('mouseup', () => {
  const selected = window.getSelection().toString().trim();
  if (selected) {
    chrome.runtime.sendMessage({ action: 'lookupSpell', text: selected, chatId: getChatId() });
  }
});

injectIframe();
