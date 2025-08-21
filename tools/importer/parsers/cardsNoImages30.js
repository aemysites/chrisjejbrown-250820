/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows with the exact header
  const rows = [['Cards (cardsNoImages30)']];

  // Find all the card containers, which are .box-button__container in this HTML
  // Each of these contains one card
  const containers = Array.from(element.querySelectorAll('.box-button__container'));

  containers.forEach(container => {
    // Get the <a> (entire card is the link)
    const link = container.querySelector('a');
    if (!link) return;

    // Try to find the title text (usually in a <p> with .box-button__text, fall back to any <p>, else textContent)
    let titleEl = link.querySelector('.box-button__text') || link.querySelector('p') || link;
    let titleText = titleEl.textContent.trim();

    // Compose the cell content as a div for semantic separation
    const cellContent = document.createElement('div');
    // Add the title (strong)
    const strong = document.createElement('strong');
    strong.textContent = titleText;
    cellContent.appendChild(strong);
    // Cards in the HTML do not have extra description, so just put title
    // Add the CTA link (just the text, as in the original source, even if redundant)
    cellContent.appendChild(document.createElement('br'));
    const cta = document.createElement('a');
    cta.href = link.href;
    cta.textContent = titleText;
    if (link.hasAttribute('target')) cta.setAttribute('target', link.getAttribute('target'));
    cellContent.appendChild(cta);

    // Push as table row
    rows.push([cellContent]);
  });

  // Create the block table and replace the original element.
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
