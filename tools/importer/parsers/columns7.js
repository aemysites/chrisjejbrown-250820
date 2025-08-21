/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row element (the container of the columns)
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all direct children of .row (these are the columns)
  const columnDivs = Array.from(row.children);

  // Map each column to its content
  const columns = columnDivs.map((col) => {
    // Find an image (if any) in this column
    const img = col.querySelector('img');
    // Find the main text block (rte-text-p or text)
    const textBlock = col.querySelector('.rte-text-p') || col.querySelector('.text');
    // Compose cell contents, using references to original elements
    const cell = [];
    if (img) cell.push(img);
    if (textBlock && (!img || textBlock !== img)) cell.push(textBlock);
    // If neither found, just put the column's content
    if (cell.length === 0) {
      // Use all direct children of col
      cell.push(...Array.from(col.children));
      // If still empty, fallback to the column itself
      if (cell.length === 0) cell.push(col);
    }
    return cell.length === 1 ? cell[0] : cell;
  });

  // Build the block table: header row, then columns row
  const cells = [
    ['Columns (columns7)'],
    columns
  ];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
