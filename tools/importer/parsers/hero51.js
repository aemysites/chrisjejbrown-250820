/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as specified
  const headerRow = ['Hero (hero51)'];

  // --- Extract image for second row ---
  let imageEl = null;
  // Find the image with people (background image)
  const imgs = element.querySelectorAll('img');
  if (imgs.length > 0) {
    // Per supplied HTML, the 'div.image.parbase' contains the image for visual block
    // We'll pick the last image to match screenshot placement (bottom)
    imageEl = imgs[imgs.length - 1];
  }

  // --- Extract textual content for third row ---
  // This is the main headline/subheading/paragraphs list in the block
  // These are from .text.parbase, and each contains a .rte-text-p
  const textBlocks = element.querySelectorAll('.text.parbase .rte-text-p');
  // Some blocks may be empty, so filter out empty ones
  const contentNodes = [];
  textBlocks.forEach(rte => {
    // Only include if there is some text content
    if (rte.textContent && rte.textContent.trim() !== '') {
      // Reference all child nodes of rte-text-p directly (not clone)
      Array.from(rte.childNodes).forEach(node => {
        // Only append real elements or text nodes, skip empty whitespace
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)) {
          contentNodes.push(node);
        }
      });
    }
  });
  // Wrap content in a div if there are multiple nodes
  let textCell;
  if (contentNodes.length === 1) {
    textCell = contentNodes[0];
  } else if (contentNodes.length > 1) {
    const div = document.createElement('div');
    contentNodes.forEach(node => div.appendChild(node));
    textCell = div;
  } else {
    textCell = '';
  }

  // --- Compose table ---
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [textCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
