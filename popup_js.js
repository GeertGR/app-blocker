// Functie om checkbox informatie op te halen
async function getCheckboxInfo() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const checkboxes = [
        ...document.querySelectorAll('input[type="checkbox"]'),
        ...document.querySelectorAll('[role="checkbox"]')
      ];
      const uniqueCheckboxes = Array.from(new Set(checkboxes));
      const selectedCount = uniqueCheckboxes.filter(cb =>
        (cb.type === 'checkbox' && cb.checked) ||
        (cb.getAttribute('role') === 'checkbox' && cb.getAttribute('aria-checked') === 'true')
      ).length;
      return {
        total: uniqueCheckboxes.length,
        selected: selectedCount
      };
    }
  });
  
  return results[0].result;
}

// Functie om alle secties uit te klappen
async function expandAllSections(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const expandIcons = Array.from(document.querySelectorAll('i[aria-label*="uitvouwen"]'))
        .filter(icon => icon.textContent.trim() === 'expand_more');
      expandIcons.forEach(icon => {
        let clickable = icon.closest('[role="button"], material-icon, button');
        if (clickable && typeof clickable.click === 'function') {
          clickable.click();
        }
      });
    }
  });
}

// Functie om alle checkboxes te selecteren
async function selectAllCheckboxes() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await expandAllSections(tab.id);
  
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const checkboxes = [
        ...document.querySelectorAll('input[type="checkbox"]'),
        ...document.querySelectorAll('[role="checkbox"]')
      ];
      let count = 0;
      checkboxes.forEach(checkbox => {
        if (checkbox.disabled || checkbox.getAttribute('aria-disabled') === 'true') return;
        if (checkbox.type === 'checkbox') {
          if (!checkbox.checked) {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          count++;
          }
        } else if (checkbox.getAttribute('role') === 'checkbox') {
          if (checkbox.getAttribute('aria-checked') !== 'true') {
            checkbox.click();
            count++;
          }
        }
      });
      return count;
    }
  });
}

// Functie om alle checkboxes te deselecteren
async function deselectAllCheckboxes() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await expandAllSections(tab.id);
  
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const checkboxes = [
        ...document.querySelectorAll('input[type="checkbox"]'),
        ...document.querySelectorAll('[role="checkbox"]')
      ];
      let count = 0;
      checkboxes.forEach(checkbox => {
        if (checkbox.disabled || checkbox.getAttribute('aria-disabled') === 'true') return;
        if (checkbox.type === 'checkbox') {
          if (checkbox.checked) {
          checkbox.checked = false;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          count++;
          }
        } else if (checkbox.getAttribute('role') === 'checkbox') {
          if (checkbox.getAttribute('aria-checked') !== 'false') {
            checkbox.click();
            count++;
          }
        }
      });
      return count;
    }
  });
}

// Functie om alle checkboxes om te wisselen
async function toggleAllCheckboxes() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await expandAllSections(tab.id);
  
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const checkboxes = [
        ...document.querySelectorAll('input[type="checkbox"]'),
        ...document.querySelectorAll('[role="checkbox"]')
      ];
      let count = 0;
      checkboxes.forEach(checkbox => {
        if (checkbox.disabled || checkbox.getAttribute('aria-disabled') === 'true') return;
        if (checkbox.type === 'checkbox') {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          count++;
        } else if (checkbox.getAttribute('role') === 'checkbox') {
          checkbox.click();
          count++;
        }
      });
      return count;
    }
  });
}

// Zet knoppen standaard enabled
function setActionButtonsEnabled(enabled) {
  document.getElementById('selectAll').disabled = !enabled;
  document.getElementById('deselectAll').disabled = !enabled;
  document.getElementById('toggleAll').disabled = !enabled;
}

// updateCheckboxCounts alleen voor counts
async function updateCheckboxCounts() {
  try {
    const info = await getCheckboxInfo();
    document.getElementById('checkboxCount').textContent = info.total;
    document.getElementById('selectedCount').textContent = info.selected;
  } catch (error) {
    console.error('Error updating checkbox counts:', error);
    document.getElementById('checkboxCount').textContent = '0';
    document.getElementById('selectedCount').textContent = '0';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Zet knoppen standaard enabled
  setActionButtonsEnabled(true);
  updateCheckboxCounts();
  
  // Select all button
  document.getElementById('selectAll').addEventListener('click', async () => {
    await selectAllCheckboxes();
    await updateCheckboxCounts();
  });
  
  // Deselect all button
  document.getElementById('deselectAll').addEventListener('click', async () => {
    await deselectAllCheckboxes();
    await updateCheckboxCounts();
  });
  
  // Toggle all button
  document.getElementById('toggleAll').addEventListener('click', async () => {
    await toggleAllCheckboxes();
    await updateCheckboxCounts();
  });
});