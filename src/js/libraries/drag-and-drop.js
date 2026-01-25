document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('bouquet-upload');
  const previewContainer = document.querySelector('.card__preview');
  const previewImage = document.querySelector('.card__preview-image');
  const changeButton = document.querySelector('.card__preview-change');
  const removeButton = document.querySelector('.card__preview-remove');
  const submitButton = document.getElementById('submit-bonus');
  let uploadedFile = null;

  // 1. Клик по области загрузки
  uploadArea.addEventListener('click', function (e) {
    if (!e.target.closest('.card__preview-actions')) {
      fileInput.click();
    }
  });

  // 2. Выбор файла через input
  fileInput.addEventListener('change', handleFileSelect);

  // 3. Drag-and-drop события
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

  // 4. Кнопка изменения фото
  changeButton.addEventListener('click', function () {
    fileInput.click();
  });

  // 5. Кнопка удаления фото
  removeButton.addEventListener('click', function () {
    resetUpload();
    showUploadArea();
  });

  // 6. Кнопка получения бонусов
  submitButton.addEventListener('click', function () {
    if (!uploadedFile) {
      alert('Пожалуйста, сначала загрузите фото букета или напишите пожелания');
      return;
    }

    submitForm();
  });

  // Функции обработки
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      processFile(file);
    }
  }

  function validateFile(file) {
    // Проверка типа файла
    if (!file.type.match('image.*')) {
      alert('Пожалуйста, выберите изображение (JPG, PNG, GIF)');
      return false;
    }

    // Проверка размера (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Изображение должно быть меньше 10MB');
      return false;
    }

    return true;
  }

  function processFile(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      previewImage.src = event.target.result;
      uploadedFile = file;

      // Показываем превью
      previewContainer.style.display = 'block';

      // Скрываем область загрузки
      uploadArea.style.display = 'none';

      // Показываем сообщение об успехе
      showSuccessMessage();

      // Автоматически отправляем на сервер (опционально)
      // uploadToServer(file);
    };

    reader.onerror = function () {
      alert('Ошибка при чтении файла');
    };

    reader.readAsDataURL(file);
  }

  function resetUpload() {
    fileInput.value = '';
    previewImage.src = '';
    uploadedFile = null;
    previewContainer.style.display = 'none';
  }

  function showUploadArea() {
    uploadArea.style.display = 'flex';
  }

  function showSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.className = 'card__upload-success';
    successMsg.innerHTML =
      '✓ Фото успешно загружено! Теперь нажмите "Получить бонусы"';
    successMsg.style.display = 'block';

    // Вставляем после превью
    previewContainer.parentNode.insertBefore(
      successMsg,
      previewContainer.nextSibling
    );

    // Убираем через 5 секунд
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 5000);
  }

  function submitForm() {
    // Здесь код отправки формы на сервер
    console.log('Отправка данных:', {
      file: uploadedFile,
      filename: uploadedFile.name,
      size: uploadedFile.size,
    });

    // Показываем сообщение об успехе
    alert('Ваше фото отправлено! Флорист свяжется с вами в течение 15 минут.');

    // Сбрасываем форму
    resetUpload();
    showUploadArea();
  }

  // Опционально: отправка на сервер
  function uploadToServer(file) {
    const formData = new FormData();
    formData.append('bouquet_photo', file);
    formData.append('timestamp', new Date().toISOString());

    fetch('/api/upload-bouquet', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Фото загружено на сервер:', data);
      })
      .catch((error) => {
        console.error('Ошибка загрузки:', error);
      });
  }
});
