/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all immediate .row-align-middle > .avd-column blocks
  const rowElem = element.querySelector('.row');
  if (!rowElem) return;
  const alignMiddle = rowElem.querySelector('.row-align-middle');
  const columns = alignMiddle
    ? Array.from(alignMiddle.querySelectorAll(':scope > .avd-column'))
    : Array.from(rowElem.querySelectorAll(':scope > .avd-column'));

  // Defensive: If no columns found, do nothing
  if (columns.length === 0) return;

  // Table header, as per requirements
  const headerRow = ['Columns (columns71)'];

  // For each column, aggregate the relevant content as a single cell
  const colCells = columns.map((colElem) => {
    // The real content is usually inside a child <div>
    const innerDiv = Array.from(colElem.children).find((c) => c.tagName === 'DIV') || colElem;
    const childBlocks = Array.from(innerDiv.children);
    const cellContent = [];
    // Look for RTE-text (text block)
    childBlocks.forEach((block) => {
      // Text block
      if (block.classList && block.classList.contains('text')) {
        // Get the innermost rte-text-p
        const rte = block.querySelector('.rte-text-p');
        if (rte) cellContent.push(rte);
      } else if (block.classList && block.classList.contains('button')) {
        // Button block
        const btn = block.querySelector('a');
        if (btn) cellContent.push(btn);
      } else if (block.classList && block.classList.contains('html')) {
        // Custom HTML block (usually video or image)
        const htmlInner = block.querySelector('.html-component-inner');
        if (htmlInner) {
          // If YouTube video
          const videoDiv = htmlInner.querySelector('.video-responsive');
          if (videoDiv) {
            // Prefer the video thumbnail and link for non-img embeds
            // Find the linked thumbnail
            const thumbLink = videoDiv.querySelector('a[href]');
            if (thumbLink) {
              // Get the thumbnail image
              const thumbImg = thumbLink.querySelector('img');
              if (thumbImg) cellContent.push(thumbImg);
            }
            // Find the iframe video embed
            const iframe = videoDiv.querySelector('iframe');
            if (iframe && iframe.src) {
              const videoA = document.createElement('a');
              videoA.href = iframe.src;
              videoA.textContent = iframe.src;
              cellContent.push(videoA);
            }
          }
        }
      }
    });
    // Defensive: if no content found, push a non-breaking space to preserve column
    if (cellContent.length === 0) return document.createTextNode('\u00A0');
    // If only one element, return it directly, else an array
    return cellContent.length === 1 ? cellContent[0] : cellContent;
  });

  // Table structure: Header then columns (single row)
  const tableRows = [headerRow, colCells];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
