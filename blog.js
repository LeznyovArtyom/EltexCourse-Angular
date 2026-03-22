// Отображение формы Добавления статьи
const showAddArticleFormButton = document.getElementById('show-form');
const addArticleCancelButton = document.getElementById('add-article-cancel');
const formWrapper = document.getElementById('formWrapper');

showAddArticleFormButton.addEventListener('click', () => showAddArticleForm(true));
addArticleCancelButton.addEventListener('click', () => showAddArticleForm(false));

function showAddArticleForm(isShow) {
  if (isShow) {
    formWrapper.classList.add('is-open');
  } else {
    formWrapper.classList.remove('is-open');
  }
}

// Добавить статью
const addArticleButton = document.getElementById('add-article');
const articleTitle = document.getElementById('article-title');
const articleText = document.getElementById('article-text');
const articleCardTemplate = document.getElementById('article-card-template');
const articleContainer = document.querySelector('.acrticles-grid');

addArticleButton.addEventListener('click', addArticle);

function addArticle(event) {
  event.preventDefault();

  let title = articleTitle.value;
  let text = articleText.value;

  const templateContent = articleCardTemplate.content;

  const articleCard = templateContent.cloneNode(true);

  const timestamp = Date.now();
  const dataObj = new Date(timestamp);
  const formatter = Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
    year: "numeric"
  });
  const humanDate = formatter.format(dataObj);
  const machineDate = dataObj.toISOString().split('T')[0];

  articleCard.querySelector('.article-content h2').textContent = title;
  const timeElement = articleCard.querySelector('.article-content p:first-of-type time')
  timeElement.textContent = humanDate;
  timeElement.setAttribute('datetime', machineDate);
  articleCard.querySelector('.article-content p:last-of-type').textContent = text;

  articleContainer.appendChild(articleCard);
}


// Модальное окно статистики
const statisticsDialog = document.getElementById('statistics-dialog');
const showStatisticsButton = document.getElementById('show-statistics');

showStatisticsButton.addEventListener('click', showDialog);

function showDialog() {
  statisticsDialog.showModal();

  // Подсчет количества статей
  const articlesCount = document.querySelector('.article-count-container .count');
  const articles = document.querySelectorAll('.article-card');

  articlesCount.textContent = articles.length;
}

// Закрыть модальное окно статистики
const closeDialogButton = document.getElementById('close-dialog');

statisticsDialog.addEventListener('click', closeDialog);
closeDialogButton.addEventListener('click', closeDialog);

function closeDialog(event) {
  if (event.target === statisticsDialog || event.target === closeDialogButton) {
    statisticsDialog.close();
  }
}