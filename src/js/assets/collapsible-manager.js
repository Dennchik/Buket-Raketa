// collapsible-manager.js
import ItcCollapse from './collapse';

// ---------- Конфигурация ----------
const CONFIG = {
  breakpoint: 819,
  debounceDelay: 150,
};

// ---------- 1. Управление одним сворачиваемым блоком ----------
class Collapsible {
  constructor(container, options = {}) {
    this.container = container;
    this.collapseElement = container.querySelector('._collapse');
    if (!this.collapseElement) {
      console.warn('Collapsible: ._collapse not found in', container);
      this.collapseInstance = null;
      return;
    }

    this.collapseInstance = new ItcCollapse(this.collapseElement);
    this.isOpen =
      container.classList.contains('_open') ||
      container.classList.contains('_show');

    this.toggleButtons = container.querySelectorAll(
      options.toggleSelector || '._toggle-button'
    );
    this.closeButtons = container.querySelectorAll(
      options.closeSelector || '.dropdown-block__close-button'
    );
    this.allButtons = [...this.toggleButtons, ...this.closeButtons];

    this.onToggle = options.onToggle || null;

    this.handleToggle = this.handleToggle.bind(this);
    this.allButtons.forEach((btn) =>
      btn.addEventListener('click', this.handleToggle)
    );

    // Если изначально открыт – добавим _show для CSS
    if (this.isOpen) {
      this.collapseElement.classList.add('_show');
    }
  }

  handleToggle() {
    this.isOpen ? this.close() : this.open();
  }

  open(animate = true) {
    if (this.isOpen || !this.collapseInstance) return;
    this.container.classList.add('_open');
    this.collapseElement.classList.add('_show');
    this.isOpen = true;
    if (animate) this.collapseInstance.toggle();
    this.notify();
  }

  close(animate = true) {
    if (!this.isOpen || !this.collapseInstance) return;
    this.container.classList.remove('_open');
    this.collapseElement.classList.remove('_show');
    this.isOpen = false;
    if (animate) this.collapseInstance.toggle();
    this.notify();
  }

  setState(open, animate = true) {
    if (open) this.open(animate);
    else this.close(animate);
  }

  notify() {
    if (this.onToggle) this.onToggle(this.isOpen);
  }

  setCloseButtonsVisible(visible) {
    this.closeButtons.forEach((btn) => {
      btn.style.display = visible ? '' : 'none';
    });
  }

  destroy() {
    this.allButtons.forEach((btn) =>
      btn.removeEventListener('click', this.handleToggle)
    );
  }
}

// ---------- 2. Группа с аккордеоном ----------
class AccordionGroup {
  constructor(items) {
    this.items = items;
  }

  openOne(exceptItem, animate = true) {
    this.items.forEach((item) => {
      if (item !== exceptItem && item.isOpen) {
        item.close(animate);
      }
    });
    if (exceptItem && !exceptItem.isOpen) {
      exceptItem.open(animate);
    }
  }

  setAllOpen(open, animate = true) {
    this.items.forEach((item) => item.setState(open, animate));
  }

  setCloseButtonsVisible(visible) {
    this.items.forEach((item) => item.setCloseButtonsVisible(visible));
  }

  destroy() {
    this.items.forEach((item) => item.destroy());
  }
}

// ---------- 3. Адаптивный менеджер ----------
class AdaptiveManager {
  constructor(breakpoint, groups = {}, mainFilter = null) {
    this.breakpoint = breakpoint;
    this.groups = groups;
    this.mainFilter = mainFilter;
    this.timeoutId = null;
    this.boundResize = this.handleResize.bind(this);

    // Применяем правило без анимации при загрузке
    this.apply(window.innerWidth, false);

    window.addEventListener('resize', this.boundResize);
  }

  handleResize() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.apply(window.innerWidth, true);
    }, CONFIG.debounceDelay);
  }

  apply(width, animate = true) {
    const isWide = width > this.breakpoint;

    Object.values(this.groups).forEach((group) => {
      if (isWide) {
        group.setAllOpen(true, animate);
        group.setCloseButtonsVisible(false);
      } else {
        group.setCloseButtonsVisible(true);
        // При желании можно закрыть все на узком экране (без анимации, чтобы не дёргалось)
        // group.setAllOpen(false, false);
      }
    });

    if (this.mainFilter) {
      if (isWide) {
        this.mainFilter.setState(true, animate);
        this.mainFilter.setCloseButtonsVisible(false);
      } else {
        this.mainFilter.setCloseButtonsVisible(true);
        // this.mainFilter.setState(false, false);
      }
    }
  }

  destroy() {
    window.removeEventListener('resize', this.boundResize);
    clearTimeout(this.timeoutId);
    Object.values(this.groups).forEach((group) => group.destroy());
    if (this.mainFilter) this.mainFilter.destroy();
  }
}

// ---------- 4. Фабричная функция ----------
export function initCollapsibles(breakpoint = CONFIG.breakpoint) {
  // --- Собираем .toggle-box ---
  const toggleBoxes = document.querySelectorAll('.toggle-box');
  const toggleItems = [];
  toggleBoxes.forEach((container) => {
    const item = new Collapsible(container, {
      toggleSelector: '._toggle-button',
      closeSelector: '.dropdown-block__close-button',
    });
    toggleItems.push(item);
  });

  // Группа аккордеона
  const accordionGroup = new AccordionGroup(toggleItems);

  // Устанавливаем колбэк: при открытии одного – закрываем остальные
  toggleItems.forEach((item) => {
    const originalOnToggle = item.onToggle;
    item.onToggle = (isOpen) => {
      if (isOpen) {
        accordionGroup.openOne(item, true); // с анимацией при клике
      }
      if (originalOnToggle) originalOnToggle(isOpen);
    };
  });

  // --- Основной фильтр (catalog-filter) ---
  const filterContainer = document.querySelector('.catalog-filter');
  let mainFilter = null;
  if (filterContainer) {
    mainFilter = new Collapsible(filterContainer, {
      toggleSelector: '.catalog-filter__close-button',
      closeSelector: '.catalog-filter__close-button',
    });

    const button = filterContainer.querySelector(
      '.catalog-filter__close-button'
    );
    const textSpan = button?.querySelector('span');
    if (textSpan) {
      mainFilter.onToggle = (isOpen) => {
        textSpan.textContent = isOpen ? 'закрыть' : 'открыть';
      };
      mainFilter.onToggle(mainFilter.isOpen);
    }
  }

  // --- Адаптивный менеджер ---
  const manager = new AdaptiveManager(
    breakpoint,
    { toggleBoxes: accordionGroup },
    mainFilter
  );

  return {
    manager,
    accordionGroup,
    mainFilter,
    destroy() {
      manager.destroy();
    },
  };
}
