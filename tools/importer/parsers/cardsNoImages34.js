/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in example
  const headerRow = ['Cards (cardsNoImages34)'];
  const rows = [headerRow];

  // Find main/left column (contains intro and all card links)
  let leftColumn = null;
  const columns = Array.from(element.querySelectorAll('.avd-column'));
  leftColumn = columns.find(col => col.className.match(/col-(sm|md)-9/));
  if (!leftColumn) leftColumn = element;

  // --- Extract intro card (heading + all relevant description) ---
  // Grab all .text.parbase .rte-text-p under leftColumn
  const introBlocks = Array.from(leftColumn.querySelectorAll(':scope > div .text.parbase .rte-text-p'));
  const introContent = [];
  introBlocks.forEach(tb => {
    // Collect headings (h1-h6)
    Array.from(tb.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach(h => {
      if (h.textContent.trim()) introContent.push(h);
    });
    // Collect non-empty paragraphs
    Array.from(tb.querySelectorAll('p')).forEach(p => {
      if (p.textContent.replace(/\u00A0/g, '').trim()) introContent.push(p);
    });
  });
  if (introContent.length) {
    rows.push([introContent.length === 1 ? introContent[0] : introContent]);
  }

  // --- Extract all card links ---
  // Each card is an anchor tag inside .box-button__container
  const cardLinks = Array.from(leftColumn.querySelectorAll('.box-button__container > a'));
  cardLinks.forEach(a => {
    // Remove SVG icons for semantic clarity
    Array.from(a.querySelectorAll('svg')).forEach(svg => svg.remove());
    rows.push([a]);
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
