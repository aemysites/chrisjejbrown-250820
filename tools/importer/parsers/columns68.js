/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per specification (must match exactly)
  const headerRow = ['Columns (columns68)'];

  // Find the direct .row child (never query classes on top-level element)
  const rowElem = Array.from(element.children).find(child => child.classList.contains('row'));
  if (!rowElem) return; // Defensive: no .row found

  // Get all direct child columns of the row (not nested or empty)
  const allCols = Array.from(rowElem.children).filter(col => {
    // Only consider columns with actual content
    return col.textContent.trim() !== '';
  });

  // For each column, try to extract the main content section (e.g., .text.parbase),
  // but fall back to any non-empty content
  const cellsRow = allCols.map(col => {
    // .text.parbase is the main text container
    const textParbase = col.querySelector('.text.parbase');
    if (textParbase && textParbase.textContent.trim()) {
      return textParbase;
    }
    // Fallback: find the first non-empty child, or the col itself
    const mainContent = Array.from(col.children).find(c => c.textContent.trim() !== '');
    return mainContent || col;
  });

  // Only create the table if there is at least one content column
  if (cellsRow.length === 0) return;

  const cells = [headerRow, cellsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
