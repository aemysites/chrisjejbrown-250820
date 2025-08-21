/* global WebImporter */
export default function parse(element, { document }) {
  // The block header
  const headerRow = ['Columns (columns43)'];

  // Find the main .row containing two columns
  const row = element.querySelector(':scope > div > div.row');

  // If not found, fallback to the first direct .row in the element
  const actualRow = row || element.querySelector('.row');

  // Defensive: If no .row, try to find two top-level columns
  let columns = [];
  if (actualRow) {
    columns = Array.from(actualRow.children);
  } else {
    // fallback: try top-level columns
    columns = Array.from(element.querySelectorAll(':scope > div'));
    // Remove any wrapper divs that aren't columns
    columns = columns.filter((col) => col.querySelector('.text.parbase') || col.querySelector('.image.parbase') || col.querySelector('.button.parbase'));
  }

  // Only use first 2 columns (left, right)
  const leftCol = columns[0];
  const rightCol = columns[1];

  // Helper to collect visible, meaningful blocks
  function extractBlocks(col) {
    if (!col) return [];
    // Only include elements that have semantic content or images/buttons
    const blocks = [];
    Array.from(col.children).forEach(child => {
      if (child.classList.contains('text') || child.classList.contains('image') || child.classList.contains('button')) {
        blocks.push(child);
      }
      // Accept .html if it contains links (PDF, etc)
      if (child.classList.contains('html')) {
        // If there is a link or download in html-component-inner
        const inner = child.querySelector('.html-component-inner');
        if (inner && inner.querySelector('a')) {
          blocks.push(child);
        }
      }
    });
    return blocks;
  }

  // Compose cells for the table's second row
  const leftBlocks = extractBlocks(leftCol);
  const rightBlocks = extractBlocks(rightCol);

  // Edge case: if no left/right blocks, fallback to all content
  const leftCell = leftBlocks.length ? leftBlocks : (leftCol ? [leftCol] : []);
  const rightCell = rightBlocks.length ? rightBlocks : (rightCol ? [rightCol] : []);

  // Compose the table array
  const tableRows = [headerRow, [leftCell, rightCell]];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
