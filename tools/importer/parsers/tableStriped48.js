/* global WebImporter */
export default function parse(element, { document }) {
  // Find all job tables in the block
  const jobTables = element.querySelectorAll('table.srJobList');
  if (!jobTables.length) return;
  jobTables.forEach((table) => {
    // First row: block name header
    const headerRow = ['Table (striped, tableStriped48)'];
    const cells = [headerRow];
    // Get all rows (tr) in the table
    const rows = table.querySelectorAll('tbody > tr');
    if (!rows.length) return;
    // The first row is the column header row
    const ths = rows[0].querySelectorAll('th');
    let headerCells = [];
    ths.forEach((th) => {
      // Always use plain text only for the column header row
      headerCells.push(th.textContent.trim());
    });
    // Mark the column header row for use as <th> by wrapping each value in an object
    // with a property { __importerTh: true, value: ... } that createTable recognizes.
    // But since createTable doesn't support that natively, we need to postprocess below.
    cells.push(headerCells);
    // Add all data rows
    for (let i = 1; i < rows.length; i++) {
      const tds = rows[i].querySelectorAll('td');
      let rowCells = [];
      tds.forEach((td) => {
        const jobLoc = td.querySelector('spl-job-location');
        if (jobLoc) {
          rowCells.push(jobLoc);
        } else if (td.children.length > 0) {
          let contentArray = [];
          for (const child of td.children) {
            contentArray.push(child);
          }
          rowCells.push(contentArray.length === 1 ? contentArray[0] : contentArray);
        } else {
          rowCells.push(td.textContent.trim());
        }
      });
      cells.push(rowCells);
    }
    // Now, create the table
    const blockTable = WebImporter.DOMUtils.createTable(cells, document);
    // Post-process: force the second row to <th> per cell instead of <td>
    const tableRows = blockTable.querySelectorAll('tr');
    if (tableRows.length > 1) {
      const secondRow = tableRows[1];
      const tds = Array.from(secondRow.children);
      tds.forEach((td, idx) => {
        // Replace <td> with <th> and set content to plain text for column headers
        const val = headerCells[idx];
        const th = document.createElement('th');
        th.textContent = val;
        secondRow.replaceChild(th, td);
      });
    }
    table.replaceWith(blockTable);
  });
}
