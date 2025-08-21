/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header, EXACTLY as in the example
  const headerRow = ['Columns (columns21)'];

  // Find the innermost .row-align-middle containing .avd-column columns
  let columnsRow = null;
  const allRows = Array.from(element.querySelectorAll('.row'));
  for (const row of allRows) {
    const alignMiddle = row.querySelector('.row-align-middle');
    if (alignMiddle && alignMiddle.querySelector('.avd-column')) {
      columnsRow = alignMiddle;
      break;
    }
  }

  if (!columnsRow) {
    // Fallback: Try to find columns directly in the element
    columnsRow = element.querySelector('.row-align-middle') || element;
  }

  // Find all direct children columns
  const columns = Array.from(columnsRow.querySelectorAll(':scope > div')).filter(
    (col) => col.classList.contains('avd-column')
  );

  // For each column, reference the meaningful content
  const columnsRowCells = columns.map((col) => {
    // The column's main container might have nested divs
    // Find direct children that are not pure spacers
    let containers = Array.from(col.children);
    // Sometimes .avd-column > div > ...
    if (containers.length === 1 && containers[0].tagName === 'DIV') {
      containers = Array.from(containers[0].children);
    }
    // Filter out spacers and empty html blocks
    containers = containers.filter((child) => {
      if (child.classList.contains('html')) {
        // Check for a .spacer inside
        return !child.querySelector('.spacer');
      }
      // Ignore empty containers
      return child.innerHTML.trim() !== '';
    });
    // If only one meaningful item, use that
    if (containers.length === 1) return containers[0];
    // If multiple, return as array
    return containers;
  });

  // Final block table
  const cells = [headerRow, columnsRowCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
