/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for blau-guide-article template
import heroBlauParser from './parsers/hero-blau.js';
import teaserBlauParser from './parsers/teaser-blau.js';
import calloutBlauParser from './parsers/callout-blau.js';
import accordionBlauParser from './parsers/accordion-blau.js';
import cardsBlauParser from './parsers/cards-blau.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import cleanupBlauTransformer from './transformers/cleanup-blau.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-blau': heroBlauParser,
  'teaser-blau': teaserBlauParser,
  'callout-blau': calloutBlauParser,
  'accordion-blau': accordionBlauParser,
  'cards-blau': cardsBlauParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  cleanupBlauTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'blau-guide-article',
  description: 'Blau.de guide article page with article header hero, key facts, table of contents, product teasers, comparison table, FAQ accordion, and related article cards',
  urls: [
    'https://www.blau.de/guide/tipps/iphone-17e-groesse/',
  ],
  blocks: [
    {
      name: 'hero-blau',
      instances: ['article.article-image-right.primaryHeadline'],
    },
    {
      name: 'teaser-blau',
      instances: [
        'article.teaser.teaser-wide:has(.links .link)',
        'article.teaser.teaser-wide:has(.headline)',
      ],
      section: 'Product promotional teasers',
    },
    {
      name: 'callout-blau',
      instances: ['div.alert.alert-info'],
      section: 'Info/tip callout boxes',
    },
    {
      name: 'accordion-blau',
      instances: ['div.panel-group.section-accordion'],
      section: 'FAQ accordion',
    },
    {
      name: 'cards-blau',
      instances: ['div.item-collection:has(.teaser-short)'],
      section: 'Related article cards',
    },
  ],
};

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
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
        return;
      }
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Add section-metadata block to a section element
 */
function addSectionMetadata(document, parentDiv, style) {
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');
  headerCell.setAttribute('colspan', '2');
  headerCell.textContent = 'Section Metadata';
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  const row = document.createElement('tr');
  const keyCell = document.createElement('td');
  keyCell.textContent = 'style';
  const valueCell = document.createElement('td');
  valueCell.textContent = style;
  row.appendChild(keyCell);
  row.appendChild(valueCell);
  table.appendChild(row);

  parentDiv.appendChild(table);
}

/**
 * Insert section breaks and section-metadata for the blau guide article
 */
function applySectionStructure(main, document) {
  // The content inside <main> after transformer cleanup should be organized into sections.
  // We look for the original section boundaries from the source page.
  const sections = main.querySelectorAll('section.section');

  if (sections.length === 0) {
    // If no section elements found, apply a single blau-content style
    addSectionMetadata(document, main, 'blau-content');
    return;
  }

  sections.forEach((section) => {
    const sectionId = section.id || '';
    const sectionClass = section.className || '';

    // Determine the style for this section
    let style = 'blau-content';

    // Key facts section (section-decent with "Das Wichtigste") and Fazit section
    const hasKeyFacts = section.querySelector('h2')
      && section.textContent.includes('Das Wichtigste auf einen Blick');
    const hasFazit = section.querySelector('h2')
      && section.textContent.includes('Fazit');

    if (hasKeyFacts || hasFazit) {
      style = 'blau-grey-bg, blau-content';
    }

    // Move section children up and add hr separator + section-metadata
    const hr = document.createElement('hr');
    section.before(hr);

    // Move all child content out of the section element
    while (section.firstChild) {
      section.before(section.firstChild);
    }

    // Add section-metadata before where the section was
    const metadataDiv = document.createElement('div');
    addSectionMetadata(document, metadataDiv, style);
    section.before(metadataDiv.firstChild);

    // Remove the now-empty section element
    section.remove();
  });

  // Remove the first <hr> if it's the first child of main (no separator needed before first section)
  if (main.firstElementChild && main.firstElementChild.tagName === 'HR') {
    main.firstElementChild.remove();
  }
}

/**
 * Add page-level metadata for blau showcase (nav, footer, theme)
 */
function addBlauPageMetadata(document, main) {
  // Find or create the metadata table that WebImporter.rules.createMetadata generates
  const metaTables = main.querySelectorAll('table');
  let metaTable = null;

  metaTables.forEach((table) => {
    const th = table.querySelector('th');
    if (th && th.textContent.trim().toLowerCase() === 'metadata') {
      metaTable = table;
    }
  });

  if (!metaTable) return;

  // Add nav row
  const navRow = document.createElement('tr');
  const navKey = document.createElement('td');
  navKey.textContent = 'nav';
  const navVal = document.createElement('td');
  navVal.textContent = '/blau/nav';
  navRow.appendChild(navKey);
  navRow.appendChild(navVal);
  metaTable.appendChild(navRow);

  // Add footer row
  const footerRow = document.createElement('tr');
  const footerKey = document.createElement('td');
  footerKey.textContent = 'footer';
  const footerVal = document.createElement('td');
  footerVal.textContent = '/blau/footer';
  footerRow.appendChild(footerKey);
  footerRow.appendChild(footerVal);
  metaTable.appendChild(footerRow);

  // Add theme row
  const themeRow = document.createElement('tr');
  const themeKey = document.createElement('td');
  themeKey.textContent = 'theme';
  const themeVal = document.createElement('td');
  themeVal.textContent = 'blau';
  themeRow.appendChild(themeKey);
  themeRow.appendChild(themeVal);
  metaTable.appendChild(themeRow);
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function using one input / multiple outputs pattern
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
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

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply section structure with section-metadata and hr separators
    applySectionStructure(main, document);

    // 6. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Add blau-specific page metadata (nav, footer, theme)
    addBlauPageMetadata(document, main);

    // 8. Generate sanitized path with /blau/ prefix
    const originalPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(`/blau${originalPath}`);

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
