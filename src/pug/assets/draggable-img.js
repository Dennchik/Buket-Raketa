export function draggableImage(params) {
  const container = document.querySelector('.section-map__image-map');
  const img = container.querySelector('.draggable-img');

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let minX = 0;
  let minY = 0;

  // ❗ Ждём загрузки картинки, чтобы знать её размеры
  if (img.complete) {
    calculateBounds();
  } else {
    img.onload = calculateBounds;
  }

  // Пересчёт границ при ресайзе
  window.addEventListener('resize', calculateBounds);

  function calculateBounds() {
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    minX = containerRect.width - imgRect.width;
    minY = containerRect.height - imgRect.height;

    // если картинка меньше контейнера — центрируем и блокируем ось
    if (minX > 0) minX = 0;
    if (minY > 0) minY = 0;

    currentX = Math.max(minX, Math.min(0, currentX));
    currentY = Math.max(minY, Math.min(0, currentY));

    updatePosition();
  }

  function updatePosition() {
    img.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }

  // ===================
  // 🖱️ MOUSE
  // ===================

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    container.classList.add('grabbing');

    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    container.classList.remove('grabbing');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    currentX = Math.max(minX, Math.min(0, currentX));
    currentY = Math.max(minY, Math.min(0, currentY));

    updatePosition();
  });

  // ===================
  // 📱 TOUCH
  // ===================

  container.addEventListener(
    'touchstart',
    (e) => {
      const touch = e.touches[0];
      isDragging = true;

      startX = touch.clientX - currentX;
      startY = touch.clientY - currentY;
    },
    { passive: true }
  );

  container.addEventListener('touchend', () => {
    isDragging = false;
  });

  container.addEventListener(
    'touchmove',
    (e) => {
      if (!isDragging) return;

      const touch = e.touches[0];

      currentX = touch.clientX - startX;
      currentY = touch.clientY - startY;

      currentX = Math.max(minX, Math.min(0, currentX));
      currentY = Math.max(minY, Math.min(0, currentY));

      updatePosition();
    },
    { passive: true }
  );

  // 🚫 отключаем стандартный drag изображения браузером
  img.addEventListener('dragstart', (e) => e.preventDefault());
}
