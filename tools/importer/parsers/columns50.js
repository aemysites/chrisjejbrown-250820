/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match example exactly
  const headerRow = ['Columns (columns50)'];

  // Get top-level row divs for columns
  const topRows = Array.from(element.querySelectorAll(':scope > div > div.row'));
  if (topRows.length === 0) return;
  const mainRow = topRows[0];
  const columns = Array.from(mainRow.children);
  if (columns.length < 2) return;

  // LEFT COLUMN: main article content
  const leftCol = columns[0];
  const leftBlocks = Array.from(leftCol.children);
  // Only include non-empty blocks
  const leftContent = leftBlocks.filter((block) => {
    // Consider empty blocks if innerText and images/iframes/links are missing
    if (!block.textContent.trim()) {
      // If at least one img, video, or link exists, keep
      if (block.querySelector('img,video,a')) return true;
      return false;
    }
    return true;
  });

  // RIGHT COLUMN: sidebar content
  const rightCol = columns[1];
  const rightBlocks = Array.from(rightCol.children);
  // Only include non-empty blocks
  const rightContent = rightBlocks.filter((block) => {
    if (!block.textContent.trim()) {
      if (block.querySelector('img,video,a')) return true;
      return false;
    }
    return true;
  });

  // Table structure: header, row with two columns (left and right)
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
