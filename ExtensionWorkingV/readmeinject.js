// injectReadme.js
(function () {
  if (document.getElementById("__readme_overlay")) return; // prevent duplicates

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("readme.html");
  iframe.id = "__readme_overlay";
  iframe.style.position = "fixed";
  iframe.style.top = 0;
  iframe.style.left = 0;
  iframe.style.width = "100vw";
  iframe.style.height = "100vh";
  iframe.style.zIndex = "999999";
  iframe.style.border = "none";

  document.body.appendChild(iframe);
})();
