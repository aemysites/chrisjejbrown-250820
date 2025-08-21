/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header
  const headerRow = ['Table (striped, tableStriped12)'];

  // Find the heading (if present)
  let heading = null;
  // Look for an h1 anywhere inside element
  heading = element.querySelector('h1');

  // Find the data table (first <table> in subtree)
  let dataTable = element.querySelector('table');

  // Compose the cell for row 2
  // If both heading and table, put both in one cell
  // If only table, just table
  // If only heading, just heading
  let cellContent;
  if (heading && dataTable) {
    cellContent = [heading, dataTable];
  } else if (dataTable) {
    cellContent = dataTable;
  } else if (heading) {
    cellContent = heading;
  } else {
    cellContent = element;
  }

  const cells = [
    headerRow,
    [cellContent]
  ];

  // Create and replace with table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
