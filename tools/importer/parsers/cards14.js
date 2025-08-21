/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per spec
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Get all direct card columns
  const cards = element.querySelectorAll(':scope > .avd-column');
  cards.forEach(card => {
    // ---- IMAGE CELL ----
    let imageEl = null;
    const linkBg = card.querySelector('.link-image-background a');
    if (linkBg) {
      const bgDiv = linkBg.querySelector('.short');
      if (bgDiv) {
        // The image URL is in the style attribute
        const bgStyle = bgDiv.getAttribute('style') || '';
        const match = bgStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
        if (match) {
          let src = match[1];
          // Resolve relative URLs if needed
          if (src && !/^https?:/.test(src)) {
            try {
              src = new URL(src, document.baseURI).href;
            } catch(e) {}
          }
          const img = document.createElement('img');
          img.src = src;
          // Use headline or alt empty
          const h6 = card.querySelector('.text:not(.ctas) h6');
          img.alt = h6 ? h6.textContent.trim() : '';
          imageEl = img;
        }
      }
    }

    // ---- TEXT CELL ----
    // Title (as Heading)
    const textMain = card.querySelector('.text:not(.ctas)');
    let headingEl = null;
    let metaEl = null;
    if (textMain) {
      const h6 = textMain.querySelector('h6');
      if (h6) {
        // Use <strong> for heading per markdown visual; preserve original text
        headingEl = document.createElement('strong');
        headingEl.textContent = h6.textContent.trim();
      }
      // Byline/date
      const p = textMain.querySelector('p');
      if (p) {
        // Prefer to preserve author/date structure
        metaEl = document.createElement('div');
        p.childNodes.forEach(node => {
          if (node.nodeType === 3) {
            // text
            metaEl.appendChild(document.createTextNode(node.textContent));
          } else {
            metaEl.appendChild(node.cloneNode(true));
          }
        });
      }
    }

    // CTA
    let ctaEl = null;
    const textCtas = card.querySelector('.text.ctas');
    if (textCtas) {
      const a = textCtas.querySelector('a');
      if (a) {
        ctaEl = a;
      }
    }

    // Compose text contents
    const textCellContent = [];
    if (headingEl) textCellContent.push(headingEl);
    if (metaEl) textCellContent.push(document.createElement('br'), metaEl);
    if (ctaEl) textCellContent.push(document.createElement('br'), ctaEl);

    rows.push([
      imageEl || '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
