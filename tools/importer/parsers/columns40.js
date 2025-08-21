/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct child .column-control blocks
  function getTopColumnControls(el) {
    return Array.from(el.children).filter(child => child.classList && child.classList.contains('column-control'));
  }

  // Helper: get immediate .row children for each .column-control
  function getRows(control) {
    // The .row is usually under: .column-control > div > .row
    return Array.from(control.querySelectorAll(':scope > div > .row'));
  }

  // Helper: get columns from a .row (one cell per .avd-column)
  function getColumnsFromRow(row) {
    // Each child is usually a <div> containing an .avd-column
    return Array.from(row.children)
      .map(colWrap => {
        const col = colWrap.querySelector(':scope > .avd-column');
        if (!col) return null;
        let colContent = [];
        // Images
        col.querySelectorAll('.image img').forEach(img => colContent.push(img));
        // Text blocks
        col.querySelectorAll('.text .option-styles').forEach(txt => colContent.push(txt));
        // Callouts
        col.querySelectorAll('.callout').forEach(callout => colContent.push(callout));
        // Paragraphs not inside option-styles
        if (colContent.length === 0) col.querySelectorAll('p').forEach(p => colContent.push(p));
        // Fallback: all non-empty child nodes
        if (colContent.length === 0) {
          colContent = Array.from(col.childNodes).filter(n => {
            if (n.nodeType === 3) return !!n.textContent.trim();
            return true;
          });
        }
        return colContent.length === 1 ? colContent[0] : colContent;
      })
      .filter(cell => cell != null);
  }

  // Process each top-level column-control block
  const topColumnControls = getTopColumnControls(element);
  topColumnControls.forEach(control => {
    const rows = getRows(control);
    rows.forEach(row => {
      const columns = getColumnsFromRow(row);
      if (!columns.length) return;
      const headerRow = ['Columns (columns40)'];
      const cells = [headerRow, columns];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      element.parentNode.insertBefore(table, element);
    });
  });
  element.parentNode.removeChild(element);
}
