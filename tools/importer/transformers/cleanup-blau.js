/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Blau.de website cleanup
 * Purpose: Remove site-wide non-content elements before and after block parsing
 * Applies to: www.blau.de (all templates)
 * Generated: 2026-03-06
 *
 * SELECTORS EXTRACTED FROM: captured DOM during migration of https://www.blau.de/guide/tipps/iphone-17e-groesse/
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation
    WebImporter.DOMUtils.remove(element, [
      'tef-navigation',
      '#id-24040',
      'nav',
    ]);

    // Remove footer
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '#bottom',
    ]);

    // Remove breadcrumb
    WebImporter.DOMUtils.remove(element, [
      '.breadcrumb',
    ]);

    // Remove cookie consent
    WebImporter.DOMUtils.remove(element, [
      '[class*="usercentrics"]',
      '[id*="usercentrics"]',
      '#uc-main-dialog',
    ]);

    // Remove skip-to-content accessibility link
    WebImporter.DOMUtils.remove(element, [
      'a[href="#content"]',
    ]);

    // Remove energy labels (decorative)
    WebImporter.DOMUtils.remove(element, [
      'energy-label',
      'energy-label-item',
      '.energy-label-items',
    ]);

    // Remove custom web components that are decorative
    WebImporter.DOMUtils.remove(element, [
      'tef-icon',
    ]);

    // Remove meta-bar / search overlay
    WebImporter.DOMUtils.remove(element, [
      '.metabar__inner',
    ]);

    // Remove login/cart layers
    WebImporter.DOMUtils.remove(element, [
      'tef-navigation-layer:not(:has(nav))',
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
