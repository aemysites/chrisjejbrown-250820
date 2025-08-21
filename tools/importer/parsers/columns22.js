/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns wrapper: .row-align-middle
  const columnsWrapper = element.querySelector('.row-align-middle');
  if (!columnsWrapper) return;
  // Get all immediate .avd-column children
  const columnDivs = Array.from(columnsWrapper.children).filter(child => child.classList.contains('avd-column'));

  // Build the header row matching the requirement
  const headerRow = ['Columns (columns22)'];

  // For the first content row, grab the content of each column
  const firstContentRow = columnDivs.map(col => {
    // The actual content is in the innermost .text/.image or similar wrapper
    // We'll gather all <div> wrappers for .text or .image inside this column
    // If multiple blocks exist (rare), combine them as an array
    const innerBlocks = [];
    // Look for .text and .image direct children
    const possibleBlocks = Array.from(col.querySelectorAll(':scope > div > .text, :scope > div > .image'));
    // If we have such blocks, use their DOM node (the .text or .image div)
    if (possibleBlocks.length > 0) {
      possibleBlocks.forEach(block => {
        // For .text, use the .rte-text-p inside
        const rte = block.querySelector('.rte-text-p');
        if (rte) {
          innerBlocks.push(rte);
        } else {
          // For image, use the img element
          const img = block.querySelector('img');
          if (img) {
            innerBlocks.push(img);
          }
        }
      });
    } else {
      // Fallback: find .rte-text-p or img deeper inside this column
      const rte = col.querySelector('.rte-text-p');
      if (rte) {
        innerBlocks.push(rte);
      } else {
        const img = col.querySelector('img');
        if (img) innerBlocks.push(img);
      }
    }
    // If nothing found, return the column as-is (should not happen in the examples)
    if (innerBlocks.length === 0) return col;
    // If only one element, just return it, otherwise array
    return innerBlocks.length === 1 ? innerBlocks[0] : innerBlocks;
  });

  const cells = [headerRow, firstContentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
