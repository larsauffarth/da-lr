/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: PFT site cleanup.
 * Selectors from captured DOM of https://www.pft.net/de/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent dialog (from captured DOM: div#onetrust-consent-sdk)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-pc-sdk',
    ]);

    // Remove fancybox overlays (from captured DOM: div#fancybox-tmp, div#fancybox-loading, etc.)
    WebImporter.DOMUtils.remove(element, [
      '#fancybox-tmp',
      '#fancybox-loading',
      '#fancybox-overlay',
      '#fancybox-wrap',
    ]);

    // Remove tooltip widget (from captured DOM: div#tiptip_holder)
    WebImporter.DOMUtils.remove(element, ['#tiptip_holder']);

    // Remove scroll-to-top button (from captured DOM: div.scroll2top-container)
    WebImporter.DOMUtils.remove(element, ['.scroll2top-container']);

    // Remove carousel navigation controls (prev/next arrows, pagination dots)
    // These are UI controls, not authorable content
    WebImporter.DOMUtils.remove(element, [
      '.slider',
      'a.sliderPrev',
      'a.sliderNext',
      'a.prev-aside',
      'a.next-aside',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header (from captured DOM: header.mainHead)
    WebImporter.DOMUtils.remove(element, ['header.mainHead']);

    // Remove footer (from captured DOM: footer.mainFooter)
    WebImporter.DOMUtils.remove(element, ['footer.mainFooter']);

    // Remove contact footer bar (handled as separate footer content)
    WebImporter.DOMUtils.remove(element, ['div.contact_footer']);

    // Remove social share tooltip (from captured DOM: div.social_tiptip)
    WebImporter.DOMUtils.remove(element, ['.social_tiptip']);

    // Remove safe elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link', 'iframe']);
  }
}
