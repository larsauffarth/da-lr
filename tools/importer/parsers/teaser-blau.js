/* eslint-disable */
/* global WebImporter */

/**
 * Parser for teaser-blau block
 *
 * Source: https://www.blau.de/guide/tipps/iphone-17e-groesse/
 * Base Block: cards
 *
 * Source HTML Pattern:
 * <article class="teaser teaser-wide">
 *   <div class="figures"><figure>...<img></figure></div>
 *   <div class="content">
 *     <div class="headline">Title</div>
 *     <div class="text"><ul>...</ul> or <p>...</p></div>
 *   </div>
 *   <ul class="links"><li><a href="...">CTA</a></li></ul>
 * </article>
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract image
  const img = element.querySelector('.figures img, figure img');
  const imageCell = document.createElement('div');
  if (img) {
    imageCell.appendChild(img.cloneNode(true));
  }

  // Extract content
  const contentCell = document.createElement('div');

  // Headline
  const headline = element.querySelector('.headline, .content .headline');
  if (headline) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = headline.textContent.trim();
    p.appendChild(strong);
    contentCell.appendChild(p);
  }

  // Description/specs
  const text = element.querySelector('.content .text');
  if (text) {
    const clone = text.cloneNode(true);
    contentCell.appendChild(clone);
  }

  // CTA links
  const links = element.querySelectorAll('.links a');
  links.forEach((link) => {
    if (link.closest('.energy-label-items')) return;
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    const p = document.createElement('p');
    p.appendChild(a);
    contentCell.appendChild(p);
  });

  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Teaser-Blau', cells });
  element.replaceWith(block);
}
