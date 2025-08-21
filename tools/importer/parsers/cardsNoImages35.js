/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Cards (cardsNoImages35)'];
  const cells = [headerRow];

  // Find the slider list that contains the cards
  const sliderList = element.querySelector('.mp-press-slider__list');
  if (sliderList) {
    // Select all immediate children that are cards
    const cardItems = sliderList.querySelectorAll(':scope > .mp-press-slider__item');
    cardItems.forEach(item => {
      const rowContent = [];
      // Heading (h4) is the card title (mandatory)
      const heading = item.querySelector('h4');
      if (heading) rowContent.push(heading);
      // CTA button (if present)
      const buttonContainer = item.querySelector('.button');
      if (buttonContainer) {
        const cta = buttonContainer.querySelector('a');
        if (cta) rowContent.push(cta);
      }
      // If the row is not empty (should not be, but just in case)
      if (rowContent.length > 0) {
        cells.push([rowContent]);
      }
    });
  }

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
