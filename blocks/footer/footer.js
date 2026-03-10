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

  // Deka theme: restructure footer sections for proper layout
  if (document.body.classList.contains('deka')) {
    const sections = footer.querySelectorAll('.section');

    // Section 2: wrap flat children into 3 column divs
    const section2 = sections[1];
    if (section2) {
      const wrapper = section2.querySelector('.default-content-wrapper');
      if (wrapper) {
        const kids = [...wrapper.children];
        // Column 1: items 0-4 (Kontakt heading, text, phone, hours, links list)
        // Column 2: items 5-6 (Quicklinks heading, links list)
        // Column 3: items 7-8 (DekaBank Depot heading, links list)
        const col1 = document.createElement('div');
        col1.className = 'footer-col';
        const col2 = document.createElement('div');
        col2.className = 'footer-col';
        const col3 = document.createElement('div');
        col3.className = 'footer-col';
        kids.forEach((kid, i) => {
          if (i <= 4) col1.append(kid);
          else if (i <= 6) col2.append(kid);
          else col3.append(kid);
        });
        wrapper.append(col1, col2, col3);
      }
    }

    // Section 3: split social media paragraph into text + icon row
    const section3 = sections[2];
    if (section3) {
      const wrapper = section3.querySelector('.default-content-wrapper');
      const lastP = wrapper?.querySelector('p:last-child');
      if (lastP) {
        const links = [...lastP.querySelectorAll('a')];
        if (links.length > 0) {
          // Extract text node, keep in paragraph
          const iconRow = document.createElement('div');
          iconRow.className = 'footer-social-icons';
          links.forEach((a) => iconRow.append(a));
          lastP.after(iconRow);
        }
      }
    }
  }

  // Add "Zurück zum Seitenanfang" back-to-top bar (Deka theme only)
  if (document.body.classList.contains('deka')) {
    const backToTop = document.createElement('a');
    backToTop.href = '#';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = 'Zurück zum Seitenanfang <span class="back-to-top-icon">&#x2191;</span>';
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    block.parentElement.insertBefore(backToTop, block);
  }
}
