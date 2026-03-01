/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Rossmann corporate website cleanup
 * Purpose: Remove site-wide non-content elements before and after block parsing
 * Applies to: unternehmen.rossmann.de (all templates)
 * Generated: 2026-02-27
 *
 * SELECTORS EXTRACTED FROM: captured DOM during migration of https://unternehmen.rossmann.de/
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header/navigation
    // Found in captured DOM: <header id="site-header"><nav>...</nav></header>
    WebImporter.DOMUtils.remove(element, [
      '#site-header',
      'header',
    ]);

    // Remove footer
    // Found in captured DOM: <footer id="footer" class="footer">...</footer>
    WebImporter.DOMUtils.remove(element, [
      '#footer',
      'footer',
    ]);

    // Remove breadcrumbs
    // Found in captured DOM: <ul class="breadcrumbs container breadcrumb breadcrumb-right">
    WebImporter.DOMUtils.remove(element, [
      '.breadcrumbs',
    ]);

    // Remove search forms (header and mobile)
    // Found in captured DOM: <form class="search-box header" id="tx_indexedsearch-header">
    // Found in captured DOM: <form class="search-box mobile" id="tx_indexedsearch-mobile">
    WebImporter.DOMUtils.remove(element, [
      '#tx_indexedsearch-header',
      '#tx_indexedsearch-mobile',
      'form.search-box',
    ]);

    // Remove back-to-top button
    // Found in captured DOM: <div id="toTop" class="to-top">
    WebImporter.DOMUtils.remove(element, [
      '#toTop',
      '.to-top',
    ]);

    // Remove YouTube cookie consent overlays
    // Found in captured DOM: <div class="video-embed__no-cookie">
    WebImporter.DOMUtils.remove(element, [
      '.video-embed__no-cookie',
    ]);

    // Remove base64-encoded SVG icon images used for decorative arrows/icons
    // Found in captured DOM: <img src="data:image/svg+xml;base64,...">
    const svgIcons = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    svgIcons.forEach((img) => img.remove());

    // Remove "Pressemitteilung" label overlays on press release images
    // Found in captured DOM: <div class="press-releases__item-media-shield">
    WebImporter.DOMUtils.remove(element, [
      '.press-releases__item-media-shield',
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
