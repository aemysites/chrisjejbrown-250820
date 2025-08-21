/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell array
  const headerRow = ['Columns (columns10)'];

  // Find all the column elements
  const columns = Array.from(element.querySelectorAll('.row > .row-align-middle > .avd-column'));
  const contentRow = columns.map(col => {
    // Use the .image-text block if present
    const imageText = col.querySelector('.image-text');
    return imageText ? imageText : col;
  });

  // Compose the cells array
  // First row is single header cell, second row has one cell for each column
  const cells = [
    headerRow,
    contentRow
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}