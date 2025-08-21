/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top-level card set container. This is the first nested column-control (the block for this set of cards)
  // Exclude column-controls that are within another card row (cards within cards)
  function findMainCardContainer(root) {
    // Find all column-controls in the tree
    const all = Array.from(root.querySelectorAll('.column-control.parbase'));
    // Find the one whose parent or grandparent is not another .column-control.parbase (so top-level)
    for (const cc of all) {
      let isNested = false;
      let n = cc.parentElement;
      while (n && n !== root) {
        if (n.classList && n.classList.contains('column-control') && n.classList.contains('parbase')) {
          isNested = true;
          break;
        }
        n = n.parentElement;
      }
      if (!isNested) return cc;
    }
    // fallback: use root
    return root;
  }

  // Given a column-control block, extract only its direct child cards
  function getDirectCardRows(cardContainer) {
    const cardRows = [];
    // Find all rows: direct children .row inside .column-control
    const rowWrappers = Array.from(cardContainer.querySelectorAll(':scope > div > div.row'));
    rowWrappers.forEach(row => {
      const columns = Array.from(row.children);
      if (columns.length === 2) {
        let imgCol = null, textCol = null;
        if (columns[0].querySelector('.image.parbase') && columns[1].querySelector('.text.parbase')) {
          imgCol = columns[0]; textCol = columns[1];
        } else if (columns[1].querySelector('.image.parbase') && columns[0].querySelector('.text.parbase')) {
          imgCol = columns[1]; textCol = columns[0];
        } else {
          return;
        }
        const imgWrap = imgCol.querySelector('.image.parbase');
        const img = imgWrap ? imgWrap.querySelector('img') : null;
        const textWrap = textCol.querySelector('.text.parbase');
        if (img && textWrap) {
          cardRows.push([img, textWrap]);
        }
      }
    });
    return cardRows;
  }

  // Find the main card container relevant for this block
  const cardContainer = findMainCardContainer(element);
  // Extract only direct card rows from this main container
  const cards = getDirectCardRows(cardContainer);
  if (!cards.length) return;
  const headerRow = ['Cards (cards24)'];
  const cells = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
