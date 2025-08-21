/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children divs
  function getImmediateDivs(parent) {
    return Array.from(parent.children).filter(child => child.tagName === 'DIV');
  }

  // Find the top-level .row, which contains our columns
  let mainRow = null;
  for (const div of getImmediateDivs(element)) {
    if (div.classList.contains('row')) {
      mainRow = div;
      break;
    }
  }
  if (!mainRow) return;

  // Find the .row-align-middle, which contains two columns (image and nested columns)
  let rowAlignMiddle = null;
  for (const div of getImmediateDivs(mainRow)) {
    if (div.classList.contains('row-align-middle')) {
      rowAlignMiddle = div;
      break;
    }
  }
  if (!rowAlignMiddle) return;

  // Get columns in .row-align-middle
  const topColumns = getImmediateDivs(rowAlignMiddle);
  if (topColumns.length < 2) return;

  // Left column: image
  let leftImageCell = null;
  const leftCol = topColumns[0];
  const img = leftCol.querySelector('img');
  if (img) {
    leftImageCell = img;
  } else {
    // If no image found, use empty string to avoid errors
    leftImageCell = '';
  }

  // Right column: nested 3-column text block
  let rightTextCells = [];
  const rightCol = topColumns[1];
  // Find nested .column-control inside rightCol
  const nestedColumnControl = rightCol.querySelector('.column-control');
  if (nestedColumnControl) {
    const nestedRow = nestedColumnControl.querySelector('.row');
    if (nestedRow) {
      // Get all immediate columns in nested row
      const nestedCols = getImmediateDivs(nestedRow);
      nestedCols.forEach(nestedCol => {
        // Each col should contain a .rte-text-p block
        const textBlock = nestedCol.querySelector('.rte-text-p');
        if (textBlock) {
          rightTextCells.push(textBlock);
        }
      });
    }
  }
  // If no nested columns/text found, try to include whatever content is present for resilience
  if (rightTextCells.length === 0) {
    rightTextCells = [rightCol];
  }

  // Compose table
  const headerRow = ['Columns (columns60)'];
  const contentRow = [leftImageCell, rightTextCells];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with the table
  element.replaceWith(table);
}
