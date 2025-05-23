document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleTranslation') as HTMLInputElement;
  const statusText = document.querySelector('.status') as HTMLElement;
  const openOptionsButton = document.getElementById('openOptions');
  const openOptionsLink = document.getElementById('openOptionsLink');

  // 从存储中获取当前状态
  chrome.storage.sync.get(['enabled'], (result) => {
    toggleSwitch.checked = result.enabled !== false; // 默认为启用状态
    updateStatusText(toggleSwitch.checked);
  });

  // 监听开关变化
  toggleSwitch.addEventListener('change', (e) => {
    const isEnabled = (e.target as HTMLInputElement).checked;
    chrome.storage.sync.set({ enabled: isEnabled });
    updateStatusText(isEnabled);
    
    // 向当前标签页发送消息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleTranslation', enabled: isEnabled });
      }
    });
  });

  // 更新状态文本
  function updateStatusText(isEnabled: boolean) {
    statusText.textContent = isEnabled ? 
      '在输入框中输入文本即可自动翻译' : 
      '翻译功能已禁用';
  }

  // 打开设置页面
  if (openOptionsButton) {
    openOptionsButton.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  if (openOptionsLink) {
    openOptionsLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
  }
}); 