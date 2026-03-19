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

  // tools/importer/import-pft-homepage.js
  var import_pft_homepage_exports = {};
  __export(import_pft_homepage_exports, {
    default: () => import_pft_homepage_default
  });

  // tools/importer/parsers/carousel-pft.js
  function parse(element, { document: document2 }) {
    const slides = element.querySelectorAll(":scope > li.jcarousel-item");
    const cells = [];
    slides.forEach((slide) => {
      const link = slide.querySelector("a.viewport_link");
      const img = slide.querySelector(".slider-image-element > img");
      const heading = slide.querySelector(".headline-wrapper h1, .headline-wrapper h2");
      const ctaText = slide.querySelector(".viewportlink-wrapper p.headlinelink");
      const imageCell = [];
      if (img) {
        const hiddenImg = slide.querySelector(".viewport-image");
        if (hiddenImg) hiddenImg.remove();
        imageCell.push(img);
      }
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (ctaText && link) {
        const a = document2.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-pft", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pft.js
  function parse2(element, { document: document2 }) {
    const cards = element.querySelectorAll(":scope dl");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("dt img");
      const imageCell = [];
      if (img) imageCell.push(img);
      const contentCell = [];
      const title = card.querySelector("dd h4");
      if (title) {
        const p = document2.createElement("p");
        const strong = document2.createElement("strong");
        strong.textContent = title.textContent;
        p.append(strong);
        contentCell.push(p);
      }
      const desc = card.querySelector("dd > div > span");
      if (desc && desc.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.push(p);
      }
      const ctaLink = card.querySelector(".teaserLinkDiv a") || card.querySelector("dd > div > a");
      if (ctaLink) contentCell.push(ctaLink);
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-pft", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/pft-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-pc-sdk"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#fancybox-tmp",
        "#fancybox-loading",
        "#fancybox-overlay",
        "#fancybox-wrap"
      ]);
      WebImporter.DOMUtils.remove(element, ["#tiptip_holder"]);
      WebImporter.DOMUtils.remove(element, [".scroll2top-container"]);
      WebImporter.DOMUtils.remove(element, [
        ".slider",
        "a.sliderPrev",
        "a.sliderNext",
        "a.prev-aside",
        "a.next-aside"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header.mainHead"]);
      WebImporter.DOMUtils.remove(element, ["footer.mainFooter"]);
      WebImporter.DOMUtils.remove(element, ["div.contact_footer"]);
      WebImporter.DOMUtils.remove(element, [".social_tiptip"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link", "iframe"]);
    }
  }

  // tools/importer/transformers/pft-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-pft-homepage.js
  var parsers = {
    "carousel-pft": parse,
    "cards-pft": parse2
  };
  var PAGE_TEMPLATE = {
    name: "pft-homepage",
    description: "PFT corporate homepage - German language landing page with company overview, products, and services",
    urls: ["https://www.pft.net/de/"],
    blocks: [
      {
        name: "carousel-pft",
        instances: [
          "section#vpHome .carouselViewport ul.jcarousel-skin",
          "section#vp2036531 .carouselViewport ul.jcarousel-skin"
        ]
      },
      {
        name: "cards-pft",
        instances: [
          "section#vp2036530 .carouselTeaser.tribleTeaser",
          "section#vp2036532 .teaser.threeTeasers.themenTeaser"
        ]
      }
    ],
    sections: [
      {
        id: "section-01-hero-carousel",
        name: "Hero Carousel",
        selector: "section#vpHome",
        style: null,
        blocks: ["carousel-pft"],
        defaultContent: []
      },
      {
        id: "section-02-news-teasers",
        name: "News Teasers",
        selector: "section#vp2036530",
        style: null,
        blocks: ["cards-pft"],
        defaultContent: [
          "section#vp2036530 h3",
          "section#vp2036530 a.buttonlink"
        ]
      },
      {
        id: "section-03-products-carousel",
        name: "Products Carousel",
        selector: "section#vp2036531",
        style: null,
        blocks: ["carousel-pft"],
        defaultContent: []
      },
      {
        id: "section-04-quick-links",
        name: "Quick Links",
        selector: "section#vp2036532",
        style: null,
        blocks: ["cards-pft"],
        defaultContent: [
          "section#vp2036532 h3:first-child",
          "section#vp2036532 section.linkList"
        ]
      },
      {
        id: "section-05-contact",
        name: "Contact Footer Bar",
        selector: "div.contact_footer",
        style: "pft-dark",
        blocks: [],
        defaultContent: [
          "div.contact_footer h3",
          "div.contact_footer p"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_pft_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_pft_homepage_exports);
})();
