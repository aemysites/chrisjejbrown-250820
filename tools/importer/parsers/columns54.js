/* global WebImporter */
export default function parse(element, { document }) {
  // Get the row containing all columns
  let columnsRow = element.querySelector('.row');
  if (!columnsRow) {
    columnsRow = element;
  }
  // Get all .avd-column inside .row-align-middle
  let columnEls = columnsRow.querySelectorAll('.row-align-middle > .avd-column');
  // Fallback to .avd-column directly under columnsRow if needed
  if (!columnEls.length) {
    columnEls = columnsRow.querySelectorAll(':scope > .avd-column');
  }
  // Fallback to any .avd-column in element if needed
  if (!columnEls.length) {
    columnEls = element.querySelectorAll('.avd-column');
  }

  // For each column: gather its structured content
  const columns = Array.from(columnEls).map(colEl => {
    const cellContent = [];
    // Find all .text.parbase blocks inside column
    const textBlocks = colEl.querySelectorAll(':scope .text.parbase');
    textBlocks.forEach(tb => {
      cellContent.push(tb);
    });
    // Find images directly inside html parbase blocks
    const htmlBlocks = colEl.querySelectorAll(':scope .html.parbase');
    htmlBlocks.forEach(hb => {
      const img = hb.querySelector('img');
      if (img) {
        cellContent.push(img);
      }
    });
    // Only return cell content if any, else blank string
    if (cellContent.length === 0) {
      return '';
    } else if (cellContent.length === 1) {
      return cellContent[0];
    }
    return cellContent;
  });

  // Ensure there are 3 columns as in the screenshot
  while (columns.length < 3) {
    columns.push('');
  }

  // Block table header: SINGLE CELL ONLY
  const headerRow = ['Columns (columns54)'];
  const tableRows = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
