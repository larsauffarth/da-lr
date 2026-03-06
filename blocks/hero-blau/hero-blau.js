export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // First row: image | text content
  const firstRow = rows[0];
  const cols = [...firstRow.children];

  if (cols.length >= 2) {
    const imageCol = cols.find((col) => col.querySelector('picture') || col.querySelector('img'));
    const textCol = cols.find((col) => !col.querySelector('picture') && !col.querySelector('img'));

    if (imageCol) imageCol.classList.add('hero-blau-image');
    if (textCol) textCol.classList.add('hero-blau-content');

    // Place image before content so float:right works (text wraps around image)
    if (imageCol && textCol && firstRow.firstElementChild !== imageCol) {
      firstRow.insertBefore(imageCol, textCol);
    }
  } else if (cols.length === 1) {
    cols[0].classList.add('hero-blau-content');
  }
}
