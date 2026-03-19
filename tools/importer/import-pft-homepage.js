/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselPftParser from './parsers/carousel-pft.js';
import cardsPftParser from './parsers/cards-pft.js';

// TRANSFORMER IMPORTS
import pftCleanupTransformer from './transformers/pft-cleanup.js';
import pftSectionsTransformer from './transformers/pft-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-pft': carouselPftParser,
  'cards-pft': cardsPftParser,
};

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'pft-homepage',
  description: 'PFT corporate homepage - German language landing page with company overview, products, and services',
  urls: ['https://www.pft.net/de/'],
  blocks: [
    {
      name: 'carousel-pft',
      instances: [
        'section#vpHome .carouselViewport ul.jcarousel-skin',
        'section#vp2036531 .carouselViewport ul.jcarousel-skin',
      ],
    },
    {
      name: 'cards-pft',
      instances: [
        'section#vp2036530 .carouselTeaser.tribleTeaser',
        'section#vp2036532 .teaser.threeTeasers.themenTeaser',
      ],
    },
  ],
  sections: [
    {
      id: 'section-01-hero-carousel',
      name: 'Hero Carousel',
      selector: 'section#vpHome',
      style: null,
      blocks: ['carousel-pft'],
      defaultContent: [],
    },
    {
      id: 'section-02-news-teasers',
      name: 'News Teasers',
      selector: 'section#vp2036530',
      style: null,
      blocks: ['cards-pft'],
      defaultContent: [
        'section#vp2036530 h3',
        'section#vp2036530 a.buttonlink',
      ],
    },
    {
      id: 'section-03-products-carousel',
      name: 'Products Carousel',
      selector: 'section#vp2036531',
      style: null,
      blocks: ['carousel-pft'],
      defaultContent: [],
    },
    {
      id: 'section-04-quick-links',
      name: 'Quick Links',
      selector: 'section#vp2036532',
      style: null,
      blocks: ['cards-pft'],
      defaultContent: [
        'section#vp2036532 h3:first-child',
        'section#vp2036532 section.linkList',
      ],
    },
    {
      id: 'section-05-contact',
      name: 'Contact Footer Bar',
      selector: 'div.contact_footer',
      style: 'pft-dark',
      blocks: [],
      defaultContent: [
        'div.contact_footer h3',
        'div.contact_footer p',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  pftCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [pftSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
