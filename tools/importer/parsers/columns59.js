/* global WebImporter */
export default function parse(element, { document }) {
  // Block header EXACTLY as in the example
  const headerRow = ['Columns (columns59)'];

  // Find row container: usually the only .row inside
  let rowDiv = element.querySelector('.row');
  if (!rowDiv) rowDiv = element;

  // Find all columns within the row (immediate children with .avd-column)
  const columnDivs = Array.from(rowDiv.children).filter(
    child => child.classList && child.classList.contains('avd-column')
  );

  // Edge case: fallback if columns are nested deeper
  let columns = columnDivs;
  if (columns.length === 0) {
    // Try one level deeper
    columns = [];
    Array.from(rowDiv.children).forEach(child => {
      const found = child.querySelectorAll(':scope > .avd-column');
      found.forEach(col => columns.push(col));
    });
  }

  // For each column, select the visible content as robustly as possible
  // Reference the highest-level div containing content
  const columnCells = columns.map(col => {
    // If .image or .text blocks inside, use that div
    let contentDiv = null;
    for (const inner of Array.from(col.children)) {
      if (inner.classList && (inner.classList.contains('image') || inner.classList.contains('text'))) {
        contentDiv = inner;
        break;
      }
      // Or if a wrapper with non-empty children
      if (inner.children.length) {
        contentDiv = inner;
        break;
      }
    }
    // Fallback: use column div itself
    return contentDiv || col;
  });

  // Structure: header, then a ROW with one cell per column
  const cells = [headerRow, columnCells];

  // Create the table using referenced elements
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
