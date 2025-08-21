/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find the deepest .row containing avd-column children
  let row = element;
  while (row && row.querySelector('.row')) {
    row = row.querySelector('.row');
    // Stop if no further nested row exists or row has direct avd-column children
    const directColumns = row ? Array.from(row.children).filter(col => col.classList && col.classList.contains('avd-column')) : [];
    if (directColumns.length > 0) break;
  }
  if (!row) return;

  // Get all direct avd-column children from the row
  const columns = Array.from(row.children).filter(col => col.classList && col.classList.contains('avd-column'));
  if (columns.length === 0) return;

  // For each column, include all direct inner content to capture all text and structure
  const columnCells = columns.map(col => {
    // Find the deepest meaningful content container inside the column
    let content = col;
    // If there are nested divs, prefer the deepest .html-component-inner, else deepest div with content
    const htmlInner = col.querySelector('.html-component-inner');
    if (htmlInner) {
      content = htmlInner;
    } else {
      // Fallback: Find the deepest div with children
      let current = col;
      while (current.querySelector('div')) {
        const next = current.querySelector('div');
        // If next div has no children, break
        if (!next || next.children.length === 0) break;
        current = next;
      }
      content = current;
    }
    // Always reference, never clone, to preserve document context
    return content;
  });

  // Build cells array: header row, then columns row
  const cells = [
    ['Columns (columns26)'],
    columnCells
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table block
  element.replaceWith(table);
}
