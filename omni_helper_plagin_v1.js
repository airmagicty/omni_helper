// ==UserScript==
// @name         Omni Image & Commentator
// @version      1.3
// @description  OMNI Helper
// @author       I AM CHILLING & airmagicty
// @match        https://omni.top-academy.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=top-academy.ru
// ==/UserScript==


// ========== OMNI COMMENTATOR ==========
var buttonValue;

const phrases = [
  ["Твоя работа просто восхитительна! Ты продемонстрировал{а} выдающееся понимание материала, выделившись среди своих одноклассников. Так держать!", 11, 12],
  ["Ты проделал{а} отличную работу. Твои усилия видны, и я впечатлен тем, насколько ты глубоко погружаешься в предмет. Продолжай в том же духе!", 10, 12],
  ["Прекрасная работа! Ты показываешь стабильные и качественные результаты. Твой труд и самодисциплина заметны. Продолжай стремиться к совершенству!", 10, 11],
  ["Ты великолепно справил[ся]{ась}! Твой уровень профессионализма выше среднего, и это не может не радовать. Так держать и не останавливаться на достигнутом!", 11, 11],
  ["Браво! Твоя работа выдающаяся. Ты преодолел{а} все ожидания и продемонстрировал{а} истинное мастерство. Продолжай вести себя на таком уровне!", 12, 12],
  ["Ты справил[ся]{ась} с заданием хорошо! Твой труд заслуживает признания. Есть некоторые аспекты, над которыми можно поработать, но в целом — отличная работа!", 8, 9],
  ["Ты продемонстрировал{а} хороший уровень подготовки. Твой подход к выполнению задания заслуживает похвалы. Продолжай улучшать свои навыки!", 8, 10],
  ["Молодец! Ты представил{а} неплохую работу. Твои усилия заметны, и кажется, что с дополнительной практикой ты сможешь добиться еще больших успехов.", 9, 9],
  ["Твои усилия не прошли невидимыми. Ты показываешь хороший прогресс. Продолжай развиваться и стремиться к высоким результатам!", 9, 10],
  ["Приятно видеть твой прогресс! Ты проявил{а} инициативу и рост. Продолжай стараться, и ты достигнешь еще больших высот.", 8, 8],
  ["Твоя работа требует некоторых доработок, но у тебя есть потенциал. Сосредоточь внимание на тех областях, которые требуют улучшения. Ты справишься!", 5, 7],
  ["Ты справил[ся]{ась} с заданием, но есть некоторые моменты, которые стоит улучшить. Разберись с ними, и ты будешь делать еще лучше.", 6, 7],
  ["Дай мне повод задуматься. Твоя работа нуждается в дополнительном внимании к деталям. Продолжай работать над своими навыками и анализируй свои ошибки.", 5, 6],
  ["Ты можешь лучше. Есть некоторые слабые места, которые стоит укрепить. Уделите время и усилия для их улучшения, и результаты не заставят себя ждать.", 6, 6],
  ["Требуется больше усилий. Твоя работа демонстрирует недостаточную глубину понимания. Сосредоточься на развитии своих навыков и знаний.", 5, 5],
  ["Твоя работа неудовлетворительна. Необходимо серьезное улучшение в подготовке. Постарайся лучше понять материал и уделить больше времени подготовке.", 1, 4],
  ["Требуется серьезное улучшение. Ты заметно отстаешь от ожиданий. Обрати внимание на области, где есть пробелы в знаниях, и усилий для их заполнения.", 2, 4],
  ["Повысь свой уровень. Твои результаты ниже среднего. Обрати внимание на конкретные замечания и работай над улучшением своих навыков.", 1, 3],
  ["Ты можешь лучше, не сдавайся. Твоя предыдущая работа оставляет желать лучшего. Сосредоточься на улучшении своих усилий и стремись к лучшим результатам.", 3, 3],
  ["Ты можешь сделать это лучше. Твои навыки требуют более тщательной проработки. Разберись с проблемными моментами и постарайся предоставить более качественные результаты.", 2, 2],
];


