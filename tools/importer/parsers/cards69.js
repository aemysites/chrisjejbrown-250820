/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all immediate .avd-column.lpm-column-transparent columns
  // They are found nested under several divs, but always as direct children of a .row under the main element
  const columns = Array.from(element.querySelectorAll('.avd-column.lpm-column-transparent'));

  // Prepare the table rows
  const rows = [ ['Cards (cards69)'] ];

  columns.forEach(col => {
    // Get the image (first img under this column)
    const img = col.querySelector('img');
    // Get the text container (first .rte-text-p)
    const text = col.querySelector('.rte-text-p');
    // If either is missing, insert null so structure is preserved
    rows.push([
      img || '',
      text || ''
    ]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
