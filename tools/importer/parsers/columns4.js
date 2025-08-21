/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two top-level columns in the block
  // The HTML structure:
  // .column-control > ... > .textimage-horizontal > .row > div > .col-xs-4 and .col-xs-8

  // Defensive: find the .textimage-horizontal (main content block)
  const textImageHorizontal = element.querySelector('.textimage-horizontal');
  if (!textImageHorizontal) return;

  // Get the direct row that contains the two columns
  const colsRow = textImageHorizontal.querySelector('.row');
  if (!colsRow) return;

  // There should be two columns: left (text), right (image)
  const cols = colsRow.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // Left column: text, right column: image
  const leftCol = cols[0];
  const rightCol = cols[1];

  // For robustness, use the actual content inside each column
  // Left column: find .rte-text-p (contains all text)
  const textContent = leftCol.querySelector('.rte-text-p');
  // If no .rte-text-p, fallback to the whole leftCol
  const leftCell = textContent ? textContent : leftCol;

  // Right column: find .image (contains image and link)
  const imageContent = rightCol.querySelector('.image');
  // If no .image, fallback to the whole rightCol
  const rightCell = imageContent ? imageContent : rightCol;

  // Create the table cells
  const headerRow = ['Columns (columns4)'];
  const firstDataRow = [leftCell, rightCell];

  // Create the table with the header and content row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    firstDataRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
