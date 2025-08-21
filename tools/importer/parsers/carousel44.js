/* global WebImporter */
export default function parse(element, { document }) {
  // Get all carousel slides
  const columns = Array.from(element.querySelectorAll('.avd-column'));
  const cells = [['Carousel (carousel44)']];

  columns.forEach(col => {
    // Find the .video-responsive element
    const videoResponsive = col.querySelector('.video-responsive');
    if (!videoResponsive) return;

    // Find the main thumbnail image inside <a>
    let thumbImg = null;
    const anchor = videoResponsive.querySelector('a');
    if (anchor) {
      const imgs = anchor.querySelectorAll('img');
      if (imgs.length > 0) {
        thumbImg = imgs[0];
      }
    }
    if (!thumbImg) {
      // Fallback: first <img> in videoResponsive
      thumbImg = videoResponsive.querySelector('img');
    }

    // Find <iframe> (the embedded video)
    let videoLink = null;
    const iframe = videoResponsive.querySelector('iframe');
    if (iframe && iframe.src) {
      videoLink = document.createElement('a');
      videoLink.href = iframe.src;
      videoLink.textContent = iframe.src;
    }

    // Collect any text content outside the video-responsive container
    // For this HTML, text content is likely missing, but we check everything just in case
    let textElems = [];
    Array.from(col.childNodes).forEach(n => {
      // Only include elements with visible text and not the .video-responsive block, nor script/style
      if (n.nodeType === 1 && !n.classList.contains('html') && !n.classList.contains('html-component-inner')) {
        if (n !== videoResponsive && n.textContent && n.textContent.trim()) {
          textElems.push(n);
        }
      }
      // Include direct text nodes
      if (n.nodeType === 3 && n.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = n.textContent.trim();
        textElems.push(span);
      }
    });

    // Compose cell contents for the slide
    const slideCellContents = [];
    if (thumbImg) slideCellContents.push(thumbImg);
    if (videoLink) slideCellContents.push(document.createElement('br'), videoLink);
    if (textElems.length) {
      slideCellContents.push(document.createElement('br'), ...textElems);
    }

    // Only add slide if there is at least an image, video link, or text
    if (slideCellContents.length > 0) {
      cells.push([slideCellContents]);
    }
  });

  // Build and replace table block only if we have at least one slide
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
