/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column, block name only
  const headerRow = ['Columns (columns17)'];

  // Find all column elements: div.row > div > .avd-column
  const columns = Array.from(element.querySelectorAll('.row > div > .avd-column'));

  // Build each cell for the content row
  const contentCells = columns.map(col => {
    // Get image if present
    const img = col.querySelector('.html-component-inner img');
    // Get the main label h5 (skip empty)
    const h5s = Array.from(col.querySelectorAll('.rte-text-p h5'));
    let labelH5 = h5s.find(h5 => h5.textContent.trim() && h5.textContent.trim() !== '\u00A0');
    const cell = [];
    if (img) cell.push(img);
    if (labelH5) cell.push(labelH5);
    return cell;
  });

  // The block MUST be: [ [header], [...columns] ]
  const cells = [headerRow, contentCells];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
