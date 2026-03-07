import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      if (col.querySelector('picture') || col.querySelector('img')) {
        col.classList.add('teaser-blau-image');
      } else {
        col.classList.add('teaser-blau-content');
      }
    });
  });

  // Detect specs variant: content has a <ul> where <li> items start with <strong>
  const content = block.querySelector('.teaser-blau-content');
  if (content) {
    const ul = content.querySelector('ul');
    if (ul) {
      const firstLi = ul.querySelector('li');
      if (firstLi && firstLi.querySelector('strong')) {
        block.classList.add('teaser-blau-specs');
      }
    }
  }

  block.querySelectorAll('img').forEach((img) => {
    if (!img.closest('picture')) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.replaceWith(optimizedPic);
    } else {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
