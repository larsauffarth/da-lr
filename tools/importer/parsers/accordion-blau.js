/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-blau block
 *
 * Source: https://www.blau.de/guide/tipps/iphone-17e-groesse/
 * Base Block: accordion
 *
 * Source HTML Pattern:
 * <div class="panel-group section-accordion">
 *   <div class="panel">
 *     <h3><button>Question text</button></h3>
 *     <div class="accordion-content">
 *       <article><div class="body-text"><p>Answer text</p></div></article>
 *     </div>
 *   </div>
 * </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  const panels = element.querySelectorAll('.panel');
  panels.forEach((panel) => {
    // Question
    const questionEl = panel.querySelector('h3 button, h3');
    const question = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = questionEl ? questionEl.textContent.trim() : '';
    question.appendChild(strong);

    // Answer
    const answerEl = panel.querySelector('.accordion-content .body-text, .accordion-content');
    const answer = document.createElement('div');
    if (answerEl) {
      const paragraphs = answerEl.querySelectorAll('p');
      paragraphs.forEach((p) => {
        answer.appendChild(p.cloneNode(true));
      });
    }

    cells.push([question, answer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion-Blau', cells });
  element.replaceWith(block);
}
