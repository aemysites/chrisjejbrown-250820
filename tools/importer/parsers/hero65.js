/* global WebImporter */
export default function parse(element, { document }) {
  // Find the relevant child columns (left: text/button, right: image)
  const row = element.querySelector('.row') || element;
  const columns = row.querySelectorAll('.avd-column');
  let leftCol = null, rightCol = null;
  if (columns.length >= 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  }
  // Extract background image from right column (first <img> only, if present)
  let bgImg = null;
  if (rightCol) {
    bgImg = rightCol.querySelector('img');
  }
  // Extract content from left column (headings, paragraphs, button)
  let contentEls = [];
  if (leftCol) {
    // Add heading(s)
    const headings = leftCol.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => contentEls.push(h));
    // Find all text containers (paragraphs)
    const paragraphContainers = leftCol.querySelectorAll('.rte-text-p');
    paragraphContainers.forEach(pc => {
      // Add all non-empty <p> children, ignore empty or &nbsp;
      pc.querySelectorAll('p').forEach(p => {
        if (p.textContent && p.textContent.trim() && p.innerHTML.trim() !== '&nbsp;') {
          contentEls.push(p);
        }
      });
    });
    // Find the CTA button (first <a> with button class)
    const button = leftCol.querySelector('a.btn, .button a');
    if (button) {
      contentEls.push(button);
    }
  }
  // Block table structure
  const cells = [
    ['Hero (hero65)'],
    [bgImg ? bgImg : ''],
    [contentEls.length ? contentEls : '']
  ];
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
