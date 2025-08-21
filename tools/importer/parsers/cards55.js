/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find all .row elements in the correct visual order
  function getAllRows(el) {
    // Get all .row descendants that are reasonably top-level (not in deeper .row > .row)
    return Array.from(el.querySelectorAll('.row'));
  }

  // Helper to get card columns from a .row
  function getColumnsFromRow(row) {
    // Only get immediate children (column divs)
    return Array.from(row.children).filter(div => div.classList.contains('avd-column'));
  }

  // Helper to get the image from a column
  function getImage(col) {
    return col.querySelector('img');
  }

  // Helper to get the main text block from a column
  function getTextBlock(col) {
    // Look for .option-styles, .lpm-text, or .text in priority order
    return (
      col.querySelector('.option-styles') ||
      col.querySelector('.lpm-text') ||
      col.querySelector('.text') ||
      null
    );
  }

  // Helper to test if a text block has real content
  function hasTextContent(el) {
    if (!el) return false;
    if (typeof el === 'string') return el.trim().length > 0;
    return el.textContent && el.textContent.trim().length > 0;
  }

  // PROCESSING: assemble cards in display order
  const cells = [['Cards (cards55)']];
  
  // We'll use a Set to avoid duplicate card text blocks (sometimes nested rows repeat)
  const seenTextBlocks = new Set();

  // 1. Get all rows in order
  const rows = getAllRows(element);
  rows.forEach(row => {
    // Get all columns for this row
    const cols = getColumnsFromRow(row);
    if (cols.length > 1) {
      // Multiple cards in a row
      cols.forEach(col => {
        const img = getImage(col);
        const textBlock = getTextBlock(col) || col;
        // Only add rows with some real content
        if ((img || hasTextContent(textBlock)) && !seenTextBlocks.has(textBlock)) {
          cells.push([img || '', textBlock]);
          seenTextBlocks.add(textBlock);
        }
      });
    } else if (cols.length === 1) {
      // Single wide card, sometimes just text
      const col = cols[0];
      const img = getImage(col);
      const textBlock = getTextBlock(col) || col;
      if ((img || hasTextContent(textBlock)) && !seenTextBlocks.has(textBlock)) {
        cells.push([img || '', textBlock]);
        seenTextBlocks.add(textBlock);
      }
    }
  });

  // Edge case: also check for top-level single cards not wrapped in .row (sometimes callouts at start/end)
  // e.g., .lpm-text, .option-styles, .text direct children
  Array.from(element.children).forEach(child => {
    // Only add if not already present
    if ((child.classList.contains('lpm-text') || child.classList.contains('option-styles') || child.classList.contains('text')) && hasTextContent(child) && !seenTextBlocks.has(child)) {
      cells.push(['', child]);
      seenTextBlocks.add(child);
    }
  });

  // Remove accidental all-empty rows
  const cleaned = cells.filter(row => Array.isArray(row) ? row.some(cell => (typeof cell === 'string' && cell.trim()) || (cell && cell.textContent && cell.textContent.trim())) : true);

  // Build and replace
  const block = WebImporter.DOMUtils.createTable(cleaned, document);
  element.replaceWith(block);
}
