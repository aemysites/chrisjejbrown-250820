/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main column; fallback to the element itself if not found
  let mainCol = element.querySelector('.col-md-9, .col-sm-9, .col-xs-12');
  if (!mainCol) mainCol = element;

  // Identify all direct children to find sections
  const contentNodes = Array.from(mainCol.children);
  const headerTags = ['H2', 'H3', 'H4'];
  let sections = [];

  // Section grouping: group by headers and following content
  let lastHeaderIdx = -1;
  for (let i = 0; i < contentNodes.length; i++) {
    const node = contentNodes[i];
    if (headerTags.includes(node.tagName)) {
      if (lastHeaderIdx !== -1) {
        let headerElem = contentNodes[lastHeaderIdx];
        let bodyElems = contentNodes.slice(lastHeaderIdx + 1, i)
          .filter(n =>
            !(n.classList && (n.classList.contains('spacer') || n.classList.contains('line--gray')))
          );
        if (headerElem && bodyElems.length) {
          sections.push([headerElem, bodyElems.length === 1 ? bodyElems[0] : bodyElems]);
        }
      }
      lastHeaderIdx = i;
    }
  }
  // Final section
  if (lastHeaderIdx !== -1) {
    let headerElem = contentNodes[lastHeaderIdx];
    let bodyElems = contentNodes.slice(lastHeaderIdx + 1)
      .filter(n =>
        !(n.classList && (n.classList.contains('spacer') || n.classList.contains('line--gray')))
      );
    if (headerElem && bodyElems.length) {
      sections.push([headerElem, bodyElems.length === 1 ? bodyElems[0] : bodyElems]);
    }
  }

  // Fallback: Pair .rte-text-p blocks as Q&A if no header found
  if (sections.length === 0) {
    const rteBlocks = Array.from(mainCol.querySelectorAll('.rte-text-p'));
    for (let i = 0; i < rteBlocks.length; i += 2) {
      let labelElem = rteBlocks[i];
      let contentElem = rteBlocks[i + 1] || '';
      if (labelElem && labelElem.textContent.trim()) {
        sections.push([labelElem, contentElem]);
      }
    }
  }

  // Last fallback: single section containing all text blocks
  if (sections.length === 0) {
    const allTextBlocks = Array.from(mainCol.querySelectorAll('.rte-text-p'));
    if (allTextBlocks.length > 1) {
      sections.push([allTextBlocks[0], allTextBlocks.slice(1)]);
    }
  }

  // Now build cells: header row is exactly one cell ['Accordion']
  const cells = [['Accordion']];
  sections.forEach(([labelElem, contentElem]) => {
    // For label: use text if header, else use element
    let labelCell = (labelElem.tagName && headerTags.includes(labelElem.tagName))
      ? labelElem.textContent.trim() : labelElem;
    // For content: array or element
    let contentCell = Array.isArray(contentElem)
      ? contentElem.filter(el => el.textContent && el.textContent.trim() || el.querySelector('img,ul,ol'))
      : contentElem;
    cells.push([labelCell, contentCell]); // Always two cells for content rows
  });

  // Remove any rows missing both label and content
  const filteredCells = [cells[0]];
  for (let i = 1; i < cells.length; i++) {
    let [label, content] = cells[i];
    let labelTxt = typeof label === 'string' ? label : (label.textContent || '').trim();
    let contentTxt = '';
    if (Array.isArray(content)) {
      contentTxt = content.map(c => (c.textContent || '').trim()).join(' ');
    } else if (typeof content === 'string') {
      contentTxt = content.trim();
    } else if (content && content.textContent) {
      contentTxt = content.textContent.trim();
    }
    if (labelTxt && contentTxt) {
      filteredCells.push([label, content]);
    }
  }

  // Only the header row should have one cell; content rows must have two
  // Remove extra cells from header if any (should only ever be one)
  filteredCells[0] = [filteredCells[0][0]];

  // Create and replace
  const blockTable = WebImporter.DOMUtils.createTable(filteredCells, document);
  element.replaceWith(blockTable);
}
