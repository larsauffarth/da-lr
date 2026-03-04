export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-deka-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1
          && picWrapper.children[0].tagName === 'PICTURE') {
          // picture is the sole direct child of the column
          picWrapper.classList.add('columns-deka-img-col');
        }
      }
    });
  });
}
