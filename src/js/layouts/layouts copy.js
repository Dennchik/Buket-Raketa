import IMask from 'imask';

export function maskPhone(selector) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return; // Убедитесь, что элементы существуют

  elements.forEach((element) => {
    let mask = null;

    // Функция для инициализации маски
    function initializeMask() {
      mask = IMask(element, {
        mask: '+7 (000) 000-00-00',
        lazy: true, // Показывать маску только при фокусе
      });
      mask.updateValue(); // Сразу обновляем значение маски
    }

    // При фокусе на поле ввода, показываем маску
    element.addEventListener('focus', function () {
      if (!mask) {
        initializeMask(); // Инициализируем маску только при первом фокусе
      }
      if (element.value === '') {
        element.value = '+7 '; // Устанавливаем начальное значение
      }
      mask.updateValue(); // Обновляем значение маски
    });

    // При потере фокуса, если поле пустое, очищаем его
    element.addEventListener('blur', function () {
      if (element.value.trim() === '+7') {
        element.value = ''; // Очищаем поле
        if (mask) {
          mask.updateValue(''); // Очищаем маску
        }
      }
    });
  });
}

export function showButton() {
  const productsCarts = document.querySelectorAll('.products-cart');
  let activeElement = null;

  // Функция закрытия элемента
  function closeElement(element) {
    if (!element) return;
    const image = element.querySelector('.products-cart__image');
    const button = element.querySelector('.products-cart__button-by');
    image.style.maxHeight = '295px';
    button.style.marginTop = '-57px';
    element.classList.remove('active'); // Удаляем класс
    activeElement = null;
  }

  // Функция открытия элемента
  function openElement(element) {
    if (!element) return;
    const image = element.querySelector('.products-cart__image');
    const button = element.querySelector('.products-cart__button-by');
    image.style.maxHeight = '235px';
    button.style.marginTop = '0';
    element.classList.add('active'); // Добавляем класс
    activeElement = element;
  }

  // Закрытие при клике вне элементов
  document.addEventListener('click', (event) => {
    // Проверяем, был ли клик на исключенных элементах
    const isCartButton =
      event.target.closest('.products-cart__button-cart') ||
      event.target.closest('.products-cart__button-by');

    if (isCartButton) {
      // Если кликнули на кнопки - не закрываем
      return;
    }

    let clickedOnCart = false;

    productsCarts.forEach((cart) => {
      if (cart.contains(event.target)) {
        clickedOnCart = true;
      }
    });

    if (!clickedOnCart && activeElement) {
      closeElement(activeElement);
    }
  });

  // Обработчики кликов по элементам
  productsCarts.forEach((productsCart) => {
    productsCart.addEventListener('click', (event) => {
      // Проверяем, не кликнули ли на исключенные кнопки
      const isCartButton =
        event.target.closest('.products-cart__button-cart') ||
        event.target.closest('.products-cart__button-by');

      if (isCartButton) {
        // Если кликнули на кнопки - не обрабатываем открытие/закрытие
        // Кнопки будут работать по своей логике (добавление в корзину/покупка)
        return;
      }

      event.stopPropagation();

      // Если кликнули на уже активный элемент - закрываем
      if (activeElement === productsCart) {
        closeElement(productsCart);
        return;
      }

      // Закрываем предыдущий активный элемент
      if (activeElement) {
        closeElement(activeElement);
      }

      // Открываем новый элемент
      openElement(productsCart);
    });
  });
}

