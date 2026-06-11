import ItcCollapse from './collapse';

export default function dropBoxColapse() {
  const items = document.querySelectorAll('.toggle-box');
  const _toggleItem = (item) => {
    const collapse = new ItcCollapse(item.querySelector('._collapse'));
    if (item.classList.contains('_open')) {
      item.classList.remove('_open');
      collapse.toggle();
    } else {
      item.classList.add('_open');
      collapse.toggle();
    }
  };

  items.forEach((item) => {
    const closeButtonDrop = item.querySelector('.dropdown-block__close-button');

    const trigger = item.querySelector('._toggle-button');

    trigger.addEventListener('click', () => {
      const opened_item = document.querySelector('._open');
      _toggleItem(item);
      if (opened_item && opened_item !== item) {
        _toggleItem(opened_item);
      }
    });
    if (closeButtonDrop) {
      console.log(closeButtonDrop);
      closeButtonDrop.addEventListener('click', () => {
        _toggleItem(item);
      });
    }
  });
}
