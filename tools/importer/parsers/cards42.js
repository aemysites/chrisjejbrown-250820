/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all main card blocks under this section
  const cardColumns = Array.from(element.querySelectorAll('.avd-column.col-xs-12.col-sm-12.col-md-12.bgcRedMuted'));

  const headerRow = ['Cards (cards42)'];

  const rows = cardColumns.map(cardCol => {
    // Try to find the text and image columns inside this card
    const toupeCol = cardCol.querySelector('.avd-column.col-xs-12.col-sm-7.col-md-7.bgcToupe');
    const imgCol = cardCol.querySelector('.avd-column.col-xs-12.col-sm-6.col-md-6.lpm-column-transparent');

    // --- IMAGE ---
    // Use the first image found in the image column
    let image = null;
    if (imgCol) {
      const img = imgCol.querySelector('img');
      if (img) image = img;
    }

    // --- TEXT CONTENT ---
    let textParts = [];
    if (toupeCol) {
      // Gather in order:
      // 1. First .text.parbase .rte-text-p (usually heading + description)
      const mainTextBlocks = toupeCol.querySelectorAll('.text.parbase .rte-text-p');
      mainTextBlocks.forEach(block => {
        if (block.textContent.trim().length > 0) textParts.push(block);
      });
      // 2. Button (if present)
      const button = toupeCol.querySelector('.button.parbase a');
      if (button) textParts.push(button);
    }

    // Return row: image | text
    return [image, textParts.length > 1 ? textParts : (textParts[0] || '')];
  });

  // Only output if there is at least one card (besides header)
  if (rows.length > 0) {
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
