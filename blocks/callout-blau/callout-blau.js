export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Wrap content in a callout container
  const wrapper = document.createElement('div');
  wrapper.className = 'callout-blau-wrapper';

  rows.forEach((row) => {
    while (row.firstElementChild) {
      wrapper.append(row.firstElementChild);
    }
    row.remove();
  });

  block.append(wrapper);
}
