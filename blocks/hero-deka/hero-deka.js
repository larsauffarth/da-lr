export default function decorate(block) {
  const imageRow = block.children[0];
  const textRow = block.children[1];

  if (!imageRow?.querySelector('picture')) {
    block.classList.add('no-image');
    return;
  }

  // Wrap image + text overlay in a stage container (mirrors origin's hauptthema-desktop__wrapper)
  const stage = document.createElement('div');
  stage.className = 'hero-deka-stage';
  block.insertBefore(stage, imageRow);
  stage.appendChild(imageRow);
  stage.appendChild(textRow);
}
