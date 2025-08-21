/* global WebImporter */
export default function parse(element, { document }) {
  // Block header matches the example exactly
  const headerRow = ['Cards (cards32)'];

  // Locate content wrappers
  const main = element.querySelector('.pill-video-component-wrapper');
  if (!main) return;
  const textWrapper = main.querySelector('.pill-video-text-wrapper');
  const pillWrapper = main.querySelector('.pill-video-component__pills');
  if (!textWrapper || !pillWrapper) return;

  // Get all card text containers and video containers
  const textDivs = Array.from(textWrapper.children);
  const pillDivs = Array.from(pillWrapper.children);
  const cardCount = Math.min(textDivs.length, pillDivs.length);

  // Compose table rows for each card
  const rows = [headerRow];
  for (let i = 0; i < cardCount; i++) {
    let visualCell = '';
    let textCell = '';

    // Visual cell: convert <video> to a link as required
    const pillDiv = pillDivs[i];
    if (pillDiv) {
      const video = pillDiv.querySelector('video');
      if (video && video.src) {
        const a = document.createElement('a');
        a.href = video.src;
        a.textContent = video.src;
        visualCell = a;
      }
    }

    // Text cell: include all child elements and non-empty text nodes from .pill-video-component__text
    const textDiv = textDivs[i];
    if (textDiv) {
      const content = [];
      // Collect all children (for semantic meaning), and text nodes
      Array.from(textDiv.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          content.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          content.push(document.createTextNode(node.textContent.trim()));
        }
      });
      // If the div is empty (edge case), fallback to its textContent
      textCell = content.length ? content : textDiv.textContent.trim();
    }

    rows.push([visualCell, textCell]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
