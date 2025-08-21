/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match block name exactly
  const headerRow = ['Columns (columns67)'];

  // Find all columns in the block, these are .avd-column elements
  // The parent structure may contain extra wrappers, so select all .avd-column descendants
  const columns = Array.from(element.querySelectorAll('.avd-column'));

  // Edge case: if no columns found, fallback to direct child divs
  let cells;
  if (columns.length > 0) {
    cells = columns.map(col => {
      // Use the entire column content as cell value
      // Some columns have an inner wrapper div, always take the contents inside the column
      // We'll include the column's first child (which contains all .text.parbase blocks)
      // Defensive: if there's no child, fall back to col itself
      const inner = col.firstElementChild || col;
      return inner;
    });
  } else {
    // Fallback: try immediate children
    cells = Array.from(element.children);
  }

  // Only build additional rows if the source HTML has multiple rows (not in this case)
  const rows = [headerRow, cells];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
