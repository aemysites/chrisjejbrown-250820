/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first main two columns at the left and right of the form block
  function findTopColumns(el) {
    // Seek the deepest .row with exactly two column children
    let current = el;
    let result = [];
    while (current) {
      let row = current.querySelector(':scope > div > div.row');
      if (row) {
        // Only consider direct children of the .row as columns
        let cols = Array.from(row.children).map(
          child => child.querySelector(':scope > div') || child
        ).filter(child => child.classList && child.classList.contains('avd-column'));
        if (cols.length === 2) {
          result = cols;
          break;
        }
        // Go deeper
        current = row;
      } else {
        break;
      }
    }
    return result;
  }

  // Fallback: search for two largest columns in immediate children if deep search fails
  let columns = findTopColumns(element);
  if (columns.length !== 2) {
    // fallback: try with less specificity
    let rows = element.querySelectorAll(':scope > div > div.row');
    if (rows.length > 0) {
      let row = rows[0];
      columns = Array.from(row.children).map(c => c.querySelector(':scope > div') || c)
        .filter(c => c.classList && c.classList.contains('avd-column'));
      // if not two, fallback to all direct children
      if (columns.length < 2) {
        columns = Array.from(row.children);
      }
    } else {
      columns = [element];
    }
  }

  // Prepare left column cell (all content from left column)
  let leftCellContent;
  if (columns[0]) {
    // Reference all element children (preserve headings, text, structure)
    const leftDiv = document.createElement('div');
    Array.from(columns[0].children).forEach(child => {
      leftDiv.appendChild(child);
    });
    // If empty, fallback to just the column
    leftCellContent = leftDiv.childNodes.length ? leftDiv : columns[0];
  } else {
    leftCellContent = document.createElement('div');
  }

  // Prepare right column cell (all content from right column, including form)
  let rightCellContent;
  if (columns[1]) {
    const rightDiv = document.createElement('div');
    Array.from(columns[1].children).forEach(child => {
      rightDiv.appendChild(child);
    });
    rightCellContent = rightDiv.childNodes.length ? rightDiv : columns[1];
  } else {
    rightCellContent = document.createElement('div');
  }

  // The header row must match exactly
  const cells = [['Columns (columns6)']];
  // Second row: the two columns as cells
  cells.push([
    leftCellContent,
    rightCellContent
  ]);

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