export function shadowScrollHeader() {
  const handleScroll = () => {
    const headerMain = document.querySelector('.header');
    const pageContainer = document.querySelector('.page__main-content');
    const pageContainerTop = pageContainer.getBoundingClientRect().top;

    if (headerMain) {
      if (pageContainerTop < -50) {
        headerMain.classList.add('with-shadow');
      } else if (pageContainerTop <= 0) {
        headerMain.classList.remove('with-shadow');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Очистка слушателя событий при размонтировании компонента
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}
//* - [ реализация с drag-and-drop функционала ] -
export function dragAndDrop() {
  const form = document.getElementById('bouquet-form');
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('bouquet-upload');
  const previewContainer = document.querySelector('.card__preview');
  const previewImage = document.querySelector('.card__preview-image');
  const changeButton = document.querySelector('.card__preview-change');
  const removeButton = document.querySelector('.card__preview-remove');
  const textarea = document.getElementById('bouquet-wishes');
  const charCount = document.getElementById('char-count');
  const fileDataInput = document.getElementById('file-data');
  const successMessage = document.querySelector('.success-message');
  const errorMessage = document.querySelector('.error-message');
  const progressBar = document.createElement('div');

  let uploadedFile = null;

  // Создаем прогресс-бар
  progressBar.className = 'card__progress-bar';
  const progressContainer = document.createElement('div');
  progressContainer.className = 'card__progress';
  progressContainer.appendChild(progressBar);
  uploadArea.parentNode.insertBefore(progressContainer, uploadArea.nextSibling);

  // 1. Счетчик символов для текстовой области
  textarea.addEventListener('input', function () {
    const length = this.value.length;
    charCount.textContent = length;

    if (length > 500) {
      this.value = this.value.substring(0, 500);
      charCount.textContent = 500;
      charCount.style.color = '#e74c3c';
    } else if (length > 450) {
      charCount.style.color = '#e74c3c';
    } else {
      charCount.style.color = '#333';
    }
  });

  // 2. Drag-and-drop функционал
  uploadArea.addEventListener('click', function (e) {
    if (!e.target.closest('.card__preview-actions')) {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', handleFileSelect);

  uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  });

  // 3. Кнопки управления фото
  changeButton.addEventListener('click', function () {
    fileInput.click();
  });

  removeButton.addEventListener('click', function () {
    resetUpload();
    showUploadArea();
  });

  // 4. Отправка формы
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Скрываем предыдущие сообщения
    hideMessages();

    // Валидация
    if (!uploadedFile && !textarea.value.trim()) {
      showError('Пожалуйста, загрузите фото или напишите пожелания');
      uploadArea.classList.add('error');
      textarea.classList.add('error');
      return;
    }

    // Убираем ошибки
    uploadArea.classList.remove('error');
    textarea.classList.remove('error');

    // Подготовка данных формы
    const formData = new FormData(form);

    // Если есть файл, добавляем его
    if (uploadedFile) {
      formData.append('bouquet_photo', uploadedFile);
    }

    // Добавляем timestamp
    formData.append('timestamp', new Date().toISOString());

    // Показываем прогресс
    progressContainer.style.display = 'block';
    simulateProgress();

    // Отправка на сервер
    submitForm(formData);
  });

  // Функции обработки
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      processFile(file);
    }
  }

  function validateFile(file) {
    if (!file.type.match('image.*')) {
      showError('Пожалуйста, выберите изображение (JPG, PNG, GIF)');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('Изображение должно быть меньше 10MB');
      return false;
    }

    return true;
  }

  function processFile(file) {
    const reader = new FileReader();

    reader.onloadstart = function () {
      progressContainer.style.display = 'block';
    };

    reader.onprogress = function (e) {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        progressBar.style.width = percent + '%';
      }
    };

    reader.onload = function (event) {
      previewImage.src = event.target.result;
      uploadedFile = file;

      // Сохраняем данные файла в скрытое поле
      fileDataInput.value = JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      });

      // Показываем превью
      previewContainer.style.display = 'block';
      uploadArea.style.display = 'none';
      progressContainer.style.display = 'none';

      showSuccess('✓ Фото успешно загружено!');
    };

    reader.onerror = function () {
      showError('Ошибка при чтении файла');
      progressContainer.style.display = 'none';
    };

    reader.readAsDataURL(file);
  }

  function resetUpload() {
    fileInput.value = '';
    previewImage.src = '';
    uploadedFile = null;
    fileDataInput.value = '';
    previewContainer.style.display = 'none';
  }

  function showUploadArea() {
    uploadArea.style.display = 'flex';
  }

  function submitForm(formData) {
    // Здесь реальный запрос на сервер
    fetch('/api/submit-bouquet-request', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        progressContainer.style.display = 'none';

        if (data.success) {
          showSuccessMessage(
            'Ваша заявка отправлена! Флорист свяжется с вами в течение 15 минут.'
          );
          form.reset();
          resetUpload();
          showUploadArea();
          textarea.value = '';
          charCount.textContent = '0';
          charCount.style.color = '#333';
        } else {
          showError(data.message || 'Ошибка при отправке формы');
        }
      })
      .catch((error) => {
        progressContainer.style.display = 'none';
        showError('Ошибка соединения. Пожалуйста, попробуйте еще раз.');
        console.error('Ошибка:', error);
      });
  }

  // Вспомогательные функции
  function simulateProgress() {
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 90) {
        clearInterval(interval);
      } else {
        width += 10;
        progressBar.style.width = width + '%';
      }
    }, 100);
  }

  function showSuccessMessage(text) {
    successMessage.querySelector('.message-text').textContent = text;
    successMessage.style.display = 'flex';
    errorMessage.style.display = 'none';

    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }

  function showError(text) {
    errorMessage.querySelector('.message-text').textContent = text;
    errorMessage.style.display = 'flex';
    successMessage.style.display = 'none';

    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }

  function hideMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
  }

  function showSuccess(text) {
    const successMsg = document.createElement('div');
    successMsg.className = 'card__upload-success';
    successMsg.innerHTML = text;
    successMsg.style.display = 'block';

    previewContainer.parentNode.insertBefore(
      successMsg,
      previewContainer.nextSibling
    );

    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 3000);
  }
}
//* - [ Управление переключением меню ] -
export function sidebarMenuHandle() {
  const burgerButtons = document.querySelectorAll('.burger-button');
  const header = document.querySelector('.header');
  const sidebarMenu = document.querySelector('.sidebar-menu');

  burgerButtons.forEach((burgerButton) => {
    burgerButton.addEventListener('click', () => {
      burgerButton.classList.toggle('is-active');

      if (burgerButton.classList.contains('is-active')) {
        toggleSidebarMenu(sidebarMenu);
        header.classList.add('with-shadow');
      } else if (!burgerButton.classList.contains('is-active')) {
        toggleSidebarMenu(sidebarMenu);
        header.classList.remove('with-shadow');
      }
    });
  });

  window.addEventListener('resize', () => {
    burgerButtons.forEach((burgerButton) => {
      if (burgerButton.classList.contains('is-active')) {
        document.body.classList.remove('no-scroll');
        sidebarMenu.classList.remove('_open-menu');
        burgerButton.classList.remove('is-active');
      }
    });
  });
}

