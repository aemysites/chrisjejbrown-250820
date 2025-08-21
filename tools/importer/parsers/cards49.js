/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for the table
  const cells = [
    ['Cards (cards49)']
  ];
  // 2. Locate the column/card containers
  const columns = element.querySelectorAll('.avd-column.lpm-column-transparent');
  columns.forEach((col) => {
    // Defensive: ignore empty columns
    // Must have either an image and some text
    const imgContainer = col.querySelector('.image.parbase img');
    const textBlock = col.querySelector('.text.parbase .rte-text-p');
    if (!imgContainer || !textBlock) return;

    // Gather text content and CTA in order
    const cardContent = [];
    // For each child element in the textBlock:
    textBlock.childNodes.forEach((node) => {
      // Is this the CTA div?
      if (node.nodeType === 1 && node.classList.contains('text') && node.classList.contains('ctas')) {
        // Find link inside CTA
        const ctaLink = node.querySelector('a');
        if (ctaLink) cardContent.push(ctaLink);
      } else {
        // Otherwise, push paragraph or text node (skip empty text nodes)
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim()) cardContent.push(node);
        } else if (node.nodeType === 1) {
          cardContent.push(node);
        }
      }
    });

    // Add a row: image in cell 1, all text/cta content in cell 2
    cells.push([
      imgContainer,
      cardContent
    ]);
  });
  // 3. Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
