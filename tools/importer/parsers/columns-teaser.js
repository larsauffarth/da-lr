/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-teaser block
 *
 * Source: https://unternehmen.rossmann.de/
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Columns-Teaser")
 * - Row 2: [column1 content | column2 content]
 *
 * Handles three source HTML patterns:
 *
 * Pattern A - Single full-width teaser (sustainability, #c370):
 * <section class="content-teaser">
 *   <div class="grid">
 *     <article class="col-12">
 *       <a class="content-teaser__item b-creme50" href="...">
 *         <div class="content-teaser__item-img"><picture><img></picture></div>
 *         <div class="content-teaser__item-text"><h2><span>title</span></h2><p>desc</p></div>
 *       </a>
 *     </article>
 *   </div>
 * </section>
 *
 * Pattern B - Two-column teasers (brands/international, #c360):
 * <section class="content-teaser">
 *   <div class="grid">
 *     <article class="col-6"><a class="content-teaser__item b-intensivrot">...</a></article>
 *     <article class="col-6"><a class="content-teaser__item b-intensivrot">...</a></article>
 *   </div>
 * </section>
 *
 * Pattern C - Image + text layout (new stores, #c690):
 * <section class="content-text bg-intensivrot">
 *   <div class="content-text__wrap image">
 *     <picture class="content-text__picture"><img></picture>
 *     <div class="content-text__block"><h2>...</h2><p>...</p><a>...</a></div>
 *   </div>
 * </section>
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which pattern we're dealing with
  const teaserItems = element.querySelectorAll('.content-teaser__item');
  const contentTextWrap = element.querySelector('.content-text__wrap');

  if (teaserItems.length === 1) {
    // Pattern A: Single full-width teaser (e.g., sustainability section)
    const item = teaserItems[0];
    const img = item.querySelector('.content-teaser__item-img img') ||
                item.querySelector('picture img') ||
                item.querySelector('img');
    const heading = item.querySelector('.content-teaser__item-text h2 span') ||
                    item.querySelector('.content-teaser__item-text h2') ||
                    item.querySelector('h2');
    const desc = item.querySelector('.content-teaser__item-text p');
    const linkHref = item.href || item.getAttribute('href');

    // Column 1: Image
    const col1 = document.createElement('div');
    if (img) {
      col1.appendChild(img.cloneNode(true));
    }

    // Column 2: Heading (linked) + description
    const col2 = document.createElement('div');
    if (heading) {
      const h2 = document.createElement('h2');
      if (linkHref) {
        const a = document.createElement('a');
        a.href = linkHref;
        a.textContent = heading.textContent.trim();
        h2.appendChild(a);
      } else {
        h2.textContent = heading.textContent.trim();
      }
      col2.appendChild(h2);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      col2.appendChild(p);
    }

    cells.push([col1, col2]);
  } else if (teaserItems.length >= 2) {
    // Pattern B: Two-column teasers (e.g., brands + international)
    const row = [];

    teaserItems.forEach((item) => {
      const col = document.createElement('div');

      const img = item.querySelector('.content-teaser__item-img img') ||
                  item.querySelector('picture img') ||
                  item.querySelector('img');
      const heading = item.querySelector('.content-teaser__item-text h2 span') ||
                      item.querySelector('.content-teaser__item-text h2') ||
                      item.querySelector('h2');
      const desc = item.querySelector('.content-teaser__item-text p');
      const linkHref = item.href || item.getAttribute('href');

      if (img) {
        col.appendChild(img.cloneNode(true));
      }
      if (heading) {
        const h2 = document.createElement('h2');
        if (linkHref) {
          const a = document.createElement('a');
          a.href = linkHref;
          a.textContent = heading.textContent.trim();
          h2.appendChild(a);
        } else {
          h2.textContent = heading.textContent.trim();
        }
        col.appendChild(h2);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        col.appendChild(p);
      }

      row.push(col);
    });

    cells.push(row);
  } else if (contentTextWrap) {
    // Pattern C: Image + text layout (e.g., new stores CTA)
    const img = contentTextWrap.querySelector('.content-text__picture img') ||
                contentTextWrap.querySelector('picture img') ||
                contentTextWrap.querySelector('img');
    const heading = contentTextWrap.querySelector('.content-text__block h2.title') ||
                    contentTextWrap.querySelector('.content-text__block h2') ||
                    contentTextWrap.querySelector('h2');
    const desc = contentTextWrap.querySelector('.content-text__block p');
    const ctaLink = contentTextWrap.querySelector('.content-text__block a.button-link') ||
                    contentTextWrap.querySelector('.content-text__block a');

    // Column 1: Image
    const col1 = document.createElement('div');
    if (img) {
      col1.appendChild(img.cloneNode(true));
    }

    // Column 2: Heading + description + CTA
    const col2 = document.createElement('div');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      col2.appendChild(h2);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      col2.appendChild(p);
    }
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      col2.appendChild(a);
    }

    cells.push([col1, col2]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Teaser', cells });
  element.replaceWith(block);
}
