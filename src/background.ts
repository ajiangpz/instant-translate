// 监听扩展安装或更新
chrome.runtime.onInstalled.addListener(() => {
  // 初始化默认设置
  chrome.storage.sync.get({
    sourceLanguage: 'zh-CN',
    targetLanguage: 'en'
  }, (items) => {
    if (!items.sourceLanguage || !items.targetLanguage) {
      chrome.storage.sync.set({
        sourceLanguage: 'zh-CN',
        targetLanguage: 'en'
      });
    }
  });
}); 