/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Hero (hero46)'];

  // 2nd row: Background image (none in provided HTML, so leave empty string)
  const bgRow = [''];

  // 3rd row: Content - headline, subheading, call-to-action, etc.
  // Find the main column that holds the content
  const mainColumn = element.querySelector('.avd-column');
  if (!mainColumn) return;

  // Gather elements to include: jump link and the headline
  const contentElements = [];
  // Find the jump link container (call-to-action)
  const jumpContainer = mainColumn.querySelector('.history-jump__container');
  if (jumpContainer) contentElements.push(jumpContainer);
  // Find the headline (h1)
  const h1 = mainColumn.querySelector('h1');
  if (h1) contentElements.push(h1);

  // If neither found, put an empty string so the row is not empty
  const contentRow = [contentElements.length ? contentElements : ['']];

  // Compose the block table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
