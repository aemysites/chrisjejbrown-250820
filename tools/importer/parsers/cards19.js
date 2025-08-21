/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function: get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Step 1: Traverse to the cards area
  // .column-control > .row > .avd-column.bgcGreyLight > ... > .avd-column.bgcToupe90 > ... > .row > .avd-column (cards)
  const mainRow = element.querySelector(':scope > div > div.row');
  if (!mainRow) return;

  const outerColumn = getDirectChildByClass(mainRow, 'avd-column');
  if (!outerColumn || !outerColumn.classList.contains('bgcGreyLight')) return;

  const subColumnControl = getDirectChildByClass(outerColumn, 'column-control');
  if (!subColumnControl) return;
  const subRow = getDirectChildByClass(subColumnControl, 'row');
  if (!subRow) return;

  // Get the 2nd .avd-column (with bgcToupe90) for the cards
  let cardColumn = null;
  for (const col of Array.from(subRow.children)) {
    if (col.classList.contains('avd-column') && col.classList.contains('bgcToupe90')) {
      cardColumn = col;
      break;
    }
  }
  if (!cardColumn) return;

  const cardColumnControl = getDirectChildByClass(cardColumn, 'column-control');
  if (!cardColumnControl) return;
  const cardsRow = getDirectChildByClass(cardColumnControl, 'row');
  if (!cardsRow) return;

  // Now, each direct child .avd-column of cardsRow is a card
  const cardColumns = Array.from(cardsRow.children).filter(child => child.classList.contains('avd-column'));

  // Step 2: Extract card content
  const cardRows = cardColumns.map(cardCol => {
    const colInner = cardCol.firstElementChild;
    if (!colInner) return ['', ''];
    // Find image if present
    const imageContainer = Array.from(colInner.children).find(c => c.classList.contains('image'));
    let imgEl = null;
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }
    // Find text: prefer .option-styles inside .text, or fallback to .text itself
    const textContainer = Array.from(colInner.children).find(c => c.classList.contains('text'));
    let textContent = null;
    if (textContainer) {
      // Sometimes .option-styles inside .text
      const optStyles = textContainer.querySelector(':scope > .option-styles, :scope > div');
      textContent = optStyles || textContainer;
    }
    return [imgEl ? imgEl : '', textContent ? textContent : ''];
  });

  // Step 3: Table structure
  const tableCells = [
    ['Cards (cards19)'],
    ...cardRows
  ];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Step 4: Replace original element
  element.replaceWith(block);
}
