/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards73)'];

  // Find all card columns (direct children in the row)
  const cardElements = Array.from(element.querySelectorAll(':scope .row > div > .avd-column'));

  const rows = cardElements.map(card => {
    // --- Image cell ---
    // The image is inside .image.parbase > a > img
    const imgElem = card.querySelector('.image.parbase img');

    // --- Text cell ---
    // Compose the cell as a <div>, reusing existing heading, description, and CTA
    const textWrapper = card.querySelector('.text.parbase');
    const textCell = document.createElement('div');
    if (textWrapper) {
      // Heading (first h4/h3/h2/h1 in text block)
      const heading = textWrapper.querySelector('h4, h3, h2, h1');
      if (heading) {
        textCell.appendChild(heading);
      }

      // Description: look for paragraphs that are not empty or just CTA
      Array.from(textWrapper.querySelectorAll('p')).forEach(p => {
        // Only add <p> that has text (not just a link)
        if (p.textContent.trim()) {
          textCell.appendChild(p);
        } else {
          // Also add if it contains a CTA link
          if (p.querySelector('a')) {
            textCell.appendChild(p);
          }
        }
      });
      // If there is a .ctas div with a link, but not already included, add that
      const ctas = textWrapper.querySelector('.ctas');
      if (ctas && !textCell.contains(ctas)) {
        textCell.appendChild(ctas);
      }
    }
    return [imgElem, textCell];
  });

  // Compose the block table as [headerRow, ...rows]
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
