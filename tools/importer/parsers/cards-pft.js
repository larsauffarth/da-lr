/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pft. Base: cards.
 * Source: https://www.pft.net/de/
 * Selectors from captured DOM:
 *   News teasers: .carouselTeaser.tribleTeaser dl (with dt>a>img + dd>div>h4+span+.teaserLinkDiv>a)
 *   Quick links: .teaser.threeTeasers.themenTeaser dl (with dt>a>img + dd>div>h4+a)
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(':scope dl');
  const cells = [];

  cards.forEach((card) => {
    // Col 1: Image from dt > a > img
    const img = card.querySelector('dt img');
    const imageCell = [];
    if (img) imageCell.push(img);

    // Col 2: Title + description + CTA from dd
    const contentCell = [];
    const title = card.querySelector('dd h4');
    if (title) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      p.append(strong);
      contentCell.push(p);
    }

    // Description (span in dd > div, present in news teasers but not quick links)
    const desc = card.querySelector('dd > div > span');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.push(p);
    }

    // CTA link from .teaserLinkDiv a or dd > div > a (quick links)
    const ctaLink = card.querySelector('.teaserLinkDiv a') || card.querySelector('dd > div > a');
    if (ctaLink) contentCell.push(ctaLink);

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pft', cells });
  element.replaceWith(block);
}