function getRandomPhrase(number, phrases) {
  // Фильтруем фразы, оставляя только те, которые соответствуют диапазону
  const validPhrases = phrases.filter(phrase => {
    const [text, min, max] = phrase;
    if (min <= max) {
      return number >= min && number <= max;
    } else {
      return number >= max && number <= min;
    }
  });

  // Если есть подходящие фразы, выбираем случайную из них
  if (validPhrases.length > 0) {
    const randomIndex = Math.floor(Math.random() * validPhrases.length);
    return validPhrases[randomIndex][0];
  } else {
    // Если нет подходящих фраз, возвращаем null или любое другое значение по умолчанию
    return null;
  }
}

function updateComments() {

  // Найти все элементы <div> с классом "hw-md_item ng-scope"
  const divElements = [...document.querySelectorAll('div.hw-md_item.ng-scope'), ...document.querySelectorAll('.hw-md_single__content')];
  // Пройти по каждому элементу
  divElements.forEach((divElement, index) => {
    // Найти <md-radio-group> внутри текущего элемента
    const radioGroup = divElement.querySelector('md-radio-group.hw-md_single__select-mark');

    // Найти все <md-radio-button> внутри <md-radio-group>
    const radioButtons = radioGroup.querySelectorAll('md-radio-button');

    // Найти <textarea> и пометить их
    const textareaElement = divElement.querySelector('textarea.hw-md_single_teacher__comment');
    textareaElement.placeholder ? true : textareaElement.placeholder = "Поле для комментирования успешно обнаружено плагином.";

    // Проверка, выбрана ли какая-то кнопка
    const selectedRadioButton = radioGroup.querySelector('md-radio-button.md-checked');
    if (selectedRadioButton) {
      const selectedValue = selectedRadioButton.getAttribute('value');

      // Обновить его значение
       textareaElement.value ? true : textareaElement.value = getRandomPhrase(buttonValue, phrases);
    }

  });
}

// Корректировка фраз под ламинат/паркет
function formatPhrase(phrase, gender) {
  let result = `${phrase}`;

  if (gender === "m") {
    // Удаляем {} с их содержимым
    result = result.replace(/\{[^}]*\}/g, "");
    // Удаляем "[" и "]"
    result = result.replace(/[\[\]]/g, "");
  } else if (gender === "w") {
    // Удаляем [] с их содержимым
    result = result.replace(/\[[^\]]*\]/g, "");
    // Удаляем "{" и "}"
    result = result.replace(/[{}]/g, "");
  }

  return result;
}

//Проверка на ламинат или паркет
function IsMan(fullName) {
  // Убираем лишние пробелы и разбиваем на слова
  const words = `${fullName}`.trim().split(/\s+/);
  let result;

  if (words.length > 0 && words.length <= 2) {
    // Если слов +-1, записываем последнюю букву первого слова в переменную
    result = words[0] ? words[0].slice(-1) : null;
  } else if (words.length > 2) {
    // Если слов > 1, записываем последнюю букву последнего слова в переменную
    result = words[words.length - 1].slice(-1);
  } else {
    // Если ошибка, записываем null в переменную
    result = null;
  }

  // Проверяем, есть ли буква в массиве букв ["а", "я"]
  if (result && ["а", "я"].includes(result.toLowerCase())) {
    return "w";
  } else {
    return "m";
  }
}

// Добавить обработчик событий для делегирования кликов на дочерние кнопки
document.addEventListener('click', function(event) {
  const target = event.target;

  // Проверить, является ли целью клика элемент <md-radio-button>
  if (target.matches('md-radio-button')) {
    // Получить значение кнопки
    buttonValue = target.getAttribute('value');

    // Найти соответствующий <textarea> и обновить его значение
      if (target.closest('div.hw-md_item.ng-scope') !== null){
          var parentDiv = target.closest('div.hw-md_item.ng-scope');
          var StudentName = (target.closest('.hw-md_item.ng-scope')).querySelector('span.bold.ng-binding').textContent;
      } else {
          parentDiv = target.closest('.hw-md_single__content');
          StudentName = (target.closest('.hw-md_single__content')).querySelector('span.bold.ng-binding').textContent;
      }


    if (parentDiv) {
      const textareaElement = parentDiv.querySelector('textarea.hw-md_single_teacher__comment');
      var Phrase = getRandomPhrase(buttonValue, phrases);
      textareaElement.value = formatPhrase(Phrase, IsMan(StudentName));
    }
  }
});

