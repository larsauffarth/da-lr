/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-deka block
 *
 * Source: https://www.deka.de/privatkunden
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-Deka")
 * - Row 2-N: Each row = [tag + date + heading + subtitle + body + CTA | image]
 *
 * Used for both "Aktuelles & Hintergründe" (news) and "Unsere Auszeichnungen" (awards) sections.
 * Content pattern: tag chip + date + heading + subtitle + body text + CTA button + image
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="grid">
 *   <!-- Section heading in default content above -->
 *   <div class="grid__item">
 *     <div class="kachel">
 *       <div class="kachel__content">
 *         <div class="hauptthema__rubrik">
 *           <span class="p-tag-label">Tag</span>
 *         </div>
 *         <span class="hauptthema__date">DD.MM.YYYY</span>
 *         <h3 class="kachel__headline">Heading</h3>
 *         <p class="kachel__subheadline">Subtitle</p>
 *         <p class="kachel__text">Body text</p>
 *         <a class="p-button" href="..."><span class="p-button-label">CTA</span></a>
 *       </div>
 *       <div class="kachel__image">
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

  // Find all card items - Deka uses .kachel or grid items with tag+image pattern
  const cards = element.querySelectorAll('.kachel, .grid__item > div, article');

  cards.forEach((card) => {
    // Skip if this doesn't look like a content card
    const hasTag = card.querySelector('.p-tag-label');
    const hasHeading = card.querySelector('h2, h3, [class*="headline"]');
    if (!hasTag && !hasHeading) return;

    // Build text cell (column 1): tag + date + heading + subtitle + body + CTA
    const textCell = document.createElement('div');

    // Tag chip
    const tag = card.querySelector('.p-tag-label');
    if (tag) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.appendChild(p);
    }

    // Date
    const date = card.querySelector('[class*="date"], time');
    if (date) {
      const em = document.createElement('em');
      em.textContent = date.textContent.trim();
      textCell.appendChild(em);
    }

    // Heading
    const heading = card.querySelector('h3, h2, [class*="headline"]:not([class*="sub"])');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.appendChild(h3);
    }

    // Subtitle
    const subtitle = card.querySelector('[class*="subheadline"], [class*="subtitle"]');
    if (subtitle) {
      const strong = document.createElement('strong');
      strong.textContent = subtitle.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(strong);
      textCell.appendChild(p);
    }

    // Body text
    const body = card.querySelector('[class*="text"]:not([class*="sub"]):not([class*="date"])');
    if (body && body.textContent.trim() && body !== subtitle) {
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Deka', cells });
  element.replaceWith(block);
}
