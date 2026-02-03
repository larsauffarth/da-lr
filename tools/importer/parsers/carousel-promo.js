/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-promo block
 *
 * Source: https://www.nescafe-dolcegusto.com.br/
 * Base Block: carousel
 *
 * Block Structure:
 * - Each row represents a slide with image + content
 *
 * Generated: 2026-02-03
 */
export default function parse(element, { document }) {
  // Find all slides in the carousel
  const slides = element.querySelectorAll('.slide, .carousel-item, [data-slide], :scope > div');

  const cells = [];

  slides.forEach((slide) => {
    // Extract slide image
    const image = slide.querySelector('img, picture img');

    // Extract slide content
    const heading = slide.querySelector('h1, h2, h3, .title, [class*="heading"]');
    const description = slide.querySelector('p, .description, [class*="subtitle"]');
    const cta = slide.querySelector('a.cta, a.button, [class*="btn"]');

    // Build slide row: [image, content]
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);

    if (image || contentCell.length > 0) {
      cells.push([image || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  // If no slides found, try to extract as single slide
  if (cells.length === 0) {
    const image = element.querySelector('img, picture img');
    const heading = element.querySelector('h1, h2, h3');
    const description = element.querySelector('p');
    const cta = element.querySelector('a');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);

    cells.push([image || '', contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel-Promo', cells });
  element.replaceWith(block);
}
