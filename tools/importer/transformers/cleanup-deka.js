/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Deka Investments website cleanup
 * Purpose: Remove site-wide non-content elements before and after block parsing
 * Applies to: www.deka.de (all templates)
 * Generated: 2026-03-04
 *
 * SELECTORS EXTRACTED FROM: captured DOM during migration of https://www.deka.de/privatkunden
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header/navigation
    // Found in captured DOM: <div id="header"><header><nav>...</nav></header></div>
    WebImporter.DOMUtils.remove(element, [
      '#header',
      'header',
      'nav',
    ]);

    // Remove footer
    // Found in captured DOM: <footer>...</footer>
    WebImporter.DOMUtils.remove(element, [
      'footer',
    ]);

    // Remove notification/maintenance banners
    // Found in captured DOM: <div class="notification-banner__background">...</div>
    WebImporter.DOMUtils.remove(element, [
      '.notification-banner__background',
      '[class*="notification-banner"]',
    ]);

    // Remove skip-to-content accessibility link
    // Found in captured DOM: <div class="skip-to-content">...</div>
    WebImporter.DOMUtils.remove(element, [
      '.skip-to-content',
    ]);

    // Remove cookie consent wrapper
    // Found in captured DOM: <div id="cmpwrapper" class="cmpwrapper">
    WebImporter.DOMUtils.remove(element, [
      '#cmpwrapper',
      '.cmpwrapper',
    ]);

    // Remove search overlays
    // Found in captured DOM: <div class="quick-search-overlay">...</div>
    WebImporter.DOMUtils.remove(element, [
      '.quick-search-overlay',
      '.quick-search',
    ]);

    // Remove back-to-top button
    // Found in captured DOM: <a class="back-to-top">...</a>
    WebImporter.DOMUtils.remove(element, [
      '.back-to-top',
      '[class*="back-to-top"]',
    ]);

    // Remove base64-encoded SVG icon images (decorative navigation arrows, icons)
    // Found in captured DOM: <img src="data:image/svg+xml;base64,...">
    const svgIcons = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    svgIcons.forEach((img) => img.remove());

    // Remove screen-reader-only elements
    // Found in captured DOM: <span class="sr-only">Rubrik</span>, <h1 class="sr-only">Startseite</h1>
    WebImporter.DOMUtils.remove(element, [
      '.sr-only',
    ]);

    // Remove mobile-only duplicates (we use desktop layout for import)
    // Found in captured DOM: <div class="hauptthema-mobile lg:hidden">
    WebImporter.DOMUtils.remove(element, [
      '.hauptthema-mobile',
      '[class*="mobile"]:not([class*="desktop"])',
    ]);

    // Remove material icons (decorative)
    // Found in captured DOM: <span class="material-icons">keyboard_arrow_down</span>
    WebImporter.DOMUtils.remove(element, [
      '.material-icons',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining unwanted HTML elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'source',
    ]);
  }
}
