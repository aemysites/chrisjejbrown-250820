/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct card columns
  const columns = element.querySelectorAll('.avd-column');
  const rows = [['Cards (cards1)']]; // Exact header as required

  columns.forEach(column => {
    // Image: first img inside column
    const img = column.querySelector('img');

    // Text: try to find the .rte-text-p block (contains h5, p, etc.)
    const textBlock = column.querySelector('.rte-text-p');
    let textCell = [];
    if (textBlock) {
      // Only use meaningful children: skip empty headings
      Array.from(textBlock.children).forEach(child => {
        // skip completely empty heading (often first h5)
        if (child.tagName === 'H5' && child.textContent.trim() === '\u00a0') return;
        textCell.push(child);
      });
    }

    // If no text children, fallback to column itself (should not happen)
    if (textCell.length === 0 && textBlock) {
      textCell = [textBlock];
    }

    // Always reference existing elements
    rows.push([
      img, // first cell: image element
      textCell.length === 1 ? textCell[0] : textCell // second cell: text block(s)
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
