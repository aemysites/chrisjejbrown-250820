/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Cards (cards20)'];

  // Select all card columns (each card is within .avd-column)
  const cardColumns = element.querySelectorAll(':scope > div > .row > div');
  const rows = [];

  cardColumns.forEach((col) => {
    // Image cell: use reference to <img> node
    let imageCell = null;
    const img = col.querySelector('img');
    if (img) imageCell = img;

    // Text cell: combine all heading, description, and CTA link references
    // Find .text container or fallback to all heading/paragraph/link inside this card
    let textCell = null;
    const textContainer = col.querySelector('.text');
    if (textContainer) {
      // Reference the entire .text container for robustness (includes heading, description, CTA)
      textCell = textContainer;
    } else {
      // Fallback: gather heading, paragraph, and links directly inside col
      const nodes = [];
      col.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a').forEach((node) => {
        nodes.push(node);
      });
      // If any nodes found, use them; otherwise, fallback to text content
      if (nodes.length) {
        textCell = nodes;
      } else {
        // Fallback: use text only
        textCell = document.createTextNode(col.textContent.trim());
      }
    }

    rows.push([imageCell, textCell]);
  });

  // Build table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
