/* global WebImporter */
export default function parse(element, { document }) {
  // The header must be a row with a single cell, matching the strict markdown example
  const headerRow = ['Columns (columns45)'];

  // Find the two main columns in the block
  const columns = element.querySelectorAll(':scope > div');
  let logoCol = null;
  let linksCol = null;
  if (columns.length === 2) {
    logoCol = columns[0];
    linksCol = columns[1];
  } else {
    // Fallback if HTML structure changes
    logoCol = element.querySelector('.footer-logo-container') || document.createElement('div');
    linksCol = element.querySelector('.footer-links-container') || document.createElement('div');
  }

  // For the links column, combine all ul.footer-links in linksCol into a fragment
  const linksFragment = document.createDocumentFragment();
  const footerLinksUls = linksCol.querySelectorAll('ul.footer-links');
  if (footerLinksUls.length > 0) {
    footerLinksUls.forEach((ul) => linksFragment.appendChild(ul));
  } else {
    // Fallback: in case .footer-links not found, put entire linksCol
    linksFragment.appendChild(linksCol);
  }

  // Create the content row with two cells (logo and links)
  const contentRow = [logoCol, linksFragment];

  // Build the cells array: first row is header (single cell), second row is content (two cells)
  const cells = [headerRow, contentRow];

  // Generate and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
