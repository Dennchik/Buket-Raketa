// 🚀 Основная функция инициализации кнопок-опций и кнопки сброса
export function initButtons() {
  // 🎯 Находим все блоки-обёртки опций (каждый label с классом choice-block__option)
  const labels = document.querySelectorAll('.choice-block__option');

  // 🔄 Проходим по каждому label и настраиваем синхронизацию
  labels.forEach((label) => {
    // 📦 Ищем внутри label нативный чекбокс
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (!checkbox) return; // ⚠️ Если чекбокса нет – пропускаем

    // 🎨 Устанавливаем начальное состояние aria-pressed в соответствии с состоянием чекбокса
    // (true – нажат, false – не нажат)
    label.setAttribute('aria-pressed', checkbox.checked);

    // 👂 Слушаем событие 'change' на чекбоксе (клик по label или по самому чекбоксу)
    checkbox.addEventListener('change', () => {
      // 🔄 При изменении состояния чекбокса обновляем aria-pressed у родительского label
      label.setAttribute('aria-pressed', checkbox.checked);
    });
  });

  // 🧹 Находим кнопку сброса (у неё отдельный класс .reset-button)
  const resetBtn = document.querySelector('.reset-button');
  if (!resetBtn) return;

  // 🖱️ Навешиваем обработчик клика на кнопку сброса
  resetBtn.addEventListener('click', (e) => {
    // 🛡️ Проверка на случай, если кнопка вдруг не найдена (защита от ошибок)

    // 🔁 Перебираем все опции и сбрасываем их состояние
    document.querySelectorAll('.choice-block__option').forEach((label) => {
      const checkbox = label.querySelector('input[type="checkbox"]');
      if (checkbox) {
        // ✅ Устанавливаем aria-pressed=false для каждой опции (визуально "отжато")
        label.setAttribute('aria-pressed', 'false');
        // 💡 Примечание: сам чекбокс здесь не снимаем,
        // т.к. форма сбрасывается стандартным reset'ом
        // (кнопка сброса не мешает, мы лишь синхронизируем aria-pressed)
      }
    });
  });
}
