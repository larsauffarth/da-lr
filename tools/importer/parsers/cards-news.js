/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news block
 *
 * Source: https://unternehmen.rossmann.de/
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-News")
 * - Row 2-N: Each row = [image | date + title + description + CTA link]
 *
 * Source HTML Pattern (from captured DOM):
 * <section id="c697" class="container content-press-releases">
 *   <div class="content-text__block"><h2 class="title">...</h2></div>
 *   <div class="press-releases-inner list-item">
 *     <article class="press-releases__item">
 *       <div class="press-releases__item-text">
 *         <div class="press-releases__item-text-top">
 *           <p class="mb-20">date | category</p>
 *           <h2 class="press-releases__item-text-title"><strong>title</strong></h2>
 *         </div>
 *         <div class="press-releases__item-text-desc">
 *           <div class="press-releases__item-text-desc-wrap"><p>description</p></div>
 *           <a class="button-link" href="..."><span>mehr erfahren</span></a>
 *         </div>
 *       </div>
 *       <div class="press-releases__item-media">
 *         <picture class="press-releases__item-picture">
 *           <img class="press-releases__item-img" src="..." alt="">
 *         </picture>
 *       </div>
 *     </article>
 *   </div>
 * </section>
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all press release article items
  // Found in captured DOM: <article class="press-releases__item">
  const articles = element.querySelectorAll('article.press-releases__item');

  articles.forEach((article) => {
    // Extract image
    // Found in captured DOM: <img class="press-releases__item-img" src="...">
    const img = article.querySelector('.press-releases__item-img') ||
                article.querySelector('picture img') ||
                article.querySelector('img');

    // Extract date/category line
    // Found in captured DOM: <p class="mb-20">11.02.2026 | Unternehmen, Sortiment</p>
    const dateLine = article.querySelector('.press-releases__item-text-top p.mb-20') ||
                     article.querySelector('.press-releases__item-text-top p');

    // Extract title
    // Found in captured DOM: <h2 class="press-releases__item-text-title"><strong>...</strong></h2>
    const titleEl = article.querySelector('.press-releases__item-text-title') ||
                    article.querySelector('h2');

    // Extract description
    // Found in captured DOM: <div class="press-releases__item-text-desc-wrap"><p>...</p></div>
    const descEl = article.querySelector('.press-releases__item-text-desc-wrap p') ||
                   article.querySelector('.press-releases__item-text-desc p');

    // Extract CTA link
    // Found in captured DOM: <a class="button-link" href="..."><span>mehr erfahren</span></a>
    const ctaLink = article.querySelector('.press-releases__item-text-desc a.button-link') ||
                    article.querySelector('a.button-link');

    // Build image cell (column 1)
    const imageCell = document.createElement('div');
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }

    // Build text cell (column 2): date + title + description + CTA
    const textCell = document.createElement('div');

    if (dateLine) {
      textCell.appendChild(dateLine.cloneNode(true));
    }

    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCell.appendChild(strong);
    }

    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.appendChild(p);
    }

    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      textCell.appendChild(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-News', cells });
  element.replaceWith(block);
}
