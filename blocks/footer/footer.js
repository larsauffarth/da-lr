import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  // DA content paths: on localhost add /content/ prefix; on live/preview strip it
  if (window.location.hostname.includes('localhost') && !footerPath.startsWith('/content/')) {
    footerPath = `/content${footerPath}`;
  } else if (!window.location.hostname.includes('localhost') && footerPath.startsWith('/content/')) {
    footerPath = footerPath.substring('/content'.length);
  }
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
