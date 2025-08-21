/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per requirements
  const headerRow = ['Cards (cardsNoImages37)'];
  const cells = [headerRow];

  // Helper to extract card content from a card root (col)
  function extractCardContent(col) {
    // Find the a.box-button__content link
    const link = col.querySelector('a.box-button__content');
    if (!link) return null;
    // Find the label in <p class="box-button__text"> or fallback to link text
    let label = '';
    const p = link.querySelector('p.box-button__text');
    if (p) {
      label = p.textContent.trim();
    } else {
      // fallback, remove child SVGs for textContent
      label = Array.from(link.childNodes)
        .filter(n => n.nodeType === 3 || (n.nodeType === 1 && n.tagName !== 'SVG'))
        .map(n => n.textContent)
        .join(' ').trim();
    }
    // Compose the cell content: title (strong), then CTA link (with no SVG)
    const strong = document.createElement('strong');
    strong.textContent = label;
    // Create actual link element, keeping the href from source
    const cta = link;
    // Remove all child nodes except <p> (label), remove SVGs for cleaner output
    Array.from(cta.querySelectorAll('svg')).forEach(svg => svg.remove());
    // Set link text to just label (no extraneous whitespace)
    if (p) {
      cta.textContent = label;
    } else {
      cta.textContent = label;
    }
    // Avoid duplicating label if cta and strong would both appear
    // Use a fragment for vertical layout: strong, then <br>, then link
    const frag = document.createElement('div');
    frag.appendChild(strong);
    frag.appendChild(document.createElement('br'));
    frag.appendChild(cta);
    return [frag];
  }

  // 1. Find all .avd-column and extract cards
  const avdColumns = element.querySelectorAll('.avd-column');
  avdColumns.forEach(col => {
    const cardRow = extractCardContent(col);
    if (cardRow) cells.push(cardRow);
  });

  // 2. Check for any cards in .responsivegrid that are not inside .avd-column
  const responsiveGrids = element.querySelectorAll('.responsivegrid');
  responsiveGrids.forEach(grid => {
    const links = Array.from(grid.querySelectorAll('a.box-button__content')).filter(link => !link.closest('.avd-column'));
    links.forEach(link => {
      // Create a temporary wrapper so we can use the same extractCardContent
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(link);
      const cardRow = extractCardContent(tempDiv);
      if (cardRow) cells.push(cardRow);
    });
  });

  // Only replace if we found at least one card
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
