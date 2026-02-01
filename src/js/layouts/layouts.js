//* ✅ - [ реализация с drag-and-drop функционала ] -
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

//* ✅ - [ управление side-bar элементами ] -
export function sideBarLoyuts() {
  const menuList = document.querySelector('.menu-list');
  const burgerButtons = document.querySelectorAll('.burger-button');
  const listContent = document.querySelector('.page__menu-list');
  const buttons = document.querySelectorAll('.hamburger');
  const anchorLinks = menuList.querySelectorAll('.anchor-link');

  anchorLinks.forEach((anchorLink) => {
    anchorLink.addEventListener('click', () => {
      document.body.classList.toggle('no-scroll');
      if (menuList.classList.contains('_open-list')) {
        menuList.classList.remove('_open-list');
        listContent.style.backgroundColor = 'transparent';
      }
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('is-active');
      }
    });
  });

  burgerButtons.forEach((burgerButton) => {
    burgerButton.addEventListener('click', () => {
      const backgroundColorTransparent = getComputedStyle(
        document.documentElement
      ).getPropertyValue('--background-transparent');

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('is-active');
      }
      // burgerButton.firstChild.classList.toggle('is-active');
      menuList.classList.toggle('_open-list');
      document.body.classList.toggle('no-scroll');
      if (menuList.classList.contains('_open-list')) {
        // listContent.style.pointerEvents = 'all';
        listContent.style.backgroundColor = backgroundColorTransparent;
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
        listContent.style.backgroundColor = 'transparent';
        // listContent.style.pointerEvents = 'none';
      }
    });
  });
}
//* - [ Button Search  ] -
export function buttonSearch() {
  const headerContainer = document.querySelector('.header-container');
  // const sectionTop = document.querySelector('.section-top');
  const searchButton = document.querySelector('.search-button');

  // if (!searchButton) return;
  searchButton.addEventListener('click', () => {
    headerContainer.classList.toggle('_active');
    if (sectionTop) {
      if (headerContainer.classList.contains('_active')) {
        // sectionTop.style.paddingTop = '50px';
        sectionTop.style.transition = 'padding-top 0.3s ease-in-out';
      } else {
        // sectionTop.style.paddingTop = '0';
        sectionTop.style.transition = 'padding-top 0.3s ease-in-out';
      }
    }
  });
}

//* ✅ - [ Управление оповещением cookies ] -
export function cookiesAccept(el, trigger) {
  const cookiesAccept = document.querySelector(el);
  const button = document.querySelector(trigger);

  if (!cookiesAccept) return;

  // ⬇️⬇️⬇️ ДОБАВЛЕНИЯ сохранение в localStorage ⬇️⬇️⬇️

  // 1. Проверяем, было ли уже согласие
  const hasAccepted = localStorage.getItem('cookiesAccepted');

  // 2. Если пользователь уже соглашался - скрываем баннер сразу
  if (hasAccepted === 'true') {
    // Сразу убираем, без анимации
    cookiesAccept.style.display = 'none';
    // или если хотите с анимацией:
    // cookiesAccept.style.transform = 'translateY(110%)';
    // cookiesAccept.style.transition = 'transform 0.5s ease';
    return; // Завершаем функцию, баннер больше не нужен
  }

  // ⬆️⬆️⬆️  ДОБАВЛЕНИЯ ЗАКОНЧИЛИСЬ ⬆️⬆️⬆️

  if (button) {
    cookiesAccept.style.transform = 'translateY(110%)';
    button.addEventListener('click', () => {
      cookiesAccept.style.transform = 'translateY(110%)';
      cookiesAccept.style.transition = 'transform 0.5s ease';

      // ⬇️⬇️⬇️ ЕЩЕ МОИ ДОБАВЛЕНИЯ ⬇️⬇️⬇️
      // 3. При клике сохраняем согласие в localStorage
      localStorage.setItem('cookiesAccepted', 'true');

      // 4. Опционально: скрываем полностью после анимации
      setTimeout(() => {
        cookiesAccept.style.display = 'none';
      }, 500); // Ждем завершения анимации (0.5s)

      // ⬆️⬆️⬆️ КОНЕЦ ДОБАВЛЕНИЙ ⬆️⬆️⬆️
    });
  } else {
    console.log('кнопка не найдена');
  }

  setTimeout(() => {
    cookiesAccept.style.transform = 'translateY(0)';
    cookiesAccept.style.transition = 'transform 0.5s ease';
  }, 3000);
}

