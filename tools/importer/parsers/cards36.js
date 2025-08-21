/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card containers in the provided HTML structure
  const cardContainers = [];
  element.querySelectorAll('.avd-column').forEach((col) => {
    // In each column, find the box-button__container
    const btnContainer = col.querySelector('.box-button__container');
    if (btnContainer) {
      cardContainers.push(btnContainer);
    }
  });

  // Build the table rows
  const rows = [];
  // Header row, as required
  rows.push(['Cards (cards36)']);

  // Now build each card row
  cardContainers.forEach((btnContainer) => {
    // The <a> is the main wrapper for each card
    const link = btnContainer.querySelector('a.box-button__content');
    if (!link) return;
    // First cell: SVG icon (reference directly from the DOM)
    const svg = link.querySelector('svg');

    // Second cell: link with text as <strong>
    const p = link.querySelector('p.box-button__text');
    let cellContent;
    if (p) {
      const strong = document.createElement('strong');
      strong.textContent = p.textContent;
      const a = document.createElement('a');
      a.href = link.href;
      a.appendChild(strong);
      cellContent = a;
    } else {
      // Fallback: just link with no strong
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      cellContent = a;
    }

    rows.push([
      svg || '',
      cellContent,
    ]);
  });

  // Create and replace with the new table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
