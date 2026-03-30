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
const articleCardTemplate = document.getElementById('article-card-template');
const articleContainer = document.querySelector('.acrticles-grid');

addArticleButton.addEventListener('click', addArticle);

function addArticle(event) {
  event.preventDefault();

  let title = articleTitle.value;
  let text = articleText.value;

  const templateContent = articleCardTemplate.content;

  const articleCard = templateContent.cloneNode(true);

  const { humanDate, machineDate } = getArticleDate();

  articleCard.querySelector('.article-content h2').textContent = title;
  const timeElement = articleCard.querySelector('.article-content p:first-of-type time')
  timeElement.textContent = humanDate;
  timeElement.setAttribute('datetime', machineDate);
  articleCard.querySelector('.article-content p:last-of-type').textContent = text;

  articleContainer.appendChild(articleCard);

  addArticleForm.reset();
  toggleNoArticleMessage();
}

function getArticleDate() {
  const timestamp = Date.now();
  const dataObj = new Date(timestamp);
  const formatter = Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
    year: "numeric"
  });
  const humanDate = formatter.format(dataObj);
  const machineDate = dataObj.toISOString().split('T')[0];

  return { humanDate, machineDate };
}

// Удалить статью
articleContainer.addEventListener('click', deleteArticle);

function deleteArticle(event) {
  const deleteButton = event.target.closest('.remove-article');

  if (deleteButton) {
    const article = event.target.closest('.article-card');

    article.classList.add('removing');

    article.addEventListener('animationend', () => {
      article.remove();

      toggleNoArticleMessage();
    }, { once: true });
  }
}

// Отображение сообщения при отсутствии статей
const noArticleMessage = document.getElementById('no-article-message');
function toggleNoArticleMessage() {
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

  // Подсчет количества статей
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