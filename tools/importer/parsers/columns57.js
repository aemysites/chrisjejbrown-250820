/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row matches the example exactly
  const headerRow = ['Columns (columns57)'];

  // Find the column wrapper row
  const row = element.querySelector('.row');
  if (!row) return;

  // Find all columns inside the row
  // Each column has class 'avd-column', so we find all direct children under '.row-align-middle'
  const rowAlign = row.querySelector('.row-align-middle');
  if (!rowAlign) return;

  const columns = rowAlign.querySelectorAll(':scope > .avd-column');

  // If no columns found, don't process
  if (!columns || columns.length === 0) return;

  // Compose the content for each column
  const cells = [];
  columns.forEach((col) => {
    // The actual column content is under an inner <div>
    const inner = col.querySelector(':scope > div');
    if (!inner) {
      cells.push([]);
      return;
    }
    // Left column: text + button, Right column: image
    // The left column has class 'bgcAqua', right is 'lpm-column-transparent'
    if (col.classList.contains('bgcAqua')) {
      // Get all direct children of inner
      // Typically: .text and .button blocks (possibly others)
      const contents = Array.from(inner.children).filter((child) => {
        // Only use direct children that have content
        if (child.textContent.trim().length > 0 || child.querySelector('img')) {
          return true;
        }
        return false;
      });
      cells.push(contents);
    } else {
      // For right column, just include all direct children from inner
      const contents = Array.from(inner.children).filter((child) => {
        if (child.tagName === 'DIV' && child.querySelector('img')) return true;
        if (child.tagName === 'IMG') return true;
        return false;
      });
      // If none found, fallback: all children
      if (contents.length === 0) {
        cells.push(Array.from(inner.children));
      } else {
        cells.push(contents);
      }
    }
  });

  // Table data: header and columns row
  const tableData = [headerRow, cells];

  // Create and insert the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
