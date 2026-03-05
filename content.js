// content.js - Внедряется на все страницы

let isEnabled = false;

if (document.URL.endsWith('/game/index.php?page=ingame&component=galaxy')) {


    if (document.getElementsByClassName('dropdown currentlySelected expeditionFleetTemplateSelect')[0].childNodes[0].getAttribute('data-value') != '1145') {
        document.getElementsByClassName('dropdown currentlySelected expeditionFleetTemplateSelect')[0].childNodes[0].click()
        const rel = document.getElementsByClassName('dropdown currentlySelected expeditionFleetTemplateSelect')[0].childNodes[0].getAttribute('rel')
        if (!!rel) {            
            document.getElementById(rel).childNodes[1].childNodes[0].click()
        }
    } 
    let i = 1
    const callback = () => {
        //i++
        //console.log('call')
        const MAX_EXPO = 8

        if (Array.from(document.getElementById('eventContent')?.
            getElementsByClassName('eventFleet') || [])?.filter(e=>e.cells[0].innerText?.includes('готов')).length > 0)
            location.reload()
                //.map(e=>e?.closest('tr'))?.forEach(e=>e?.remove())

        if (document.getElementsByClassName('dropdown currentlySelected expeditionFleetTemplateSelect')[0].childNodes[0].getAttribute('data-value') != '1145') return;

        if (Array.from(document.getElementById('eventContent')?.
            getElementsByClassName('eventFleet') || [])?.
            map(e=>e.cells[2].childNodes[1].getAttribute('data-tooltip-title'))?.
            filter(e=>e.includes('Экспедиция (В)')).length < MAX_EXPO) {
                
          //       console.log('send')
                 document.getElementById('sendExpeditionFleetTemplateFleet').click()
        }
        if (i > 10)  { /*location.reload();*/ i = 1}
    }
    setInterval(callback,3000)
}



// Функция для взаимодействия с элементом #main
function interactWithMain() {
  const mainElement = document.getElementById('main');
  
  if (!mainElement) {
    console.log('Элемент #main не найден на этой странице');
    return false;
  }
  
  console.log('Найден элемент #main:', mainElement);
  
  // Здесь можно добавить любую логику взаимодействия с элементом
  // Например, изменить стили или добавить обработчики
  
  // Пример 1: Подсветить элемент
  mainElement.style.transition = 'all 0.3s ease';
  mainElement.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
  
  // Пример 2: Добавить класс
  mainElement.classList.add('my-extension-enhanced');
  
  // Пример 3: Добавить атрибут данных
  mainElement.dataset.extensionActive = 'true';
  
  // Пример 4: Создать и добавить кнопку
  if (!document.getElementById('myExtensionButton')) {
    const button = document.createElement('button');
    button.id = 'myExtensionButton';
    button.textContent = 'Действие расширения';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      padding: 10px 20px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
    
    button.addEventListener('click', () => {
      alert('Элемент main: ' + (mainElement ? 'найден' : 'не найден'));
      if (mainElement) {
        console.log('Содержимое main:', mainElement.innerHTML.substring(0, 100) + '...');
      }
    });
    
    document.body.appendChild(button);
  }
  
  return true;
}

// Функция для отключения/очистки изменений
function disableFeatures() {
  // Возвращаем стили обратно
  const mainElement = document.getElementById('main');
  if (mainElement) {
    mainElement.style.boxShadow = '';
    mainElement.classList.remove('my-extension-enhanced');
    mainElement.dataset.extensionActive = 'false';
  }
  
  // Удаляем добавленную кнопку
  const button = document.getElementById('myExtensionButton');
  if (button) {
    button.remove();
  }
  
  console.log('Функции расширения отключены');
}

// Загружаем состояние при запуске
chrome.storage.local.get(['extensionEnabled'], function(result) {
  isEnabled = result.extensionEnabled || false;
  
  if (isEnabled) {
    interactWithMain();
  }
});

// Слушаем сообщения от popup или background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Получено сообщение:', message);
  
  if (message.action === 'toggleExtension') {
    isEnabled = message.enabled;
    
    if (isEnabled) {
      interactWithMain();
    } else {
      disableFeatures();
    }
    
    sendResponse({ success: true });
  }
  
  if (message.action === 'applyNow') {
    if (message.enabled) {
      interactWithMain();
    } else {
      disableFeatures();
    }
    sendResponse({ success: true });
  }
  
  if (message.action === 'pageLoaded' && message.enabled) {
    interactWithMain();
  }
  
  return true; // Для асинхронного ответа
});

// Наблюдаем за изменениями DOM на случай, если #main появится позже
const observer = new MutationObserver((mutations) => {
  if (isEnabled && !document.getElementById('main')) {
    return;
  }
  
  if (isEnabled && document.getElementById('main')) {
    interactWithMain();
  }
});

// Запускаем наблюдение после загрузки страницы
if (document.readyState === 'complete') {
    console.log('lookup')
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOC LOADED!')
    //observer.observe(document.body, { childList: true, subtree: true });
     //IN GALAXY

  });
} else {
  observer.observe(document.body, { childList: true, subtree: true });
}