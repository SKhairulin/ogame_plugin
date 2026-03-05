// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('mainToggle');
    const statusText = document.getElementById('status');
    const urlInfo = document.getElementById('currentUrl');
    const applyButton = document.getElementById('applyNow');
    
    // Получаем текущую вкладку и загружаем сохраненное состояние
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      urlInfo.textContent = `URL: ${currentTab.url}`;
      
      // Загружаем состояние переключателя из хранилища
      chrome.storage.local.get(['extensionEnabled'], function(result) {
        const isEnabled = result.extensionEnabled || false;
        toggleSwitch.checked = isEnabled;
        updateStatus(isEnabled);
      });
    });
    
    // Обработчик переключения
    toggleSwitch.addEventListener('change', function() {
      const isEnabled = toggleSwitch.checked;
      
      // Сохраняем состояние
      chrome.storage.local.set({extensionEnabled: isEnabled}, function() {
        updateStatus(isEnabled);
        
        // Отправляем сообщение фоновому скрипту о изменении состояния
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleExtension',
            enabled: isEnabled
          }).catch(() => {
            // Игнорируем ошибки, если content script еще не загружен
          });
        });
      });
    });
    
    // Кнопка для немедленного применения на текущей странице
    applyButton.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'applyNow',
          enabled: toggleSwitch.checked
        }).catch((error) => {
          console.log('Ошибка отправки сообщения:', error);
          alert('Перезагрузите страницу для применения изменений');
        });
      });
    });
    
    function updateStatus(isEnabled) {
      if (isEnabled) {
        statusText.textContent = 'Статус: ВКЛЮЧЕНО';
        statusText.style.color = '#4CAF50';
      } else {
        statusText.textContent = 'Статус: выключено';
        statusText.style.color = '#777';
      }
    }
  });