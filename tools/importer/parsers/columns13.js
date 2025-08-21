/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the innermost .row that contains the stat columns
  const allRows = element.querySelectorAll('.row');
  let innermostRow = null;
  if (allRows.length > 0) {
    // The innermost row is the last in the list
    innermostRow = allRows[allRows.length - 1];
  }

  // 2. Find all direct avd-column children of the innermost row
  let columns = [];
  if (innermostRow) {
    columns = Array.from(innermostRow.querySelectorAll(':scope > div.avd-column'));
  }

  // 3. For each column, extract the stats-box-wrapper if available, else everything in the column
  const columnCells = columns.map(col => {
    const statsBox = col.querySelector('.stats-box-wrapper');
    return statsBox ? statsBox : col;
  });

  // 4. Only create block if we have columns
  if (columnCells.length > 0) {
    // Header row exactly as required
    const headerRow = ['Columns (columns13)'];
    // Second row: the columns as cells
    const cells = [headerRow, columnCells];

    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
