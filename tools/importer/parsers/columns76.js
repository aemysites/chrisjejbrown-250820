/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by selector
  function findDirect(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Find the row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Get the column divs
  const columns = Array.from(row.children).filter(el => el.classList.contains('avd-column'));
  if (columns.length < 2) return;

  // LEFT COLUMN: main article
  const leftCol = columns[0];
  let leftContent = [];

  // Title block
  const titleBlock = findDirect(leftCol, 'div')[0]; // first block, usually h2
  if (titleBlock) leftContent.push(titleBlock);

  // PDF download link
  const pdfLink = leftCol.querySelector('a.download-pdf');
  if (pdfLink) leftContent.push(pdfLink);

  // Main image and caption
  const imgBlock = leftCol.querySelector('.image.parbase img');
  if (imgBlock) leftContent.push(imgBlock);
  const imgCaption = leftCol.querySelector('.blog-img-caption');
  if (imgCaption) leftContent.push(imgCaption);

  // Share icons
  const shareBlock = leftCol.querySelector('.share-pills');
  if (shareBlock) leftContent.push(shareBlock);

  // All main text blocks (ensure paragraphs and headings included)
  const textBlocks = leftCol.querySelectorAll('.text.parbase .rte-text-p');
  textBlocks.forEach(tb => {
    leftContent.push(tb);
  });

  // Experiencefragment About blocks
  const expTextBlocks = leftCol.querySelectorAll('.experiencefragment .rte-text-p');
  expTextBlocks.forEach(tb => {
    leftContent.push(tb);
  });

  // Back link (bottom of article)
  const backLinkBlock = leftCol.querySelector('.rte-text-p a[href*="press-releases"]');
  if (backLinkBlock) leftContent.push(backLinkBlock);

  // RIGHT COLUMN: media contacts
  const rightCol = columns[1];
  let rightContent = [];

  // Collect all text blocks containing contacts info
  const contactBlocks = rightCol.querySelectorAll('.text.parbase .rte-text-p');
  contactBlocks.forEach(cb => {
    rightContent.push(cb);
  });

  // Compose table header and rows
  const headerRow = ['Columns (columns76)'];
  const columnsRow = [leftContent, rightContent];

  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
