/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo block
 *
 * Source: https://www.nescafe-dolcegusto.com.br/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, subheading, CTA)
 *
 * Generated: 2026-02-03
 */
export default function parse(element, { document }) {
  const cells = [];

  // Check for background image
  const bgImage = element.querySelector('img.background, img.hero-bg, picture img, img:first-of-type');

  if (bgImage) {
    cells.push([bgImage]);
  }

  // Extract content
  const heading = element.querySelector('h1, h2, h3, .title, [class*="heading"]');
  const subheading = element.querySelector('p, .subtitle, .description, [class*="sub"]');
  const ctas = Array.from(element.querySelectorAll('a.cta, a.button, [class*="btn"], a[href]'));

  // Build content cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  ctas.forEach(cta => contentCell.push(cta));

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Promo', cells });
  element.replaceWith(block);
}
