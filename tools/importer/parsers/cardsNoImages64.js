/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches the example exactly
  const headerRow = ['Cards (cardsNoImages64)'];
  const cells = [headerRow];

  // Find all direct .column-control blocks with .row children (top-level cards)
  // These are the true 'card' containers in the block
  const cardSections = Array.from(element.querySelectorAll(
    ':scope > div > div.row > div > div > div.column-control'
  ));

  cardSections.forEach(cardSection => {
    // Each card is a .row with two columns
    const row = cardSection.querySelector(':scope > div.row');
    if (!row) return;
    const cols = row.querySelectorAll(':scope > div');
    if (cols.length < 2) return;

    // LEFT column: usually contains the heading (h4, h3, etc.)
    const leftCol = cols[0];
    let heading = leftCol.querySelector('h1,h2,h3,h4,h5,h6');
    // If heading is missing, use all trimmed text from leftCol as strong
    if (!heading) {
      const leftColText = leftCol.textContent.trim();
      if (leftColText) {
        heading = document.createElement('strong');
        heading.textContent = leftColText;
      }
    }

    // RIGHT column: contains the descriptive and/or rich content
    const rightCol = cols[1];
    let contentEls = [];
    // Gather .text > * only, in order
    Array.from(rightCol.querySelectorAll(':scope > .text')).forEach(textBlock => {
      Array.from(textBlock.children).forEach(child => {
        contentEls.push(child);
      });
    });
    // If no .text found, fallback to any direct <p>, <ul>, <ol>, <h4> etc. in rightCol
    if (contentEls.length === 0) {
      Array.from(rightCol.children).forEach(child => {
        if (/^(P|UL|OL|H[1-6]|STRONG|B)$/i.test(child.tagName)) {
          contentEls.push(child);
        }
      });
    }
    // If still nothing, fallback to text content
    if (contentEls.length === 0) {
      const rightColText = rightCol.textContent.trim();
      if (rightColText) {
        const para = document.createElement('p');
        para.textContent = rightColText;
        contentEls.push(para);
      }
    }

    // Compose the single card cell content, heading first
    let cardCellContent = [];
    if (heading) cardCellContent.push(heading);
    if (contentEls.length > 0) cardCellContent = cardCellContent.concat(contentEls);
    if (cardCellContent.length > 0) {
      cells.push([cardCellContent]);
    }
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
