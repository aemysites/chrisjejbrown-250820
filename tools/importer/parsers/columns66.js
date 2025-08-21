/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns: .row > .row-align-middle > .avd-column
  let columns = [];
  const row = element.querySelector('.row');
  if (row) {
    const align = row.querySelector('.row-align-middle');
    if (align) {
      columns = Array.from(align.children).filter(child => child.classList.contains('avd-column'));
    }
  }
  // Fallback: Find columns directly if above fails
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.avd-column'));
  }
  // Handle edge case: no columns found
  if (columns.length === 0) {
    // If no columns are found, do not replace the element
    return;
  }
  // For each column, grab its main content block
  const colCells = columns.map(col => {
    // Use the first child div inside .avd-column (usually wraps the actual content)
    const cellContent = col.querySelector(':scope > div') || col;
    return cellContent;
  });
  // Header row - must match example exactly
  const headerRow = ['Columns (columns66)'];
  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    colCells
  ], document);
  // Replace the original element
  element.replaceWith(table);
}
