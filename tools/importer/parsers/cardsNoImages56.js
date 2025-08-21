/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cardsNoImages56)'];

  // Get all immediate .avd-column children (each is a card)
  const columns = element.querySelectorAll('.avd-column');
  const rows = [headerRow];

  columns.forEach((col) => {
    // Find the main text content container within the card
    const cardText = col.querySelector('.rte-text-p');
    if (cardText) {
      // Collect existing child nodes for the card contents (preserving semantics and order)
      // This lets us avoid cloning and referencing instead
      const cardContents = [];
      for (const node of Array.from(cardText.childNodes)) {
        // Only include non-empty nodes
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)) {
          cardContents.push(node);
        }
      }
      if (cardContents.length > 0) {
        rows.push([cardContents]);
      }
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
