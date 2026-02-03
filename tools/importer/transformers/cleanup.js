/* eslint-disable */
/* global WebImporter */

/**
 * DOM Cleanup Transformer
 *
 * Removes common unwanted elements before parsing blocks.
 * Applied to entire document before block parsing.
 *
 * Source: https://www.nescafe-dolcegusto.com.br/
 * Generated: 2026-02-03
 */
export default function transform(document) {
  // Remove script tags
  document.querySelectorAll('script').forEach((el) => el.remove());

  // Remove style tags
  document.querySelectorAll('style').forEach((el) => el.remove());

  // Remove navigation elements (header/footer handled separately)
  document.querySelectorAll('nav, .navigation, .nav-menu').forEach((el) => el.remove());

  // Remove tracking/analytics elements
  document.querySelectorAll('[data-analytics], [data-tracking], .analytics').forEach((el) => el.remove());

  // Remove hidden elements
  document.querySelectorAll('[aria-hidden="true"], .hidden, .sr-only').forEach((el) => el.remove());

  // Remove social share widgets
  document.querySelectorAll('.social-share, .share-buttons, [data-share]').forEach((el) => el.remove());

  // Remove cookie consent banners
  document.querySelectorAll('.cookie-banner, .cookie-consent, #cookie-notice').forEach((el) => el.remove());

  // Remove WhatsApp floating buttons
  document.querySelectorAll('[data-whatsapp], .whatsapp-button, .float-button').forEach((el) => el.remove());

  // Clean empty divs
  document.querySelectorAll('div:empty').forEach((el) => el.remove());

  // Remove inline styles that might interfere
  document.querySelectorAll('[style]').forEach((el) => {
    el.removeAttribute('style');
  });

  // Remove data attributes (cleanup)
  document.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('data-') && !attr.name.includes('block')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  console.log('✅ DOM cleanup transformer completed');
}
