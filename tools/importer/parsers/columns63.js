/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the nested row with columns
  let columnsRow;
  // Find .column-control > .row > .row-align-middle if present
  const colCtrls = element.querySelectorAll('.column-control');
  for(const colCtrl of colCtrls) {
    const alignMiddle = colCtrl.querySelector('.row-align-middle');
    if (alignMiddle && alignMiddle.querySelectorAll(':scope > .avd-column').length > 1) {
      columnsRow = alignMiddle;
      break;
    }
  }
  // fallback: find .row with >1 .avd-column
  if (!columnsRow) {
    const rows = element.querySelectorAll('.row');
    for (const row of rows) {
      if (row.querySelectorAll(':scope > .avd-column').length > 1) {
        columnsRow = row;
        break;
      }
    }
  }
  if (!columnsRow) return;

  const columns = Array.from(columnsRow.querySelectorAll(':scope > .avd-column'));
  if (columns.length < 2) return;

  // Helper to extract meaningful existing content from each column
  function extractColumnContent(col) {
    // Go down to skip transparent wrappers, but keep structure
    let node = col;
    while (node.children.length === 1 && node.firstElementChild) {
      // Skip to the only child
      node = node.firstElementChild;
    }
    // Now node contains lowest common ancestor
    // Gather all actual, non-empty children for the cell
    const cellContent = [];
    for (const child of node.children) {
      // Ignore known spacers or empty blocks
      if (child.classList.contains('spacer') || (child.textContent.trim() === '' && !child.querySelector('img') && !child.querySelector('a'))) continue;
      cellContent.push(child);
    }
    if (cellContent.length === 1) return cellContent[0];
    if (cellContent.length > 1) return cellContent;
    // Fallback: if everything was a wrapper, just return the node itself (e.g. image)
    return node;
  }

  const headerRow = ['Columns (columns63)'];
  const contentRow = columns.map(extractColumnContent);

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
