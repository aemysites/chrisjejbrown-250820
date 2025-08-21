/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct columns from the outermost .row
  function getMainColumns(root) {
    // Find the first .row directly under the first <div> > <div> structure
    let cur = root;
    // drill down through .column-control > div > .row
    while (cur && cur.children.length === 1) {
      cur = cur.firstElementChild;
    }
    if (!cur) return [];
    // find the .row
    let row = null;
    for (const child of cur.children) {
      if (child.classList.contains('row')) {
        row = child;
        break;
      }
    }
    if (!row) return [];
    return Array.from(row.children);
  }

  // get the two outer columns
  const columns = getMainColumns(element);
  if (columns.length < 2) return;

  // LEFT COLUMN: Get all content in the left column
  // The left column has nested structure: .avd-column > div > .column-control > div > .row > .avd-column > div > ...
  let leftContent = document.createDocumentFragment();
  {
    let outerCol = columns[0];
    let firstDiv = outerCol.querySelector(':scope > div');
    if (firstDiv) {
      let nestedColumnControl = firstDiv.querySelector(':scope > .column-control');
      if (nestedColumnControl) {
        let nestedRow = nestedColumnControl.querySelector(':scope > div > .row');
        if (nestedRow) {
          // We expect only one child column here
          let innerCol = nestedRow.querySelector(':scope > .avd-column');
          if (innerCol) {
            let innerDiv = innerCol.querySelector(':scope > div');
            if (innerDiv) {
              // Collect all its children (should be .text parbase)
              Array.from(innerDiv.children).forEach(child => {
                leftContent.appendChild(child);
              });
            }
          }
        }
      }
    }
  }

  // RIGHT COLUMN: Process direct children of the right .avd-column > div
  let rightContent = document.createDocumentFragment();
  {
    let outerCol = columns[1];
    let firstDiv = outerCol.querySelector(':scope > div');
    if (firstDiv) {
      // We want all "block" children (text parbase, button parbase, etc)
      Array.from(firstDiv.children).forEach(child => {
        // Ignore .html.parbase which is just a spacer
        if (!child.classList.contains('html')) {
          rightContent.appendChild(child);
        }
      });
    }
  }

  const cells = [
    ['Columns (columns5)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
