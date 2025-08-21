/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Gets all direct children of a node as array
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(
      c => className ? c.classList.contains(className) : true
    );
  }

  // Find the deepest row containing the avd-column blocks (the real columns)
  let mainRow = element;
  // Dive down until we find a .row with >1 .avd-column children
  while (true) {
    let row = mainRow.querySelector(':scope > div.row');
    if (!row) break;
    let columns = getDirectChildrenByClass(row, 'avd-column');
    if (columns.length > 1) {
      mainRow = row;
      break;
    } else if (columns.length === 1) {
      // Drill into the only column
      mainRow = columns[0];
    } else {
      break;
    }
  }

  // Now, mainRow is the .row containing our two columns
  let columns = getDirectChildrenByClass(mainRow, 'avd-column');
  if (columns.length < 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // LEFT COLUMN CONTENT
  // Gather all blocks in leftCol (may have wrapper div)
  let leftContentRoot = leftCol.querySelector(':scope > div') || leftCol;
  const leftBlocks = Array.from(leftContentRoot.children);
  let leftColContent = [];

  // Title
  let titleBlock = leftContentRoot.querySelector('.rte-text-p h1')?.closest('.text.parbase');
  if (titleBlock) leftColContent.push(titleBlock);

  // Social share
  let shareBlock = leftContentRoot.querySelector('.share-pills')?.closest('.html.parbase');
  if (shareBlock) leftColContent.push(shareBlock);

  // Embedded iframe - convert to a link
  let iframeBlock = leftContentRoot.querySelector('iframe')?.closest('.html.parbase');
  if (iframeBlock) {
    let iframe = iframeBlock.querySelector('iframe');
    if (iframe && iframe.src) {
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = 'View online';
      a.target = '_blank';
      leftColContent.push(a);
    }
  }

  // PDF Button
  let pdfButtonBlock = leftContentRoot.querySelector('a.btn')?.closest('.button.parbase');
  if (pdfButtonBlock) {
    // Use the <a> directly
    let btn = pdfButtonBlock.querySelector('a.btn');
    if (btn) leftColContent.push(btn);
  }

  // RIGHT COLUMN CONTENT
  let rightContentRoot = rightCol.querySelector(':scope > div') || rightCol;
  let rightColContent = [];

  // Previous Reports header
  let prevHeaderBlock = rightContentRoot.querySelector('h4')?.closest('.text.parbase');
  if (prevHeaderBlock) rightColContent.push(prevHeaderBlock);

  // Previous Reports links (table)
  let prevReportsBlock = rightContentRoot.querySelector('table')?.closest('.text.parbase');
  if (prevReportsBlock) rightColContent.push(prevReportsBlock);

  // Table header from block name in prompt
  const headerRow = ['Columns (columns47)', ''];
  // Table data row: left and right columns
  const row = [leftColContent, rightColContent];

  const table = WebImporter.DOMUtils.createTable([headerRow, row], document);
  element.replaceWith(table);
}
