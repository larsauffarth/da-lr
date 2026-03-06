/* eslint-disable */
/* global WebImporter */

/**
 * Parser for callout-blau block
 *
 * Source: https://www.blau.de/guide/tipps/iphone-17e-groesse/
 * Base Block: quote
 *
 * Source HTML Pattern:
 * <div class="alert article-wide alert-info">
 *   <p>Tip text...</p>
 *   <ul><li><a href="...">Link text</a></li></ul>
 * </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  const contentCell = document.createElement('div');

  // Clone inner content (paragraphs and lists)
  const paragraphs = element.querySelectorAll('p');
  paragraphs.forEach((p) => {
    contentCell.appendChild(p.cloneNode(true));
  });

  const lists = element.querySelectorAll('ul, ol');
  lists.forEach((list) => {
    contentCell.appendChild(list.cloneNode(true));
  });

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Callout-Blau', cells });
  element.replaceWith(block);
}
