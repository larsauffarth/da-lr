var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-blau-guide-article.js
  var import_blau_guide_article_exports = {};
  __export(import_blau_guide_article_exports, {
    default: () => import_blau_guide_article_default
  });

  // tools/importer/parsers/hero-blau.js
  function parse(element, { document }) {
    const cells = [];
    const img = element.querySelector("figure img, picture img");
    const h1 = element.querySelector("h1");
    const date = element.querySelector(".small") || element.querySelector(".body-text p");
    const contentCell = document.createElement("div");
    if (h1) {
      const heading = document.createElement("h1");
      heading.textContent = h1.textContent.trim();
      contentCell.appendChild(heading);
    }
    if (date) {
      const p = document.createElement("p");
      p.textContent = date.textContent.trim();
      contentCell.appendChild(p);
    }
    const imageCell = document.createElement("div");
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }
    cells.push([contentCell, imageCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "Hero-Blau", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-blau.js
  function parse2(element, { document }) {
    const cells = [];
    const img = element.querySelector(".figures img, figure img");
    const imageCell = document.createElement("div");
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }
    const contentCell = document.createElement("div");
    const headline = element.querySelector(".headline, .content .headline");
    if (headline) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = headline.textContent.trim();
      p.appendChild(strong);
      contentCell.appendChild(p);
    }
    const text = element.querySelector(".content .text");
    if (text) {
      const clone = text.cloneNode(true);
      contentCell.appendChild(clone);
    }
    const links = element.querySelectorAll(".links a");
    links.forEach((link) => {
      if (link.closest(".energy-label-items")) return;
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      const p = document.createElement("p");
      p.appendChild(a);
      contentCell.appendChild(p);
    });
    cells.push([imageCell, contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "Teaser-Blau", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/callout-blau.js
  function parse3(element, { document }) {
    const cells = [];
    const contentCell = document.createElement("div");
    const paragraphs = element.querySelectorAll("p");
    paragraphs.forEach((p) => {
      contentCell.appendChild(p.cloneNode(true));
    });
    const lists = element.querySelectorAll("ul, ol");
    lists.forEach((list) => {
      contentCell.appendChild(list.cloneNode(true));
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "Callout-Blau", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-blau.js
  function parse4(element, { document }) {
    const cells = [];
    const panels = element.querySelectorAll(".panel");
    panels.forEach((panel) => {
      const questionEl = panel.querySelector("h3 button, h3");
      const question = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = questionEl ? questionEl.textContent.trim() : "";
      question.appendChild(strong);
      const answerEl = panel.querySelector(".accordion-content .body-text, .accordion-content");
      const answer = document.createElement("div");
      if (answerEl) {
        const paragraphs = answerEl.querySelectorAll("p");
        paragraphs.forEach((p) => {
          answer.appendChild(p.cloneNode(true));
        });
      }
      cells.push([question, answer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Accordion-Blau", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-blau.js
  function parse5(element, { document }) {
    const cells = [];
    const teasers = element.querySelectorAll(".teaser-short, article.teaser");
    teasers.forEach((teaser) => {
      const img = teaser.querySelector("figure img, picture img");
      const imageCell = document.createElement("div");
      if (img) {
        imageCell.appendChild(img.cloneNode(true));
      }
      const contentCell = document.createElement("div");
      const headline = teaser.querySelector(".headline");
      if (headline) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = headline.textContent.trim();
        p.appendChild(strong);
        contentCell.appendChild(p);
      }
      const text = teaser.querySelector(".text p");
      if (text) {
        contentCell.appendChild(text.cloneNode(true));
      }
      const cta = teaser.querySelector(".links a");
      if (cta) {
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        contentCell.appendChild(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards-Blau", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cleanup-blau.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "tef-navigation",
        "#id-24040",
        "nav"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer",
        "#bottom"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".breadcrumb"
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[class*="usercentrics"]',
        '[id*="usercentrics"]',
        "#uc-main-dialog"
      ]);
      WebImporter.DOMUtils.remove(element, [
        'a[href="#content"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "energy-label",
        "energy-label-item",
        ".energy-label-items"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "tef-icon"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".metabar__inner"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "tef-navigation-layer:not(:has(nav))"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        "source"
      ]);
    }
  }

  // tools/importer/import-blau-guide-article.js
  var parsers = {
    "hero-blau": parse,
    "teaser-blau": parse2,
    "callout-blau": parse3,
    "accordion-blau": parse4,
    "cards-blau": parse5
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "blau-guide-article",
    description: "Blau.de guide article page with article header hero, key facts, table of contents, product teasers, comparison table, FAQ accordion, and related article cards",
    urls: [
      "https://www.blau.de/guide/tipps/iphone-17e-groesse/"
    ],
    blocks: [
      {
        name: "hero-blau",
        instances: ["article.article-image-right.primaryHeadline"]
      },
      {
        name: "teaser-blau",
        instances: [
          "article.teaser.teaser-wide:has(.links .link)",
          "article.teaser.teaser-wide:has(.headline)"
        ],
        section: "Product promotional teasers"
      },
      {
        name: "callout-blau",
        instances: ["div.alert.alert-info"],
        section: "Info/tip callout boxes"
      },
      {
        name: "accordion-blau",
        instances: ["div.panel-group.section-accordion"],
        section: "FAQ accordion"
      },
      {
        name: "cards-blau",
        instances: ["div.item-collection:has(.teaser-short)"],
        section: "Related article cards"
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function addSectionMetadata(document, parentDiv, style) {
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.setAttribute("colspan", "2");
    headerCell.textContent = "Section Metadata";
    headerRow.appendChild(headerCell);
    table.appendChild(headerRow);
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    keyCell.textContent = "style";
    const valueCell = document.createElement("td");
    valueCell.textContent = style;
    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
    parentDiv.appendChild(table);
  }
  function applySectionStructure(main, document) {
    const sections = main.querySelectorAll("section.section");
    if (sections.length === 0) {
      addSectionMetadata(document, main, "blau-content");
      return;
    }
    sections.forEach((section) => {
      const sectionId = section.id || "";
      const sectionClass = section.className || "";
      let style = "blau-content";
      const hasKeyFacts = section.querySelector("h2") && section.textContent.includes("Das Wichtigste auf einen Blick");
      const hasFazit = section.querySelector("h2") && section.textContent.includes("Fazit");
      if (hasKeyFacts || hasFazit) {
        style = "blau-grey-bg, blau-content";
      }
      const hr = document.createElement("hr");
      section.before(hr);
      while (section.firstChild) {
        section.before(section.firstChild);
      }
      const metadataDiv = document.createElement("div");
      addSectionMetadata(document, metadataDiv, style);
      section.before(metadataDiv.firstChild);
      section.remove();
    });
    if (main.firstElementChild && main.firstElementChild.tagName === "HR") {
      main.firstElementChild.remove();
    }
  }
  function addBlauPageMetadata(document, main) {
    const metaTables = main.querySelectorAll("table");
    let metaTable = null;
    metaTables.forEach((table) => {
      const th = table.querySelector("th");
      if (th && th.textContent.trim().toLowerCase() === "metadata") {
        metaTable = table;
      }
    });
    if (!metaTable) return;
    const navRow = document.createElement("tr");
    const navKey = document.createElement("td");
    navKey.textContent = "nav";
    const navVal = document.createElement("td");
    navVal.textContent = "/blau/nav";
    navRow.appendChild(navKey);
    navRow.appendChild(navVal);
    metaTable.appendChild(navRow);
    const footerRow = document.createElement("tr");
    const footerKey = document.createElement("td");
    footerKey.textContent = "footer";
    const footerVal = document.createElement("td");
    footerVal.textContent = "/blau/footer";
    footerRow.appendChild(footerKey);
    footerRow.appendChild(footerVal);
    metaTable.appendChild(footerRow);
    const themeRow = document.createElement("tr");
    const themeKey = document.createElement("td");
    themeKey.textContent = "theme";
    const themeVal = document.createElement("td");
    themeVal.textContent = "blau";
    themeRow.appendChild(themeKey);
    themeRow.appendChild(themeVal);
    metaTable.appendChild(themeRow);
  }
  var import_blau_guide_article_default = {
    /**
     * Main transformation function using one input / multiple outputs pattern
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      applySectionStructure(main, document);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      addBlauPageMetadata(document, main);
      const originalPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(`/blau${originalPath}`);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_blau_guide_article_exports);
})();
