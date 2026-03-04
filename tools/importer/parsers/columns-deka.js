/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-deka block
 *
 * Source: https://www.deka.de/privatkunden
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Columns-Deka")
 * - Row 2: [heading + body + CTA | image]
 *
 * Used for "Deka informiert" section - 50/50 text + image info banner.
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="grid">
 *   <div class="infobereich">
 *     <div class="infobereich__content">
 *       <h2 class="infobereich__headline">Heading</h2>
 *       <p class="infobereich__text">Body text</p>
 *       <a class="p-button" href="..."><span class="p-button-label">CTA</span></a>
 *     </div>
 *     <div class="infobereich__image">
 *       <img src="..." alt="">
 *     </div>
 *   </div>
 * </section>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Build text column (column 1): heading + body + CTA
  const textCell = document.createElement('div');

  // Heading
  const heading = element.querySelector('h2, h3, [class*="headline"]');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    textCell.appendChild(h2);
  }

  // Body text
  const body = element.querySelector('[class*="text"]:not(h2):not(h3)');
  if (body && body.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = body.textContent.trim();
    textCell.appendChild(p);
  }

  // CTA link
  const cta = element.querySelector('a.p-button, a[href][class*="button"], a[href][class*="link"]');
  if (cta) {
    const a = document.createElement('a');
    a.href = cta.href;
    const label = cta.querySelector('.p-button-label, span');
    a.textContent = label ? label.textContent.trim() : cta.textContent.trim();
    const p = document.createElement('p');
    p.appendChild(a);
    textCell.appendChild(p);
  }

  // Image column (column 2)
  const imageCell = document.createElement('div');
  const img = element.querySelector('[class*="image"] img, picture img, img');
  if (img) {
    imageCell.appendChild(img.cloneNode(true));
  }

  cells.push([textCell, imageCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Deka', cells });
  element.replaceWith(block);
}
