document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("message", (event) => {
    console.log("👂 listener.js received message:", event.data);

    if (event.data?.type === "update-character") {
      console.log("📥 UI received character data:", event.data);

      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val ?? "--";
        else console.warn(`⚠️ Element with id "${id}" not found.`);
      };

      const data = event.data;

      // Character Info
      set("char-name", data.name);
      set("char-race", data.race);
      set("char-class", data.class);
      set("char-alignment", data.alignment);
      set("char-level", data.level);
      set("char-exp", data.exp);
      set("char-hp", data.hp);

      // Stats
      set("char-str", data.str);
      set("char-dex", data.dex);
      set("char-con", data.con);
      set("char-int", data.int);
      set("char-wis", data.wis);
      set("char-cha", data.cha);
    }
  });
});