//* ✅ - [ Показать кнопку в карточке товара ] -
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
    const isExcludedElement =
      event.target.closest('.products-cart__button-cart') ||
      event.target.closest('.products-cart__button-by') ||
      event.target.closest('.products-cart__link'); // Добавили ссылку

    if (isExcludedElement) {
      // Если кликнули на исключенные элементы - не закрываем
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
      // Проверяем, не кликнули ли на исключенные элементы
      const isExcludedElement =
        event.target.closest('.products-cart__button-cart') ||
        event.target.closest('.products-cart__button-by') ||
        event.target.closest('.products-cart__link'); // Добавили ссылку

      if (isExcludedElement) {
        // Если кликнули на исключенные элементы - не обрабатываем открытие/закрытие
        // Эти элементы будут работать по своей логике
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

//* ✅ - [ Управление открытием модальных окон ]
export function toggleModalOpen() {
  const modals = [
    {
      triggerSelector: '.request-button',
      modalSelector: '.page__form-request',
    },
    // {
    //   triggerSelector: '.phone-call',
    //   modalSelector: '.page__order-call',
    // },
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
          const { showFieldset } = fieldSetsToggle(); // Получаем showFieldset
          showFieldset(0); // Активируем первый fieldset
        }
      });
    });

    closeBtn.addEventListener('click', () => {
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
//* ✅ - [ Компенсируем отступы ]
export function handleScrollbarOffset(enable) {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  console.log('scrollbarWidth:', scrollbarWidth);

  if (enable && scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    document.body.style.paddingRight = `0px`;
  }
}
//* ✅ - [ Исчезновение Header ]
export function fadeInHeader(params) {
  // Получаем элемент заголовка
  const header = document.querySelector('.page__header');
  if (!header) {
    console.error('Элемент .page__header не найден');
  }

  // Переменные для отслеживания состояния
  let lastScrollTop = 0;
  const hideThreshold = 50; // Порог скрытия (50px)
  let isHidden = false;

  // Функция обработки прокрутки
  function handleScroll() {
    // Текущая позиция прокрутки
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Если прокрутили вниз больше чем на 50px и блок еще не скрыт
    if (scrollTop > hideThreshold && scrollTop > lastScrollTop && !isHidden) {
      // Скрываем блок
      header.style.transform = 'translateY(-100%)';
      header.style.transition = 'transform 0.3s ease';
      isHidden = true;
    }
    // Если прокручиваем вверх и блок скрыт
    else if (scrollTop < lastScrollTop && isHidden) {
      // Показываем блок
      header.style.transform = 'translateY(0)';
      header.style.transition = 'transform 0.3s ease';
      isHidden = false;
    }

    // Сохраняем текущую позицию прокрутки
    lastScrollTop = scrollTop;
  }

  // Добавляем обработчик события прокрутки
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Инициализация при загрузке страницы
  document.addEventListener('DOMContentLoaded', function () {
    // Устанавливаем начальные стили для плавной анимации
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.width = '100%';
    header.style.transform = 'translateY(0)';
    header.style.transition = 'transform 0.3s ease';
  });
}

//* ✅ - [ Выбор города доставки ]
export function selectCity() {
  // document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('cityTrigger');
  const dropdown = document.getElementById('citiesDropdown');
  const list = document.getElementById('citiesList');
  const searchInput = document.getElementById('citySearch');
  const currentCitySpan = document.getElementById('currentCityName');

  // URL источника данных.
  // Вариант 1: Локальный файл cities.json
  // Вариант 2: Сторонний API. Для примера используем gist с городами РФ.
  const DATA_URL =
    'https://raw.githubusercontent.com/pensnarik/russian-cities/master/russian-cities.json';

  let citiesData = []; // Сюда сохраним загруженные города
  let isLoaded = false;

  // 1. Открытие/закрытие списка
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('active');

    // Фокус на поиск при открытии
    if (dropdown.classList.contains('active')) {
      searchInput.focus();
      if (!isLoaded) {
        loadCities();
      }
    }
  });

  // 2. Закрытие при клике вне области
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // 3. Загрузка городов
  async function loadCities() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('Ошибка сети');

      const data = await response.json();

      // В зависимости от структуры JSON, путь к массиву может отличаться.
      // В примере по ссылке выше это просто массив объектов [{name: "Москва", ...}]
      citiesData = data;

      renderList(citiesData);
      isLoaded = true;
    } catch (error) {
      list.innerHTML = '<li class="loading">Ошибка загрузки списка</li>';
      console.error(error);
    }
  }

  // 4. Рендеринг списка (отображение)
  function renderList(cities) {
    if (cities.length === 0) {
      list.innerHTML = '<li class="loading">Ничего не найдено</li>';
      return;
    }

    // Оптимизация: используем Fragment, чтобы не перерисовывать DOM каждый раз
    const fragment = document.createDocumentFragment();

    cities.forEach((city) => {
      const li = document.createElement('li');
      // Проверяем структуру JSON. Если просто массив строк - city, если объектов - city.name
      li.textContent = city.name || city;

      li.addEventListener('click', () => {
        selectCity(li.textContent);
      });

      fragment.appendChild(li);
    });

    list.innerHTML = '';
    list.appendChild(fragment);
  }

  // 5. Выбор города
  function selectCity(name) {
    currentCitySpan.textContent = name;
    dropdown.classList.remove('active');

    // Опционально: Сохранить в LocalStorage, чтобы запомнить выбор пользователя
    localStorage.setItem('selectedCity', name);

    // Опционально: Перезагрузить страницу или вызвать функцию обновления цен/доставки
    // window.location.reload();
    console.log(`Выбран город: ${name}`);
  }

  // 6. Поиск (Фильтрация)
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    const filtered = citiesData.filter((city) => {
      const cityName = (city.name || city).toLowerCase();
      return cityName.includes(query);
    });

    renderList(filtered);
  });

  // 7. Проверка сохраненного города при загрузке страницы
  const savedCity = localStorage.getItem('selectedCity');
  if (savedCity) {
    currentCitySpan.textContent = savedCity;
  }
  // });
}
