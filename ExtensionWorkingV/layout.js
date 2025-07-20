document.addEventListener('DOMContentLoaded', () => {
  const modes = ['layout-dynamic', 'layout-grid', 'layout-horizontal', 'layout-vertical'];
  let currentMode = 0;
  const container = document.getElementById('sheet-container');
  const btn = document.getElementById('layout-toggle');

  // Apply initial layout
  container.classList.remove(...modes);
  container.classList.add(modes[currentMode]);
  console.log(`📐 Initial layout: ${modes[currentMode]}`);

  btn.addEventListener('click', () => {
    container.classList.remove(modes[currentMode]);
    currentMode = (currentMode + 1) % modes.length;
    container.classList.add(modes[currentMode]);
    console.log(`📐 Layout changed to: ${modes[currentMode]}`);
  });
});
