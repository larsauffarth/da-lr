/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-blau block
 *
 * Source: https://www.blau.de/guide/tipps/iphone-17e-groesse/
 * Base Block: cards
 *
 * Source HTML Pattern:
 * <div class="item-collection">
 *   <div class="items">
 *     <article class="teaser teaser-short">
 *       <div class="figures"><figure><picture><img></picture></figure></div>
 *       <div class="content">
 *         <div class="headline">Title</div>
 *         <div class="text"><p>Description</p></div>
 *       </div>
 *       <ul class="links"><li><a href="..." class="btn-block">CTA</a></li></ul>
 *     </article>
 *   </div>
 * </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  const teasers = element.querySelectorAll('.teaser-short, article.teaser');
  teasers.forEach((teaser) => {
    // Image
    const img = teaser.querySelector('figure img, picture img');
    const imageCell = document.createElement('div');
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }

    // Content
    const contentCell = document.createElement('div');

    // Headline
    const headline = teaser.querySelector('.headline');
    if (headline) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = headline.textContent.trim();
      p.appendChild(strong);
      contentCell.appendChild(p);
    }

    // Description
    const text = teaser.querySelector('.text p');
    if (text) {
      contentCell.appendChild(text.cloneNode(true));
    }

    // CTA
    const cta = teaser.querySelector('.links a');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      contentCell.appendChild(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Blau', cells });
  element.replaceWith(block);
}
