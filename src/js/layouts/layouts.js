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
