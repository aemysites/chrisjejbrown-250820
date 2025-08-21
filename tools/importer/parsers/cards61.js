/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards61)'];

  // Find all columns that represent cards
  const cardColumns = element.querySelectorAll(
    ':scope > div > div > div > div'
  );

  const rows = [];

  cardColumns.forEach((col) => {
    // Each card's image: .textimage .image img
    const textimage = col.querySelector('.textimage');
    if (!textimage) return;

    const imageDiv = textimage.querySelector('.image');
    let imgEl = null;
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }

    // Text content: .textimage .text
    const textDiv = textimage.querySelector('.text');
    let textContent = null;
    if (textDiv) {
      // Compose a fragment to preserve all structure (heading, paragraphs, ctas)
      const frag = document.createDocumentFragment();
      [...textDiv.childNodes].forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
      textContent = frag;
    }

    // Only add row if both image and text content exist
    if (imgEl && textContent) {
      rows.push([imgEl, textContent]);
    }
  });

  // Compose table: header row + all card rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
