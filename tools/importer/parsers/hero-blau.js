/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-blau block
 *
 * Source: https://www.blau.de/guide/tipps/iphone-17e-groesse/
 * Base Block: hero
 *
 * Source HTML Pattern:
 * <article class="article article-image-right primaryHeadline">
 *   <h1>Title</h1>
 *   <figure class="image"><picture>...<img src="..."></picture></figure>
 *   <div class="body-text"><p><span class="small">Date</span></p></div>
 * </article>
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract hero image
  const img = element.querySelector('figure img, picture img');

  // Extract title
  const h1 = element.querySelector('h1');

  // Extract date
  const date = element.querySelector('.small') || element.querySelector('.body-text p');

  // Build content cell
  const contentCell = document.createElement('div');

  if (h1) {
    const heading = document.createElement('h1');
    heading.textContent = h1.textContent.trim();
    contentCell.appendChild(heading);
  }

  if (date) {
    const p = document.createElement('p');
    p.textContent = date.textContent.trim();
    contentCell.appendChild(p);
  }

  // Build image cell
  const imageCell = document.createElement('div');
  if (img) {
    imageCell.appendChild(img.cloneNode(true));
  }

  cells.push([contentCell, imageCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Blau', cells });
  element.replaceWith(block);
}
