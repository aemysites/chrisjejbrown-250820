/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find the deepest .column-control > .row > .avd-column set (skip outer wrappers)
  function findDeepestColumns(root) {
    let current = root;
    let columns = [];
    while (true) {
      // Find the first .row > .avd-column children inside current
      const row = current.querySelector(':scope > div > div.row');
      if (!row) break;
      const cols = Array.from(row.querySelectorAll(':scope > div.avd-column'));
      if (cols.length === 1) {
        // Check for nested column-control in this col
        const nested = cols[0].querySelector('.column-control.parbase');
        if (nested) {
          current = nested;
          continue;
        }
      }
      columns = cols;
      break;
    }
    return columns;
  }

  // Helper: extract all content elements in a column, in correct order
  function extractColumnContent(col) {
    // All top-level direct children divs contain content blocks
    const content = [];
    Array.from(col.children).forEach(block => {
      // image
      const img = block.querySelector(':scope > .image img');
      if (img) content.push(img);

      // Headings, role, etc
      const textBlock = block.querySelector(':scope > .text .option-styles, :scope > .text .rte-text-p');
      if (textBlock) content.push(textBlock);

      // LinkedIn/My Perspectives block (may be in a .html-component-inner)
      const linkedin = block.querySelector(':scope > .html .linkedin-profile');
      if (linkedin) content.push(linkedin);

      // Description/copy (sometimes more than one .text)
      const descBlock = block.querySelector(':scope > .text .option-styles:not(:has(h1)), :scope > .text .option-styles:has(p):not(:has(h1))');
      if (descBlock && !content.includes(descBlock)) content.push(descBlock);

      // Extra paragraphs (usually in .text)
      if (block.classList.contains('text')) {
        const paras = Array.from(block.querySelectorAll(':scope > .option-styles p, :scope > .rte-text-p p'));
        paras.forEach(p => {
          if (!content.includes(p)) content.push(p);
        });
      }

      // Back to leadership link (may be in .text .rte-text-p)
      const backLink = block.querySelector(':scope > .rte-text-p');
      if (backLink && !content.includes(backLink)) content.push(backLink);
    });
    // Remove duplicate elements
    const seen = new Set();
    return content.filter(el => {
      if (seen.has(el)) return false;
      seen.add(el);
      return true;
    });
  }

  // Get columns
  const columns = findDeepestColumns(element);
  // If nothing found, fallback: don't process
  if (!columns.length) return;

  // Each cell: array of nodes for that column
  const rowCells = columns.map(col => {
    const content = extractColumnContent(col);
    // If only one content node, just return that node, else array
    if (content.length === 1) return content[0];
    if (content.length > 1) return content;
    // If no content, return empty string
    return '';
  });

  const headerRow = ['Columns (columns15)'];
  const cells = [headerRow, rowCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
