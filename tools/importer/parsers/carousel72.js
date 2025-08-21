/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row
  const headerRow = ['Carousel (carousel72)'];

  // --- Identify columns for image and content ---
  // Look for the top-level .row containing the two columns
  let slideImage = null;
  let slideContent = [];

  // Get all direct descendants with .row
  const allRows = element.querySelectorAll(':scope .row');
  let found = false;
  for (const row of allRows) {
    // Find the pair of columns: one with image, one with text/button
    const cols = row.querySelectorAll(':scope > .row-align-middle > .avd-column, :scope > .avd-column');
    if (cols.length === 2 && !found) {
      // --- IMAGE ---
      const imgCol = cols[0];
      const img = imgCol.querySelector('img');
      if (img) slideImage = img;

      // --- CONTENT ---
      const contentCol = cols[1];
      // Gather heading, paragraphs (excluding empty ones), and button if present
      const contentElems = [];
      const textBlock = contentCol.querySelector('.text .rte-text-p');
      if (textBlock) {
        // Append heading (h4, h3, h2, h1, etc.)
        const heading = textBlock.querySelector('h1,h2,h3,h4,h5,h6');
        if (heading) contentElems.push(heading);
        // Append all non-empty paragraphs
        const paragraphs = textBlock.querySelectorAll('p');
        paragraphs.forEach(p => {
          // filter out paragraphs that are just &nbsp; or empty
          if (p.textContent && p.textContent.replace(/\u00a0/g, '').trim().length > 0) {
            contentElems.push(p);
          }
        });
      }
      // Find button
      const buttonDiv = contentCol.querySelector('.button');
      if (buttonDiv) {
        const btn = buttonDiv.querySelector('a');
        if (btn) contentElems.push(buttonDiv);
      }
      slideContent = contentElems;
      found = true;
    }
  }

  // Fallbacks if not found by .row (single column or minimal structure)
  if (!slideImage) {
    const img = element.querySelector('img');
    if (img) slideImage = img;
  }
  if (slideContent.length === 0) {
    const texts = element.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a');
    slideContent = Array.from(texts);
  }

  // Build table rows
  const rows = [headerRow, [slideImage, slideContent]];

  // Create the block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
