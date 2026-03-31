class Article {
  constructor(id, title, text, machineDate) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.machineDate = machineDate;
  }

  renderArticle() {
    const templateContent = articleCardTemplate.content;
    const articleCard = templateContent.cloneNode(true);

    articleCard.querySelector('.article-card').setAttribute('data-id', this.id);
    articleCard.querySelector('.article-content h2').textContent = this.title;
    const timeElement = articleCard.querySelector('.article-content p:first-of-type time')
    timeElement.textContent = formatToHumanDate(this.machineDate);
    timeElement.setAttribute('datetime', this.machineDate);
    articleCard.querySelector('.article-content p:last-of-type').textContent = this.text;

    articleContainer.appendChild(articleCard);
  }
}

// Загрузка страницы
document.addEventListener('DOMContentLoaded', loadData);

function loadData() {
  const articles = JSON.parse(localStorage.getItem('articles')) || [];
  articles.forEach(article => {
    article = new Article(article.id, article.title, article.text, article.machineDate);
    article.renderArticle();
  });

  updateNoArticleMessageVisibility();
}


// Шаблон статьи и контейнер со статьями
const articleCardTemplate = document.getElementById('article-card-template');
const articleContainer = document.querySelector('.acrticles-grid');


// Отображение формы Добавления статьи
const showAddArticleFormButton = document.getElementById('show-form');
const addArticleCancelButton = document.getElementById('add-article-cancel');
const formWrapper = document.getElementById('formWrapper');
const addArticleForm = document.getElementById('add-article-form');

showAddArticleFormButton.addEventListener('click', () => toggleAddArticleForm(true));
addArticleCancelButton.addEventListener('click', () => toggleAddArticleForm(false));

function toggleAddArticleForm(isShow) {
  if (isShow) {
    formWrapper.classList.add('is-open');
  } else {
    addArticleForm.reset();
    formWrapper.classList.remove('is-open');
  }
}

// Добавить статью
const addArticleButton = document.getElementById('add-article');
const articleTitle = document.getElementById('article-title');
const articleText = document.getElementById('article-text');

addArticleButton.addEventListener('click', addArticle);

function addArticle(event) {
  event.preventDefault();

  let title = articleTitle.value;
  let text = articleText.value;

  const machineDate = getCurrentMachineDate();

  const newArticle = new Article(crypto.randomUUID(), title, text, machineDate);

  const articles = JSON.parse(localStorage.getItem('articles')) || [];
  articles.push(newArticle);
  localStorage.setItem('articles', JSON.stringify(articles));

  newArticle.renderArticle();

  addArticleForm.reset();
  updateNoArticleMessageVisibility();
}

function getCurrentMachineDate() {
  return new Date().toISOString();
}

function formatToHumanDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}


// Удалить статью
articleContainer.addEventListener('click', deleteArticle);

function deleteArticle(event) {
  const deleteButton = event.target.closest('.remove-article');

  if (deleteButton) {
    const article = event.target.closest('.article-card');

    article.classList.add('removing');

    article.addEventListener('animationend', () => {
      let articles = JSON.parse(localStorage.getItem('articles')) || [];
      articles = articles.filter((elem) => elem.id !== article.dataset.id);
      localStorage.setItem('articles', JSON.stringify(articles));

      article.remove();

      updateNoArticleMessageVisibility();
    }, { once: true });
  }
}

// Отображение сообщения при отсутствии статей
const noArticleMessage = document.getElementById('no-article-message');
function updateNoArticleMessageVisibility() {
  const count = getArticlesCount();

  if (!count) {
    noArticleMessage.removeAttribute('hidden');
  } else {
    noArticleMessage.setAttribute('hidden', '');
  }
}

// Подсчет количества статей
function getArticlesCount() {
  const articles = document.querySelectorAll('.acrticles-grid .article-card');
  return articles.length;
}


// Модальное окно статистики
const statisticsDialog = document.getElementById('statistics-dialog');
const showStatisticsButton = document.getElementById('show-statistics');

showStatisticsButton.addEventListener('click', showDialog);

function showDialog() {
  statisticsDialog.showModal();

  // Отображение количества статей
  const articlesCount = document.querySelector('.article-count-container .count');
  articlesCount.textContent = getArticlesCount();
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