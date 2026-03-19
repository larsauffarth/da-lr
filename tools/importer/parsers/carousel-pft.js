/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-pft. Base: carousel.
 * Source: https://www.pft.net/de/
 * Selectors from captured DOM: ul.jcarousel-skin > li.jcarousel-item
 * Each slide: a.viewport_link wrapping img + h1/h2 headline + p.headlinelink CTA
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll(':scope > li.jcarousel-item');
  const cells = [];

  slides.forEach((slide) => {
    const link = slide.querySelector('a.viewport_link');
    const img = slide.querySelector('.slider-image-element > img');
    const heading = slide.querySelector('.headline-wrapper h1, .headline-wrapper h2');
    const ctaText = slide.querySelector('.viewportlink-wrapper p.headlinelink');

    // Col 1: Image
    const imageCell = [];
    if (img) {
      // Remove duplicate hidden viewport-image
      const hiddenImg = slide.querySelector('.viewport-image');
      if (hiddenImg) hiddenImg.remove();
      imageCell.push(img);
    }

    // Col 2: Heading + CTA text with link
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (ctaText && link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = ctaText.textContent.trim();
      contentCell.push(a);
    } else if (ctaText) {
      contentCell.push(ctaText);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-pft', cells });
  element.replaceWith(block);
}
