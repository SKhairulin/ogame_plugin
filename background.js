// background.js - Фоновый сервис-воркер

// Слушаем установку расширения
chrome.runtime.onInstalled.addListener(() => {
    // Устанавливаем значение по умолчанию
    chrome.storage.local.set({ extensionEnabled: false });
    console.log('Расширение установлено');
  });
  
  // Слушаем сообщения от popup или content скриптов
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getState') {
      chrome.storage.local.get(['extensionEnabled'], function(result) {
        sendResponse({ enabled: result.extensionEnabled || false });
      });
      return true; // Для асинхронного ответа
    }
  });
  
  // При обновлении вкладки можем проверить состояние
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.local.get(['extensionEnabled'], function(result) {
        if (result.extensionEnabled) {
          // Если расширение включено, уведомляем вкладку
          chrome.tabs.sendMessage(tabId, {
            action: 'pageLoaded',
            enabled: true
          }).catch(() => {
            // Игнорируем ошибки
          });
        }
      });
    }
  });