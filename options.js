// 支持的语言列表
const languages = [
  { code: 'zh-CN', name: '中文（简体）' },
  { code: 'en', name: '英语' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'es', name: '西班牙语' },
  { code: 'ru', name: '俄语' },
  { code: 'pt', name: '葡萄牙语' },
  { code: 'it', name: '意大利语' }
];

// 默认设置
const defaultSettings = {
  sourceLanguage: 'zh-CN',
  targetLanguage: 'en'
};

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  const sourceSelect = document.getElementById('sourceLanguage');
  const targetSelect = document.getElementById('targetLanguage');
  const saveButton = document.getElementById('saveButton');
  const status = document.getElementById('status');

  // 填充语言选项
  languages.forEach(lang => {
    sourceSelect.add(new Option(lang.name, lang.code));
    targetSelect.add(new Option(lang.name, lang.code));
  });

  // 加载保存的设置
  chrome.storage.sync.get(defaultSettings, (settings) => {
    sourceSelect.value = settings.sourceLanguage;
    targetSelect.value = settings.targetLanguage;
  });

  // 保存设置
  saveButton.addEventListener('click', () => {
    const settings = {
      sourceLanguage: sourceSelect.value,
      targetLanguage: targetSelect.value
    };

    chrome.storage.sync.set(settings, () => {
      status.textContent = '设置已保存';
      status.className = 'status success';
      setTimeout(() => {
        status.style.display = 'none';
      }, 2000);
    });
  });
}); 