/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns41)'];

  // Locate inner columns block
  const mainRow = element.querySelector('.row');
  if (!mainRow) return;
  const columns = mainRow.querySelectorAll(':scope > div');
  if (columns.length !== 2) return;

  // LEFT COLUMN: Find heading and paragraph only
  let leftColContent = [];
  const leftCol = columns[0];
  // Find the .rte-text-p block
  const rteBlock = leftCol.querySelector('.rte-text-p');
  if (rteBlock) {
    // Only append heading and paragraph
    const heading = rteBlock.querySelector('h3');
    const para = rteBlock.querySelector('p');
    if (heading) leftColContent.push(heading);
    if (para) leftColContent.push(para);
  }

  // RIGHT COLUMN: Form, but handle recaptcha iframe
  let rightColContent = [];
  const rightCol = columns[1];
  const form = rightCol.querySelector('form');
  if (form) {
    // Clone the form so we can safely modify
    const formClone = form.cloneNode(true);
    // Find all iframes in the clone
    const iframes = formClone.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      // Only replace if not an image
      if (iframe.src && iframe.tagName.toLowerCase() === 'iframe') {
        const link = document.createElement('a');
        link.href = iframe.src;
        link.textContent = 'View reCAPTCHA';
        link.target = '_blank';
        // Replace iframe with link
        iframe.replaceWith(link);
      }
    });
    rightColContent.push(formClone);
  }

  // Only include columns if they have content
  if (leftColContent.length === 0 && rightColContent.length === 0) return;

  const rows = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
