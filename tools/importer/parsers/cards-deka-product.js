/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-deka-product block
 *
 * Source: https://www.deka.de/privatkunden
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-Deka-Product")
 * - Row 2-N: Each row = [tag + heading + body + CTA | image]
 *
 * Used for "Entdecken Sie unser Angebot" section with 5 product cards in 3+2 grid.
 * Similar to cards-deka but without date/subtitle fields.
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="grid">
 *   <!-- Section heading in default content above -->
 *   <div class="grid__item">
 *     <div class="angebots-kachel">
 *       <div class="angebots-kachel__content">
 *         <div class="hauptthema__rubrik">
 *           <span class="p-tag-label">Tag</span>
 *         </div>
 *         <h3 class="angebots-kachel__headline">Heading</h3>
 *         <p class="angebots-kachel__text">Body text</p>
 *         <a class="p-button" href="..."><span class="p-button-label">CTA</span></a>
 *       </div>
 *       <div class="angebots-kachel__image">
 *         <img src="..." alt="">
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all product card items
  const cards = element.querySelectorAll('.angebots-kachel, .grid__item > div, article');

  cards.forEach((card) => {
    // Skip if this doesn't look like a product card
    const hasTag = card.querySelector('.p-tag-label');
    const hasHeading = card.querySelector('h2, h3, [class*="headline"]');
    if (!hasTag && !hasHeading) return;

    // Build text cell (column 1): tag + heading + body + CTA
    const textCell = document.createElement('div');

    // Tag chip
    const tag = card.querySelector('.p-tag-label');
    if (tag) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.appendChild(p);
    }

    // Heading
    const heading = card.querySelector('h3, h2, [class*="headline"]');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.appendChild(h3);
    }

    // Body text
    const body = card.querySelector('[class*="text"]:not([class*="sub"])');
    if (body && body.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = body.textContent.trim();
      textCell.appendChild(p);
    }

    // CTA link
    const cta = card.querySelector('a.p-button, a[href][class*="button"], a[href][class*="link"]');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href;
      const label = cta.querySelector('.p-button-label, span');
      a.textContent = label ? label.textContent.trim() : cta.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textCell.appendChild(p);
    }

    // Image cell (column 2)
    const imageCell = document.createElement('div');
    const img = card.querySelector('[class*="image"] img, [class*="media"] img, picture img, img');
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }

    cells.push([textCell, imageCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Deka-Product', cells });
  element.replaceWith(block);
}
