/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Columns (columns62)'];

  // Find the main row that contains the columns (there may be nested .column-control > .row in some structures)
  let mainRow = element.querySelector('.row');
  if (!mainRow) mainRow = element;

  // Find the columns within the mainRow
  // They are divs with .avd-column but may be nested inside .row-align-middle
  let columns = Array.from(mainRow.querySelectorAll(':scope > .row-align-middle > .avd-column'));
  if (columns.length === 0) {
    columns = Array.from(mainRow.querySelectorAll(':scope > .avd-column'));
  }
  if (columns.length === 0) {
    // Fallback: try deeper nested columns
    columns = Array.from(element.querySelectorAll('.row-align-middle > .avd-column'));
    if (columns.length === 0) {
      columns = Array.from(element.querySelectorAll('.avd-column'));
    }
  }

  // For each column, extract the content container (usually first child div)
  const contentRow = columns.map((col) => {
    // Most content is in a direct child div
    let container = col.querySelector(':scope > div');
    // If not found, use col itself
    if (!container) container = col;
    return container;
  });

  // Compose the table structure
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
