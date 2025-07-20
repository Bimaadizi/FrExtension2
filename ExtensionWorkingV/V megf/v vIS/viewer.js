window.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "CHARACTER_LINK") return;

  const url = new URL(event.data.url);
  const params = new URLSearchParams(url.search);

  const content = document.getElementById("content");
  content.innerHTML = "";

  const fields = [
    "name", "race", "class", "alignment",
    "level", "exp", "hp", "str", "dex", "con", "int", "wis", "cha"
  ];

  fields.forEach(key => {
    const value = params.get(key);
    if (value) {
      const div = document.createElement("div");
      div.className = "stat";
      div.innerHTML = `<span class="label">${key.toUpperCase()}:</span><span>${value}</span>`;
      content.appendChild(div);
    }
  });
});
