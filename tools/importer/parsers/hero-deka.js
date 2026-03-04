/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-deka block
 *
 * Source: https://www.deka.de/privatkunden
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Hero-Deka")
 * - Row 2: Background image (full-width hero image)
 * - Row 3: Tag chip + heading + body text + CTA button link
 * - Row 4-6: Sub-teaser cards, each: image | tag + heading + CTA
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="grid hero-stage">
 *   <div class="hauptthema-desktop">
 *     <div class="hauptthema-desktop__wrapper">
 *       <img class="hauptthema-desktop__bild" src="...">
 *       <div class="hauptthema-desktop__content">
 *         <header>
 *           <div class="hauptthema__rubrik">
 *             <span class="p-tag-label">Tag</span>
 *           </div>
 *           <h2 class="hauptthema__heroheadline">Heading</h2>
 *           <p class="hauptthema__herosubheadline">Subheading</p>
 *         </header>
 *         <a class="p-button" href="..."><span class="p-button-label">CTA</span></a>
 *       </div>
 *     </div>
 *   </div>
 *   <!-- Sub-teasers follow in .nebenthemen section -->
 * </section>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract background image from desktop hero
  const heroImg = element.querySelector('.hauptthema-desktop__bild') ||
                  element.querySelector('.hauptthema-mobile__bild') ||
                  element.querySelector('img[class*="hauptthema"]');

  if (heroImg) {
    cells.push([heroImg.cloneNode(true)]);
  }

  // Extract main hero content: tag + heading + body + CTA
  const desktopContent = element.querySelector('.hauptthema-desktop__content') ||
                         element.querySelector('.hauptthema-mobile__content');

  if (desktopContent) {
    const textCell = document.createElement('div');

    // Tag chip
    const tag = desktopContent.querySelector('.p-tag-label');
    if (tag) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.appendChild(p);
    }

    // Heading
    const heading = desktopContent.querySelector('.hauptthema__heroheadline') ||
                    desktopContent.querySelector('h2');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.appendChild(h3);
    }

    // Subheading / body
    const subheading = desktopContent.querySelector('.hauptthema__herosubheadline') ||
                       desktopContent.querySelector('p.subheadline-level-1');
    if (subheading) {
      const p = document.createElement('p');
      p.textContent = subheading.textContent.trim();
      textCell.appendChild(p);
    }

    // CTA button
    const cta = desktopContent.querySelector('a.p-button') ||
                desktopContent.querySelector('a[href]');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href;
      const label = cta.querySelector('.p-button-label');
      a.textContent = label ? label.textContent.trim() : cta.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([textCell]);
  }

  // Extract sub-teasers (3 cards below the hero)
  const subTeasers = element.querySelectorAll('.nebenthema') ||
                     element.querySelectorAll('[class*="nebenthema"]');

  subTeasers.forEach((teaser) => {
    const img = teaser.querySelector('img');
    const imageCell = document.createElement('div');
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }

    const textCell = document.createElement('div');

    // Tag
    const tag = teaser.querySelector('.p-tag-label');
    if (tag) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.appendChild(p);
    }

    // Heading
    const heading = teaser.querySelector('h3') || teaser.querySelector('h2');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.appendChild(h3);
    }

    // CTA
    const cta = teaser.querySelector('a[href]');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href;
      const label = cta.querySelector('.p-button-label') || cta.querySelector('span');
      a.textContent = label ? label.textContent.trim() : cta.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Deka', cells });
  element.replaceWith(block);
}
