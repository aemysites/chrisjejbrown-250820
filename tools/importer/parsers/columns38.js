/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function: get the two top-level columns in the block (main and sidebar)
  function getTopLevelColumns(element) {
    // Typical structure: .row > div (each is a column)
    const rows = element.querySelectorAll(':scope > div > div.row');
    if (rows.length) {
      // Top-level row's children are the columns
      return Array.from(rows[0].children);
    }
    // Fallback: look for direct columns
    return Array.from(element.children);
  }

  // The given HTML for both samples is always two columns: left (main) and right (sidebar)
  const columns = getTopLevelColumns(element);
  const mainCol = columns[0];
  const sideCol = columns[1];

  // Helper: flatten single-child wrappers for cleaner referencing
  function flattenContent(col) {
    let current = col;
    while (
      current &&
      current.children.length === 1 &&
      current.firstElementChild.tagName === 'DIV' &&
      current.classList.length === 0 // only flatten completely unstyled wrappers
    ) {
      current = current.firstElementChild;
    }
    return current || col;
  }

  // Reference the main content area (the full story)
  const mainContent = mainCol ? flattenContent(mainCol) : document.createElement('div');

  // Reference the sidebar (call to action box)
  const sidebarContent = sideCol ? flattenContent(sideCol) : document.createElement('div');

  // Construct the header row as per instructions
  const headerRow = ['Columns (columns38)'];
  // Construct the second row with two columns as in the screenshot/example
  const secondRow = [mainContent, sidebarContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  // Replace original element with the new table block
  element.replaceWith(table);
}
