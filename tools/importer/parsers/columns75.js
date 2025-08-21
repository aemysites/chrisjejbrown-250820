/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row: matches example exactly
  const headerRow = ['Columns (columns75)'];

  // Find heading (centered h2)
  const heading = element.querySelector('h2');

  // Find the form
  const form = element.querySelector('form');

  // Helper: Given a form and the input name, get its parent .form-object block
  function getField(form, inputName, isTextarea = false) {
    let input;
    if (isTextarea) {
      input = form.querySelector(`textarea[name="${inputName}"]`);
    } else {
      input = form.querySelector(`input[name="${inputName}"]`);
    }
    return input ? input.closest('.form-object, .form-object.mg-bt-m') || input.parentElement : '';
  }

  // Helper: get dropdown block
  function getDropdown(form) {
    const dropdownControl = form.querySelector('.dropdown-control');
    return dropdownControl ? dropdownControl.parentElement : '';
  }

  // Helper: Convert iframe to link (except for images)
  function convertIframeToLink(iframe) {
    if (!iframe) return '';
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = 'reCAPTCHA';
    a.target = '_blank';
    return a;
  }

  // Row 1: Heading (spans 2 columns)
  const headingRow = [heading ? heading : '', ''];

  // Row 2: First Name | Last Name
  const firstNameField = getField(form, 'First Name');
  const lastNameField = getField(form, 'Last Name');
  const nameRow = [firstNameField, lastNameField];

  // Row 3: Email | Category
  const emailField = getField(form, 'Email');
  const categoryField = getDropdown(form);
  const emailRow = [emailField, categoryField];

  // Row 4: Inquiry (textarea, spans 2 columns)
  const inquiryField = getField(form, 'description', true);
  const inquiryRow = [inquiryField, ''];

  // Row 5: reCAPTCHA (link, spans 2 columns)
  const recaptchaIframe = form.querySelector('.g-recaptcha iframe[src]');
  const recaptchaLink = convertIframeToLink(recaptchaIframe);
  const recaptchaRow = [recaptchaLink, ''];

  // Row 6: Submit button (spans 2 columns)
  const submitInput = form.querySelector('input[type="submit"]');
  const submitRow = [submitInput ? submitInput : '', ''];

  // Assemble the table cells
  const cells = [
    headerRow,
    headingRow,
    nameRow,
    emailRow,
    inquiryRow,
    recaptchaRow,
    submitRow
  ];

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
