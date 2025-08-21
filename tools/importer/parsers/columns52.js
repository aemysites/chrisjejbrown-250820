/* global WebImporter */
export default function parse(element, { document }) {
  // Find column container: first .row, then .row-align-middle (if exists)
  const row = element.querySelector('.row');
  if (!row) return;
  const rowAlign = row.querySelector('.row-align-middle') || row;

  // Find direct .avd-column children (these are the actual columns)
  const columns = Array.from(rowAlign.querySelectorAll(':scope > .avd-column'));
  if (columns.length === 0) return;

  // For each column, extract the main content (reference existing elements)
  const cells = columns.map((col) => {
    // Drill down through wrappers to reach content blocks (image/text/etc)
    let contentRoot = col;
    while (
      contentRoot &&
      contentRoot.children &&
      contentRoot.children.length === 1 &&
      contentRoot.children[0].tagName === 'DIV'
    ) {
      contentRoot = contentRoot.children[0];
    }
    // Take all direct children of the contentRoot except empty wrappers
    const realContent = Array.from(contentRoot.children).filter((child) => {
      // Accept only elements with actual content (img, text, etc)
      if (child.tagName === 'DIV' && child.children.length === 0 && !child.textContent.trim()) {
        return false;
      }
      return true;
    });
    // If only one actual content element, use it directly; else, use all as array
    if (realContent.length === 1) {
      return realContent[0];
    } else if (realContent.length > 1) {
      return realContent;
    } else {
      // If no children, fallback to contentRoot itself if non-empty
      if (contentRoot.textContent.trim() || contentRoot.querySelector('img')) {
        return contentRoot;
      }
      // Otherwise, return empty string
      return '';
    }
  });
  // Compose the table array
  const tableArray = [
    ['Columns (columns52)'], // Header row matches example
    cells // Content row: one cell per column
  ];
  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(table);
}
