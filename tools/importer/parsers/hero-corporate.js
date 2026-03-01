/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-corporate block
 *
 * Source: https://unternehmen.rossmann.de/
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Hero-Corporate")
 * - Row 2: Background image (single image, full-width)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="container content-header">
 *   <div class="content-header-pic-wrap no-gradient">
 *     <picture class="content-header-picture">
 *       <source>...<source>...
 *       <img class="content-header-img" src="..." alt="">
 *     </picture>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  // Extract the hero image from the content-header section
  // Found in captured DOM: <img class="content-header-img" src="...">
  const img = element.querySelector('.content-header-img') ||
              element.querySelector('picture img') ||
              element.querySelector('img');

  // Build cells array - hero-corporate is image-only (no text overlay)
  const cells = [];

  if (img) {
    cells.push([img]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Corporate', cells });
  element.replaceWith(block);
}
