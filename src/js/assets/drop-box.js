import ItcCollapse from './collapse';

export default function dropBoxColapse() {
  const items = document.querySelectorAll('.toggle-box');
  if (items.length === 0) return;

  // Массив для хранения данных активных элементов (чтобы отключать их)
  let instances = [];

  // Внутренняя функция переключения (аккордеон)
  const _toggleItem = (data) => {
    const { item, collapse, textSpan } = data;

    if (item.classList.contains('_open')) {
      item.classList.remove('_open');
      collapse.toggle();
      if (textSpan) textSpan.textContent = 'открыть';
    } else {
      item.classList.add('_open');
      collapse.toggle();
      if (textSpan) textSpan.textContent = 'закрыть';
    }
  };

  // ФУНКЦИЯ ВКЛЮЧЕНИЯ (Для мобилки)
  const enable = () => {
    if (instances.length > 0) return; // Защита от повторного включения

    items.forEach((item) => {
      const collapseEl = item.querySelector('._collapse');
      const trigger = item.querySelector('._toggle-button');
      const closeButtonDrop = item.querySelector(
        '.dropdown-block__close-button'
      );
      const textSpan = item.querySelector(
        '.catalog-filter__close-button span:last-child'
      );

      // Инициализируем плагин
      const collapse = new ItcCollapse(collapseEl);

      // Сохраняем все в объект для текущего блока
      const data = {
        item,
        collapse,
        collapseEl,
        textSpan,
        trigger,
        closeButtonDrop,
      };

      // Обработчики кликов
      const onTriggerClick = () => {
        const openedData = instances.find((inst) =>
          inst.item.classList.contains('_open')
        );

        _toggleItem(data);

        // Закрываем соседей
        if (openedData && openedData !== data) {
          _toggleItem(openedData);
        }
      };

      const onCloseBtnClick = () => {
        _toggleItem(data);
      };

      // Вешаем события
      if (trigger) trigger.addEventListener('click', onTriggerClick);
      if (closeButtonDrop)
        closeButtonDrop.addEventListener('click', onCloseBtnClick);

      // Сохраняем ссылки на функции, чтобы потом снять события
      data.onTriggerClick = onTriggerClick;
      data.onCloseBtnClick = onCloseBtnClick;

      instances.push(data);
    });
  };

  // ФУНКЦИЯ ОТКЛЮЧЕНИЯ (Для десктопа)
  const disable = () => {
    instances.forEach((inst) => {
      // 1. Удаляем слушатели кликов
      if (inst.trigger)
        inst.trigger.removeEventListener('click', inst.onTriggerClick);
      if (inst.closeButtonDrop)
        inst.closeButtonDrop.removeEventListener('click', inst.onCloseBtnClick);

      // 2. Сбрасываем классы и возвращаем дефолтный текст
      inst.item.classList.remove('_open');
      if (inst.textSpan) inst.textSpan.textContent = 'открыть';

      // 3. Жестко очищаем inline-стили, которые ItcCollapse повесил при работе
      inst.collapseEl.classList.remove('_show', 'collapse_show', 'collapsing');
      inst.collapseEl.style.height = '';
      inst.collapseEl.style.display = '';

      // Если у вашего плагина есть метод очистки (зависит от версии), можно вызвать:
      // if (inst.collapse.destroy) inst.collapse.destroy();
    });

    // Очищаем массив, так как скрипт отключен
    instances = [];
  };

  // --- ЛОГИКА ОТСЛЕЖИВАНИЯ РАЗМЕРА ЭКРАНА ---

  // (max-width: 819px) - это аналог window.innerWidth < 820
  const mediaQuery = window.matchMedia('(max-width: 819px)');

  const handleScreenChange = (e) => {
    if (e.matches) {
      enable(); // Экран меньше 820 -> включаем аккордеон
    } else {
      disable(); // Экран 820 и больше -> отключаем и сбрасываем стили
    }
  };

  // 1. Проверяем состояние при первой загрузке страницы
  handleScreenChange(mediaQuery);

  // 2. Вешаем слушатель, который будет срабатывать при каждом ресайзе/повороте
  mediaQuery.addEventListener('change', handleScreenChange);
}
