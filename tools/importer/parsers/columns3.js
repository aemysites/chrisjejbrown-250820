/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly
  const headerRow = ['Columns (columns3)'];

  // 2. Find the columns within the main row
  // The block structure is: .column-control > .row > .row-align-middle > .avd-column (2 children)
  const mainRow = element.querySelector('.row');
  const alignRow = mainRow && mainRow.querySelector('.row-align-middle');
  if (!alignRow) return;

  // There are two columns: image column and text column
  // Defensive: Only select direct children (avoiding nested columns)
  const columns = Array.from(alignRow.children).filter(
    el => el.classList.contains('avd-column')
  );
  if (columns.length < 2) return;

  // First column: Image
  // Reference the actual <img> element inside, not its HTML string
  let leftImg = columns[0].querySelector('img');
  // Defensive: If the image is missing, create an empty cell
  if (!leftImg) leftImg = document.createElement('div');

  // Second column: Text block
  // Reference the actual text container (rte-text-p)
  let rightText = columns[1].querySelector('.rte-text-p');
  // Defensive: If text is missing, create an empty cell
  if (!rightText) rightText = document.createElement('div');

  // 3. Build the block table
  const cells = [
    headerRow,
    [leftImg, rightText], // two columns, two cells
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace the original element with the block (do not return)
  element.replaceWith(block);
}