// ========== OMNI IMAGE PREVIEW ==========


var basicPreviewHeight=50;//in px (Deafult = 140)
var CurrentHomeworks=null;
function SendPacket(URL, Type, JSONVals){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(Type, URL);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        xhr.onerror = () => reject(xhr.statusText);

        if (JSONVals!==null) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            const requestBody = JSON.parse(JSONVals);
            xhr.send(JSON.stringify(requestBody));
        } else {
            xhr.send();
        }

    });

}


function IsHomeWorksOpened(){
    return document.querySelectorAll(".md-dialog-container.home_work_modal").length >= 1 //Применить скрипт если окно открылось
}



function ShowImageIfAvaiable(){
    SendPacket("https://omni.top-academy.ru/homework/get-new-homeworks", "POST", null).then(data => {
        //Изменить переменную чтобы не вызывать этот метод каждые 200мс

        CurrentHomeworks=0;
        data = JSON.parse(data);
        //Скрипт будет работать корректно только если все дз есть в списке
        if (document.querySelectorAll(".hw-md_stud-work__btns-more button").length === 2){
            document.querySelectorAll(".hw-md_stud-work__btns-more button")[1].click()
        }
        //Создание нужных стилей и элементов страницы
        var FullscreenView = document.createElement('div');
        FullscreenView.innerHTML=`
<style>
img#FullscreenImg { max-width: 100%; max-height: 100%; height: 80% !important; object-fit: cover; transition: all 1s;transform: translate(-50%, -50%);left: 50%;top: 50%;position: relative;height: auto;border-radius: 20px;z-index: 9000;display: block;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}
img#FullscreenImg:hover { height: 97% !important; }
.imgActiveImage{ transition: all 1s; border-radius: 20px; width: 100%; max-height: `+basicPreviewHeight+`px; object-fit: cover; cursor: pointer; }
.imgActiveImage:hover{ max-height: `+(basicPreviewHeight*1.5)+`px; }
div#FullscreenView {width: 100%; height: 0%; background: #252525de; position: absolute; transition: all .6s; top: 0px; z-index: 102;display: none; }
</style>
            <div id="FullscreenView" onClick="document.getElementById('FullscreenView').style.height='0%'; setTimeout(function() {document.getElementById('FullscreenView').style.display='none'}, 510);">
                <img id="FullscreenImg">
            </div>`;
        //Создание css для всех элементов
        document.querySelector("body").after(FullscreenView);

        CurrentHomeworks=data.homework.reverse();
        const downloadUrls = CurrentHomeworks.map(obj => obj.download_url_stud);
        const PreviewPlaces = document.querySelectorAll(".hw-md_single_stud-work__outer")
        window.Open = function (URL) {
            document.getElementById('FullscreenImg').src = URL;
        };
        for (var i=0; i < CurrentHomeworks.length; i++){
            var ImgPreviewDiv = document.createElement('div');
            ImgPreviewDiv.innerHTML=(`
            <img class='imgActiveImage' id='IMGPrev`+i+`'src='`+downloadUrls[i]+`'onError="document.getElementById('IMGPrev`+i+`').style.display='none'" id="ActiveImage" style="border-radius:20px; width:100%; cursor:pointer;" onClick="document.getElementById('FullscreenView').style.display='block'; setTimeout(function() {document.getElementById('FullscreenView').style.height='100%'}, 10); document.getElementById('FullscreenImg').src='`+downloadUrls[i]+`';">`);
            PreviewPlaces[i].after(ImgPreviewDiv);
        }

        //Изменить переменную чтобы
        CurrentHomeworks=null;
    })
}

function ProcessLoad(){
    // Запуск функций
    setInterval(updateComments, 1000);

    if(IsHomeWorksOpened() & CurrentHomeworks===null){
        setTimeout(ShowImageIfAvaiable, 1000)
    } else {setTimeout(ProcessLoad, 1000)}

}

(function() {
    ProcessLoad()
})();
