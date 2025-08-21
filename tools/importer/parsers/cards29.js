/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example exactly
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];
  // Select all immediate cards
  const cardElements = element.querySelectorAll('.avd-column');

  cardElements.forEach(card => {
    // --- Image cell ---
    let imgCell = null;
    // Find the .short div with background-image
    const shortDiv = card.querySelector('.link-image-background .short');
    if (shortDiv) {
      const bg = shortDiv.style.backgroundImage;
      const urlMatch = bg.match(/url\((['"]?)([^'")]+)\1\)/);
      if (urlMatch && urlMatch[2]) {
        // Reference: create an <img> element with src taken from background-image
        const img = document.createElement('img');
        img.src = urlMatch[2];
        img.alt = '';
        imgCell = img;
      }
    }

    // --- Text content cell ---
    const cellContent = [];
    // Find main .text block for title/description
    const textDiv = card.querySelector('.text:not(.ctas)');
    if (textDiv) {
      // Title: <h6>
      const heading = textDiv.querySelector('h6');
      if (heading) {
        cellContent.push(heading);
      }
      // Description: <p> below h6
      // Only include <span> elements that are not just author/date, i.e., description text
      // But here, the <p> in .text contains spans for author/date, which is meta, not description
      // So best is to always include the <p> as is, since it matches the card structure: Author & date (as in screenshot)
      const metaPara = textDiv.querySelector('p');
      if (metaPara) {
        cellContent.push(metaPara);
      }
    }
    // Find .ctas block for CTA link
    const ctasDiv = card.querySelector('.text.ctas');
    if (ctasDiv) {
      const ctaLink = ctasDiv.querySelector('a');
      if (ctaLink) {
        cellContent.push(ctaLink);
      }
    }

    // Push the card row (image | content)
    rows.push([imgCell, cellContent]);
  });

  // Create the table block and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
