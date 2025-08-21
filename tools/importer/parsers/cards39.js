/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate .avd-column blocks (each card)
  const columns = Array.from(element.querySelectorAll(':scope > div > div.row > div > div.avd-column'));
  const cells = [];
  cells.push(['Cards (cards39)']); // Header row exactly as specified

  columns.forEach(col => {
    // Image
    const imagePar = col.querySelector('.image');
    let img = null;
    if (imagePar) {
      img = imagePar.querySelector('img');
    }

    // Text (title + description)
    let textFrag = document.createDocumentFragment();
    const banner = col.querySelector('.spotlight-banner');
    if (banner) {
      const title = banner.querySelector('.spotlight-banner-title');
      const desc = banner.querySelector('.spotlight-banner-sub-title');
      if (title) textFrag.appendChild(title);
      if (desc) textFrag.appendChild(desc);
    }
    // Ensure cell is not empty; fallback to empty fragment
    cells.push([
      img ? img : document.createElement('span'),
      textFrag.childNodes.length ? textFrag : document.createElement('span')
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
