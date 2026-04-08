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


class ArticleStore {
  articleList = [];

  getArticles() {
    this.articleList = JSON.parse(localStorage.getItem('articles')) || [];
  }

  addArticle(article) {
    this.articleList.push(article);
    localStorage.setItem('articles', JSON.stringify(this.articleList));
  }

  deleteArticle(articleId) {
    this.articleList = this.articleList.filter(elem => elem.id !== articleId);
    localStorage.setItem('articles', JSON.stringify(this.articleList));
  }

  getArticlesCount() {
    return this.articleList.length;
  }
}

const articleStore = new ArticleStore();


// Загрузка страницы
document.addEventListener('DOMContentLoaded', loadData);

function loadData() {
  articleStore.getArticles();
  setTimeout(() => {
    const loader = document.querySelector('.loader');
    loader.setAttribute('hidden', '');

    articleStore.articleList.forEach(article => {
      article = new Article(article.id, article.title, article.text, article.machineDate);
      article.renderArticle();
    });
    updateNoArticleMessageVisibility();
  }, 3000);
}


// Шаблон статьи и контейнер со статьями
const articleCardTemplate = document.getElementById('article-card-template');
const articleContainer = document.querySelector('.acrticles-grid');


// Отображение формы Добавления статьи
const showAddArticleFormButton = document.getElementById('show-form');
const addArticleCancelButton = document.getElementById('add-article-cancel');
const formWrapper = document.getElementById('formWrapper');
const addArticleForm = document.getElementById('add-article-form');
const addArticleFormFieldset = document.querySelector('#add-article-form fieldset');

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
const articleTitle = document.getElementById('article-title');
const articleText = document.getElementById('article-text');

addArticleForm.addEventListener('submit', addArticle);

function addArticle(event) {
  event.preventDefault();

  toggleDisableFormState();

  let title = articleTitle.value;
  let text = articleText.value;

  const machineDate = getCurrentMachineDate();
  const newArticle = new Article(crypto.randomUUID(), title, text, machineDate);

  setTimeout(() => {
    try {
      articleStore.addArticle(newArticle);

      newArticle.renderArticle();
      updateNoArticleMessageVisibility();

      addArticleForm.reset();
    } catch (error) {
      console.error("Произошла ошибка при добавлении статьи: ", error);
      alert("Не удалось добавить статью");
    } finally {
      toggleDisableFormState();
    }
  }, 2000);
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

function toggleDisableFormState() {
  addArticleFormFieldset.disabled = !addArticleFormFieldset.disabled;
}


// Удалить статью
articleContainer.addEventListener('click', deleteArticle);

function deleteArticle(event) {
  const deleteButton = event.target.closest('.remove-article');

  if (deleteButton) {
    const article = event.target.closest('.article-card');

    article.classList.add('removing');

    article.addEventListener('animationend', () => {
      articleStore.deleteArticle(article.dataset.id);

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
  return articleStore.getArticlesCount();
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