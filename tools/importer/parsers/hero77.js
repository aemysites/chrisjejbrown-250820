/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row matches example
  const headerRow = ['Hero (hero77)'];

  // 2. Image/background image row - No images in source, so empty cell
  const imageRow = [''];

  // 3. Content row: heading(s), paragraph(s), call-to-action (if any)
  // We want to retrieve everything meaningful, preserving order and reference
  // Find all .text.parbase .rte-text-p inside the deepest column

  // Helper: get all direct descendants that are .text.parbase .rte-text-p
  // We'll first find all h1-h6 and p elements inside those blocks
  let contentElements = [];
  // Find all .rte-text-p blocks in document order
  const rteTextPs = element.querySelectorAll('.text.parbase .rte-text-p');
  rteTextPs.forEach((rte) => {
    // For each rte, push all heading and paragraph elements that have content
    Array.from(rte.children).forEach((child) => {
      if (/^H[1-6]$/i.test(child.tagName) || (child.tagName === 'P' && child.textContent.trim())) {
        contentElements.push(child);
      }
    });
  });
  // Edge case: If nothing found, leave cell empty
  const contentRow = [contentElements.length ? contentElements : ['']];

  // Compose final block table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}