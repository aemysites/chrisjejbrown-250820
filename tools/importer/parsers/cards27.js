/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, as specified
  const headerRow = ['Cards (cards27)'];
  const rows = [];

  // Select all cards
  const cardEls = element.querySelectorAll('.row > .avd-column');

  cardEls.forEach(cardEl => {
    // --- IMAGE CELL ---
    let imgEl = null;
    const shortDiv = cardEl.querySelector('.link-image-background .short');
    if (shortDiv && shortDiv.style.backgroundImage) {
      const urlMatch = shortDiv.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        imgEl = document.createElement('img');
        imgEl.src = urlMatch[1];
        imgEl.alt = '';
      }
    }

    // --- TEXT CELL ---
    const textCell = [];
    // Title (h6)
    const h6 = cardEl.querySelector('.text h6');
    if (h6) {
      const titleEl = document.createElement('span');
      titleEl.style.fontWeight = 'bold';
      titleEl.textContent = h6.textContent.trim();
      textCell.push(titleEl);
    }
    // Label (story-label) and description (hidden)
    const p = cardEl.querySelector('.text p');
    if (p) {
      // Label
      const labelSpan = p.querySelector('.story-label');
      if (labelSpan) {
        const labelEl = document.createElement('span');
        labelEl.textContent = labelSpan.textContent.trim();
        textCell.push(labelEl);
      }
      // Hidden description
      const descSpan = p.querySelector('.hidden');
      if (descSpan) {
        const descEl = document.createElement('p');
        descEl.textContent = descSpan.textContent.trim();
        textCell.push(descEl);
      }
    }
    // CTA link (Read more >)
    const ctasDiv = cardEl.querySelector('.text.ctas');
    if (ctasDiv) {
      const ctaLink = ctasDiv.querySelector('a');
      if (ctaLink) {
        textCell.push(ctaLink);
      }
    }

    rows.push([imgEl, textCell]);
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
