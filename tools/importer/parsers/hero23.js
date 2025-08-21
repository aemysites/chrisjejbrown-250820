/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: exact match, single column
  const headerRow = ['Hero (hero23)'];

  // Row 2: Background image (none in HTML, so blank string)
  const bgImageRow = [''];

  // Row 3: All text content from the hero area
  // Find the deepest column containing text content
  let textContentCell = '';
  // Try to find the column with class 'lpm-column-transparent'
  const columns = element.querySelectorAll('.avd-column');
  let textColumn = null;
  columns.forEach(col => {
    if (col.className.includes('lpm-column-transparent')) {
      textColumn = col;
    }
  });
  if (!textColumn) {
    // Fallback: use first column that contains a .text.parbase
    textColumn = Array.from(columns).find(col => col.querySelector('.text.parbase'));
  }

  if (textColumn) {
    // Reference the .text.parbase block directly
    const textBlock = textColumn.querySelector('.text.parbase');
    if (textBlock) {
      textContentCell = textBlock;
    } else {
      // Fallback: collect all headings, paragraphs, and links
      const container = document.createElement('div');
      textColumn.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a').forEach(el => container.appendChild(el));
      textContentCell = container;
    }
  } else {
    // Final fallback: collect all headings, paragraphs, and links from element
    const container = document.createElement('div');
    element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a').forEach(el => container.appendChild(el));
    textContentCell = container;
  }

  const cells = [
    headerRow,
    bgImageRow,
    [textContentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
