/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing columns
  const row = element.querySelector(':scope > div > .row');
  if (!row) return;

  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Only the right column's links go in the table, per the example
  const rightCol = columns[1];
  // Gather all <a> tags in the right column
  const links = Array.from(rightCol.querySelectorAll('a'));

  // Filter out any links that have no text content (shouldn't be present, but safe guard)
  const validLinks = links.filter(link => link.textContent && link.textContent.trim());
  if (validLinks.length === 0) return;

  // Build the cells array: header, then one row per link (single column)
  const cells = [
    ['Table (no header)'],
    ...validLinks.map(link => [link])
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
