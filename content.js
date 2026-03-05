// content.js - Внедряется на все страницы
let isEnabled = false;
let inAction = false

function AnyDomChangedEvent(state) {  
  //const {tasks} = state
  GoToGalaxy('238')

  GalaxyAutoExpo()
  
  //chrome.storage.local.set({state: {tasks}})
}

function GoToGalaxy(num){
  if (!document.URL.includes('/game/index.php?page=ingame&component=galaxy')) return
  const system_input = document.getElementById('system_input')
  if (!!system_input) {
    if (system_input.value != num){ 
      system_input.value = num
      const btn = document.getElementById('galaxyHeader')?.getElementsByClassName('btn_blue')?.[0]
      btn?.click()
    }
  }

}


function GalaxyAutoExpo() {
  const MAX_EXPO = 8
  if (!document.URL.includes('/game/index.php?page=ingame&component=galaxy')) return

  const cbItem = document.getElementsByClassName('dropdown currentlySelected expeditionFleetTemplateSelect')?.[0]?.childNodes?.[0]
  const data1145 = cbItem?.getAttribute('data-value')

  if ( data1145 != '1145') {
      cbItem?.click()
      
      setTimeout(()=>{
        const rel = cbItem?.getAttribute('rel')                    
        if (!!rel ) {            
            document.getElementById(rel)?.childNodes?.[1]?.childNodes?.[0]?.click()
        }
  
      },500)
  } 



  if (Array.from(document.getElementById('eventContent')?.
      getElementsByClassName('eventFleet') || [])?.filter(e=>e.cells[0].innerText?.includes('готов')).length > 0)
      location.reload()
          //.map(e=>e?.closest('tr'))?.forEach(e=>e?.remove())

  if (data1145 != '1145') return;
   
  if  ((data1145 == '1145')
        && (Array.from(document.getElementById('eventContent')?.
      getElementsByClassName('eventFleet') || [])?.
      map(e=>e.cells[2].childNodes[1].getAttribute('data-tooltip-title'))?.
      filter(e=>e.includes('Экспедиция (В)')).length || MAX_EXPO) < MAX_EXPO) {
            document.getElementById('sendExpeditionFleetTemplateFleet').click()
  }
   
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
  if (!isEnabled) return;
  AnyDomChangedEvent()
  //chrome.storage.local.get('state', AnyDomChangedEvent)
});

// Запускаем наблюдение после загрузки страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {    
    observer.observe(document.body, { childList: true, subtree: true });
  });
} else {
  observer.observe(document.body, { childList: true, subtree: true });
}