export function toggleSidebarMenu(sidebarMenu) {
  const asideButton = document.querySelector('.page__aside-button');
  if (sidebarMenu.classList.contains('_open-menu')) {
    //* Компенсируем исчезновение scroll bar (если нужно)
    sidebarMenu.style.transition = 'transform 0.3s ease';
    sidebarMenu.classList.remove('_open-menu');

    resetScrollbarOffset();
    document.body.classList.remove('no-scroll');
    resetTransitionOnce(sidebarMenu);

    if (asideButton) {
      setTimeout(() => {
        asideButton.style.opacity = '1';
        asideButton.style.transition = 'opacity 0.3s ease';
        asideButton.style.pointerEvents = 'all';
      }, 300);
    }
  } else {
    if (asideButton) {
      asideButton.style.opacity = '0';
      asideButton.style.transition = 'opacity 0.3s ease';
      asideButton.style.pointerEvents = 'none';
    }

    sidebarMenu.style.transition = 'transform 0.3s ease';
    sidebarMenu.classList.add('_open-menu');

    handleScrollbarOffset(sidebarMenu);
    document.body.classList.add('no-scroll');
    resetTransitionOnce(sidebarMenu);
  }

  function resetTransitionOnce(element) {
    function transitionEndHandler() {
      element.style.transition = '';
      element.removeEventListener('transitionend', transitionEndHandler);
    }

    element.addEventListener('transitionend', transitionEndHandler);
  }
}

