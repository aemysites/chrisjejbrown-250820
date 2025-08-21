/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name in the example
  const headerRow = ['Hero (hero25)'];

  // The main column that contains the content
  const mainColumn = element.querySelector('.avd-column.col-xs-12.col-sm-10.col-md-10.lpm-column-transparent');
  let svgEl = null;
  let titleEl = null;

  if (mainColumn) {
    // Find all .html-component-inner blocks
    const htmlInners = mainColumn.querySelectorAll('.html-component-inner');
    for (const htmlInner of htmlInners) {
      const svg = htmlInner.querySelector('svg');
      if (svg) {
        svgEl = svg;
      }
      const h1 = htmlInner.querySelector('h1');
      if (h1) {
        titleEl = h1;
      }
    }
  }

  // 2nd row: Visual (SVG graphic)
  // If missing, use empty string for resilience
  const visualRow = [svgEl ? svgEl : ''];

  // 3rd row: Title (from h1)
  // If missing, use empty string for resilience
  const contentRow = [titleEl ? titleEl : ''];

  // Compose table rows
  const cells = [
    headerRow,
    visualRow,
    contentRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
