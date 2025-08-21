/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block (matches block name exactly)
  const headerRow = ['Columns (columns70)'];

  // Find the row containing columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate child .avd-column (columns)
  const columnDivs = Array.from(row.children).filter(col => col.classList.contains('avd-column'));

  // For each column, find its main content wrapper
  const cellsRow = columnDivs.map(col => {
    // The actual content wrapper is the first child <div> inside the column
    // This contains either .text or .image, etc.
    let contentWrapper = col.querySelector(':scope > div');
    // If wrapper exists and has content, use it; otherwise, fallback to the column itself
    if (contentWrapper && contentWrapper.childNodes.length > 0) {
      return contentWrapper;
    } else {
      return col;
    }
  });

  // Only build the table if there's at least one column with content
  if (cellsRow.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      cellsRow
    ], document);
    element.replaceWith(table);
  }
}
