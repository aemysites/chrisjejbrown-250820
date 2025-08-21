/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns (.avd-column elements)
  const columns = Array.from(element.querySelectorAll('.avd-column'));

  // Extract the content for each column
  const contentCells = columns.map(col => {
    const rte = col.querySelector('.rte-text-p');
    return rte ? rte : col;
  });

  // Create header cell with colspan to span all columns
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Columns (columns53)';
  if (contentCells.length > 1) {
    headerCell.setAttribute('colspan', contentCells.length);
  }
  const headerRow = [headerCell];

  // Table rows: header, then content row
  const tableRows = [headerRow, contentCells];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
