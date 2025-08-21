/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child divs
  function getImmediateDivs(el) {
    return Array.from(el.querySelectorAll(':scope > div'));
  }

  // Find the top-level .row div
  const topRow = element.querySelector('.row');
  if (!topRow) return;

  // Find the row with columns
  const alignMiddleRow = topRow.querySelector('.row-align-middle');
  if (!alignMiddleRow) return;

  // Find all direct column children
  const columns = getImmediateDivs(alignMiddleRow).filter(div => div.classList.contains('avd-column'));
  if (columns.length < 2) return;

  // LEFT COLUMN: Gather text and button
  const leftCol = columns[0];
  const leftContent = [];
  // Text (h3, p)
  const textBlock = leftCol.querySelector('.text .rte-text-p');
  if (textBlock) {
    leftContent.push(textBlock);
  }
  // Button
  const buttonBlock = leftCol.querySelector('.button');
  if (buttonBlock) {
    leftContent.push(buttonBlock);
  }

  // RIGHT COLUMN: Gather video thumbnail image, play button, and video link
  const rightCol = columns[1];
  const rightContent = [];
  const htmlPar = rightCol.querySelector('.html-component-inner');
  if (htmlPar) {
    // Find the video-responsive div
    const videoResponsive = htmlPar.querySelector('.video-responsive');
    if (videoResponsive) {
      // Thumbnail image (img inside <a>)
      const thumbnailAnchor = videoResponsive.querySelector('a');
      if (thumbnailAnchor) {
        const thumbnailImgs = Array.from(thumbnailAnchor.querySelectorAll('img'));
        // Add both the video thumbnail and play button images
        thumbnailImgs.forEach(img => rightContent.push(img));
      }
      // iframe link (not shown visually, but must be included as a link)
      const iframe = videoResponsive.querySelector('iframe');
      if (iframe && iframe.src) {
        const link = document.createElement('a');
        link.href = iframe.src;
        link.textContent = 'Watch video';
        rightContent.push(link);
      }
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns11)'];
  const contentRow = [leftContent, rightContent];
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the table block and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
