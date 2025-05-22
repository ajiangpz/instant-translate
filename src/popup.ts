document.addEventListener('DOMContentLoaded', () => {
  const openOptionsButton = document.getElementById('openOptions');
  const openOptionsLink = document.getElementById('openOptionsLink');

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  if (openOptionsButton) {
    openOptionsButton.addEventListener('click', openOptions);
  }

  if (openOptionsLink) {
    openOptionsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openOptions();
    });
  }
}); 