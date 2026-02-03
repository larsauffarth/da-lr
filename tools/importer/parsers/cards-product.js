/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product block
 *
 * Source: https://www.nescafe-dolcegusto.com.br/
 * Base Block: cards
 *
 * Block Structure:
 * - Each row: [image, content (title, price, CTA)]
 *
 * Generated: 2026-02-03
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all card items
  const cards = element.querySelectorAll('.card, .product-card, .item, :scope > div, :scope > li');

  cards.forEach((card) => {
    // Extract card image
    const image = card.querySelector('img, picture img');

    // Extract card content
    const title = card.querySelector('h2, h3, h4, .title, .product-name, [class*="title"]');
    const price = card.querySelector('.price, [class*="price"], .value');
    const description = card.querySelector('p, .description');
    const cta = card.querySelector('a.cta, a.button, a[href]');

    // Build content cell
    const contentCell = [];
    if (title) contentCell.push(title);
    if (price) contentCell.push(price);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);

    if (image || contentCell.length > 0) {
      cells.push([image || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  // If no cards found, try simple text extraction
  if (cells.length === 0) {
    const items = element.querySelectorAll('p, strong, b');
    items.forEach((item) => {
      cells.push([item]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Product', cells });
  element.replaceWith(block);
}
