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
