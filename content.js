// Content script voor sneltoetsen (optioneel)
// Voeg keyboard shortcuts toe

document.addEventListener('keydown', (event) => {
  // Ctrl + Shift + A: Selecteer alle checkboxes
  if (event.ctrlKey && event.shiftKey && event.key === 'A') {
    event.preventDefault();
    selectAllCheckboxes();
  }
  
  // Ctrl + Shift + D: Deselecteer alle checkboxes
  if (event.ctrlKey && event.shiftKey && event.key === 'D') {
    event.preventDefault();
    deselectAllCheckboxes();
  }
  
  // Ctrl + Shift + T: Toggle alle checkboxes
  if (event.ctrlKey && event.shiftKey && event.key === 'T') {
    event.preventDefault();
    toggleAllCheckboxes();
  }
});

function expandAllSections() {
  // Zoek alle <i> iconen met aria-label bevat 'uitvouwen' en tekst 'expand_more'
  const expandIcons = Array.from(document.querySelectorAll('i[aria-label*="uitvouwen"]'))
    .filter(icon => icon.textContent.trim() === 'expand_more');
  expandIcons.forEach(icon => {
    // Zoek klikbare ouder (role="button" of <material-icon> of <button>)
    let clickable = icon.closest('[role="button"], material-icon, button');
    if (clickable && typeof clickable.click === 'function') {
      clickable.click();
    }
  });
}

function selectAllCheckboxes() {
  expandAllSections();
  const checkboxes = [
    ...document.querySelectorAll('input[type="checkbox"]'),
    ...document.querySelectorAll('[role="checkbox"]')
  ];
  checkboxes.forEach(checkbox => {
    if (checkbox.disabled || checkbox.getAttribute('aria-disabled') === 'true') return;
    if (checkbox.type === 'checkbox') {
      if (!checkbox.checked) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else if (checkbox.getAttribute('role') === 'checkbox') {
      if (checkbox.getAttribute('aria-checked') !== 'true') {
        checkbox.click();
      }
    }
  });
}

function deselectAllCheckboxes() {
  expandAllSections();
  const checkboxes = [
    ...document.querySelectorAll('input[type="checkbox"]'),
    ...document.querySelectorAll('[role="checkbox"]')
  ];
  checkboxes.forEach(checkbox => {
    if (checkbox.disabled || checkbox.getAttribute('aria-disabled') === 'true') return;
    if (checkbox.type === 'checkbox') {
      if (checkbox.checked) {
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else if (checkbox.getAttribute('role') === 'checkbox') {
      if (checkbox.getAttribute('aria-checked') !== 'false') {
        checkbox.click();
      }
    }
  });
}

function toggleAllCheckboxes() {
  expandAllSections();
  const checkboxes = [
    ...document.querySelectorAll('input[type="checkbox"]'),
    ...document.querySelectorAll('[role="checkbox"]')
  ];
  checkboxes.forEach(checkbox => {
    if (checkbox.disabled || checkbox.getAttribute('aria-disabled') === 'true') return;
    if (checkbox.type === 'checkbox') {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (checkbox.getAttribute('role') === 'checkbox') {
      checkbox.click();
    }
  });
}