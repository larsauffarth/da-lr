/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-product block
 *
 * Source: https://www.nescafe-dolcegusto.com.br/
 * Base Block: columns
 *
 * Block Structure:
 * - Each row: [column1, column2] (typically image + content or content + image)
 *
 * Generated: 2026-02-03
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find column containers
  const columns = element.querySelectorAll(':scope > div, .column, .col');

  if (columns.length >= 2) {
    // Two-column layout
    const col1 = columns[0];
    const col2 = columns[1];

    // Extract content from each column
    const col1Content = extractColumnContent(col1);
    const col2Content = extractColumnContent(col2);

    cells.push([col1Content, col2Content]);
  } else {
    // Single container - look for image + text pattern
    const image = element.querySelector('img, picture img');
    const heading = element.querySelector('h1, h2, h3, .title');
    const description = element.querySelector('p, .description');
    const cta = element.querySelector('a.cta, a.button, a[href]');
    const list = element.querySelector('ul, ol');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (list) contentCell.push(list);
    if (cta) contentCell.push(cta);

    if (image && contentCell.length > 0) {
      cells.push([image, contentCell]);
    } else if (contentCell.length > 0) {
      cells.push(contentCell);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Product', cells });
  element.replaceWith(block);
}

function extractColumnContent(col) {
  const image = col.querySelector('img, picture img');
  if (image && col.querySelectorAll('*').length <= 3) {
    // Column is primarily an image
    return image;
  }

  // Column has text content
  const content = [];
  const heading = col.querySelector('h1, h2, h3, .title');
  const description = col.querySelector('p, .description');
  const list = col.querySelector('ul, ol');
  const cta = col.querySelector('a.cta, a.button, a[href]');

  if (heading) content.push(heading);
  if (description) content.push(description);
  if (list) content.push(list);
  if (cta) content.push(cta);
  if (image) content.push(image);

  return content.length > 0 ? content : col;
}
