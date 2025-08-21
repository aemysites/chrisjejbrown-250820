/* global WebImporter */
export default function parse(element, { document }) {
  // Table header should match exactly
  const headerRow = ['Columns (columns9)'];

  // Find the top-level 'row' (the main columns row)
  const mainRow = element.querySelector(':scope > div > div.row');
  if (!mainRow) return;

  // Find the two first-level columns (the avd-column divs inside .row)
  const avdColumns = Array.from(mainRow.children).filter(
    col => col.classList.contains('avd-column')
  );
  if (avdColumns.length < 2) return;

  // LEFT COLUMN: contains text, button, and small/links
  const leftCol = avdColumns[0];
  const leftInner = leftCol.querySelector(':scope > div');
  let leftColBlocks = [];

  if (leftInner) {
    // 1. Primary text (assume first .text.parbase with h4 and p)
    const mainTextBlock = leftInner.querySelector('.text.parbase .rte-text-p');
    if (mainTextBlock) {
      leftColBlocks.push(mainTextBlock);
    }
    // 2. Button (assume .button.parbase a)
    const button = leftInner.querySelector('.button.parbase a');
    if (button) {
      leftColBlocks.push(button);
    }
    // 3. Small/links (assume .text.parbase span.small or its parent p)
    const smallBlock = leftInner.querySelector('.text.parbase span.small');
    if (smallBlock) {
      // Push the parent .text.parbase (which will have the <p> with links)
      leftColBlocks.push(smallBlock.closest('.text.parbase'));
    }
  }
  // Defensive: ensure no empty (in case all above failed)
  if (leftColBlocks.length === 0) leftColBlocks = [''];

  // RIGHT COLUMN: contains image
  const rightCol = avdColumns[1];
  let rightColContent = '';
  if (rightCol) {
    const rightImg = rightCol.querySelector('img');
    if (rightImg) {
      rightColContent = rightImg;
    } else {
      rightColContent = '';
    }
  }

  // Build the table
  const cells = [
    headerRow,
    [leftColBlocks, rightColContent]
  ];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
