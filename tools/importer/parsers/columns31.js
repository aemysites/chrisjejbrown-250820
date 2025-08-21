/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct child .row's .avd-column elements
  function getColumns(row) {
    return Array.from(row.children).filter(child =>
      child.classList && Array.from(child.classList).some(cls => cls.startsWith('avd-column'))
    );
  }

  // Find top-level .row
  const mainRow = element.querySelector(':scope > .row');
  if (!mainRow) return;

  // Find both columns (main content, side content)
  const topColumns = getColumns(mainRow);
  if (topColumns.length < 2) return;

  // ===== LEFT COLUMN =====
  // Nested column-control for left column
  const leftNestedControl = topColumns[0].querySelector(':scope > div > .column-control');
  let leftCellContent = [];
  if (leftNestedControl) {
    const leftNestedRow = leftNestedControl.querySelector(':scope > .row');
    if (leftNestedRow) {
      const nestedColumns = getColumns(leftNestedRow);
      if (nestedColumns.length) {
        const nestedColContentWrap = nestedColumns[0].querySelector(':scope > div');
        if (nestedColContentWrap) {
          // Gather relevant elements (exclude spacers)
          leftCellContent = Array.from(nestedColContentWrap.children).filter(child => {
            // Exclude html-parbase spacers
            if (child.classList.contains('html')) {
              const spacer = child.querySelector('.spacer');
              if (spacer) return false;
            }
            return true;
          }).map(child => {
            // Convert any iframe to a link (not image)
            if (child.classList.contains('html')) {
              const iframe = child.querySelector('iframe');
              if (iframe) {
                const a = document.createElement('a');
                a.href = iframe.src;
                a.textContent = 'View report';
                a.target = '_blank';
                return a;
              }
            }
            return child;
          });
        }
      }
    }
  }
  if (leftCellContent.length === 1) leftCellContent = leftCellContent[0];

  // ===== RIGHT COLUMN =====
  // This is just a standard column with multiple .text parbase blocks
  const rightColContentWrap = topColumns[1].querySelector(':scope > div');
  let rightCellContent = [];
  if (rightColContentWrap) {
    rightCellContent = Array.from(rightColContentWrap.children).filter(child => {
      // Exclude html-parbase spacers
      if (child.classList.contains('html')) {
        const spacer = child.querySelector('.spacer');
        if (spacer) return false;
      }
      return true;
    });
  }
  if (rightCellContent.length === 1) rightCellContent = rightCellContent[0];

  // Table header
  const headerRow = ['Columns (columns31)'];
  // Compose columns row: exactly 2 columns, following the example markdown
  const columnsRow = [
    leftCellContent,
    rightCellContent
  ];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  element.replaceWith(table);
}