//* - [Компенсируем отступы при открытии Modal]
const pageHeader = document.querySelector('.page__header');
export function handleScrollbarOffset(el) {
  let scrollY = 0;
  //* запоминаем текущее положение прокрутки
  scrollY = window.scrollY || document.documentElement.scrollTop;
  document.documentElement.style.setProperty(
    '--scroll-position',
    `${scrollY}px`
  );

  //* Компенсируем исчезновение scroll bar (если нужно)
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (el) {
      el.style.paddingRight = `${scrollbarWidth}px`;
      pageHeader.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
}

//* - [ Управление открытием модальных окон ]
export function toggleModal() {
  const modals = [
    {
      triggerSelector: '.button-request',
      modalSelector: '.request-form',
    },
    {
      triggerSelector: '.ordercall-button',
      modalSelector: '.order-call-form',
    },
    {
      triggerSelector: '.button-question',
      modalSelector: '.questions-form',
    },
  ];

  modals.forEach(({ triggerSelector, modalSelector }) => {
    const modal = document.querySelector(modalSelector);
    const triggers = document.querySelectorAll(triggerSelector);
    const closeBtn = modal.querySelector('.btn-close');

    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        handleScrollbarOffset(modal);
        document.body.classList.add('no-scroll');
        modal.classList.add('is-open');

        if (modalSelector === '.questions-form') {
          const { showFieldset } = fieldsetsToggle(); // Получаем showFieldset
          showFieldset(0); // Активируем первый fieldset
        }
      });
    });

    closeBtn.addEventListener('click', () => {
      resetScrollbarOffset(modal);
      modal.classList.remove('is-open');
      document.body.classList.remove('no-scroll');

      if (modalSelector === '.questions-form') {
        const active = modal.querySelector(
          '.form-question__fieldset-table.active'
        );
        if (active) {
          active.classList.remove('active');
          console.log('Класс active удалён');
        } else {
          console.log('Нет активного fieldset');
        }
      }
    });
  });
}

//* - [Переключение полей формы]
export function fieldsetsToggle() {
  const container = document.querySelector('.form-question__content');
  const fieldsets = document.querySelectorAll(
    '.form-question .form-question__fieldset-table'
  );
  let current = 0;

  const updateContainerHeight = () => {
    const active = container.querySelector(
      '.form-question__fieldset-table.active'
    );
    if (active) {
      const height = active.offsetHeight;
      container.style.height = `${height}px`;
    }
  };

  const showFieldset = (index) => {
    fieldsets.forEach((fs) => fs.classList.remove('active'));
    fieldsets[index].classList.add('active');
    updateContainerHeight();
  };

  document.querySelectorAll('._btn-next button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (current < fieldsets.length - 1) {
        current++;
        showFieldset(current);
      }
    });
  });

  document.querySelectorAll('._btn-prev button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (current > 0) {
        current--;
        showFieldset(current);
      }
    });
  });

  return {
    showFieldset, // 👈 экспортируем
  };
}

//* - [ Устраняем смещение Content'a  ]
function resetScrollbarOffset(el) {
  document.documentElement.style.removeProperty('--scroll-position');

  if (el) {
    el.style.paddingRight = '';
    pageHeader.style.paddingRight = ``;
  }

  document.body.style.paddingRight = ''; // Убираем компенсацию scroll bar
  window.scrollTo(0, scrollY);
}

//* - [ Управление оповещением cookies ] -
export function cookiesAccept(el, trigger) {
  const cookiesAccept = document.querySelector(el);
  const button = document.querySelector(trigger);

  if (!cookiesAccept) {
    console.log('Элемент cookiesAccept не найден');
    return;
  }

  if (button) {
    button.addEventListener('click', () => {
      cookiesAccept.style.transform = 'translateY(100%)';
      cookiesAccept.style.transition = 'transform 0.5s ease';
    });
  } else {
    console.log('кнопка не найдена');
  }

  setTimeout(() => {
    cookiesAccept.style.transform = 'translateY(0)';
    cookiesAccept.style.transition = 'transform 0.5s ease';
  }, 3000);
}

//* - [ Запуск анимации lineMarquee (бегущей строки) ] -
export function lineMarquee(element) {
  const marquee = document.querySelector(element);
  if (!marquee) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          marquee.style.animationPlayState = 'running';
        } else {
          marquee.style.animationPlayState = 'paused';
        }
      });
    },
    {
      threshold: 0.1, // 10% блока видно → запуск
    }
  );

  observer.observe(marquee);
}
