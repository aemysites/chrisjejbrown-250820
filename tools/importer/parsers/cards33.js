/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards33)'];
  const cardElements = Array.from(element.querySelectorAll('.avd-column'));
  const rows = [headerRow];

  cardElements.forEach(card => {
    // --- IMAGE ---
    let imgDiv = card.querySelector('.link-image-background a .short');
    let imgUrl = '';
    if (imgDiv && imgDiv.style && imgDiv.style.backgroundImage) {
      imgUrl = imgDiv.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
    }
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.alt = '';
    }

    // --- TEXT CONTENT ---
    const textDiv = card.querySelector('.text');
    const contentArray = [];
    if (textDiv) {
      // Card Heading
      const h6 = textDiv.querySelector('h6');
      if (h6) contentArray.push(h6);
      // Label
      const labelSpan = textDiv.querySelector('.story-label');
      if (labelSpan) contentArray.push(labelSpan);
      // Hidden description
      const hiddenSpan = textDiv.querySelector('.hidden');
      if (hiddenSpan) contentArray.push(hiddenSpan);
    }
    // --- CTA ---
    const ctasDiv = card.querySelector('.ctas');
    if (ctasDiv) {
      const ctaLink = ctasDiv.querySelector('a');
      if (ctaLink && ctaLink.href) {
        // Reference the existing <span class="cta"><a>...</a></span> for semantic meaning
        const ctaSpan = ctasDiv.querySelector('.cta');
        if (ctaSpan) {
          contentArray.push(ctaSpan);
        }
      }
    }
    // Compose row: always two columns, image and text
    rows.push([
      imgEl,
      contentArray
    ]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
