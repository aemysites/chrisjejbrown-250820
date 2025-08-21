/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the deepest row with .row-align-middle
  let cardRow = element.querySelector('.row-align-middle');
  if (!cardRow) {
    // fallback: try to find a .avd-column with image and text
    const candidate = element.querySelector('.avd-column img');
    if (candidate) {
      cardRow = candidate.closest('.row-align-middle') || candidate.parentElement;
    } else {
      // fallback: use the element itself
      cardRow = element;
    }
  }

  // Cards (cards58) header
  const headerRow = ['Cards (cards58)'];
  
  // Extract card columns: expect two columns
  const columns = cardRow.querySelectorAll(':scope > .avd-column');
  if (columns.length < 2) return;

  // --- First column: image/icon or visual ---
  const imgCol = columns[0];
  let imgEl = imgCol.querySelector('img');
  let visual = imgEl || null;
  if (!visual) {
    // fallback: if no image, just use any content from imgCol
    visual = imgCol.firstElementChild || document.createElement('div');
  }

  // --- Second column: text content and CTA/button ---
  const textCol = columns[1];
  const textFragments = [];

  // Collect all paragraphs and spans for semantic meaning
  const rte = textCol.querySelector('.rte-text-p');
  if (rte) {
    // Use all children to keep formatting (span, b, i, etc)
    Array.from(rte.children).forEach(child => {
      textFragments.push(child);
    });
  }

  // Find a button/link, add it to the end
  const button = textCol.querySelector('.button a');
  if (button) {
    textFragments.push(button);
  }

  // Compose table structure according to spec (2 columns, 2 rows)
  const cells = [
    headerRow,
    [visual, textFragments]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
