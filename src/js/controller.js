// @ts-check
import '../css/styles.css';
import onChange from 'on-change';
import { urlSchema, urlsSchema, httpsSchema, rssSchema } from './schemes.js';
import { getErrDescrs, rss, setError, getErrors } from './model.js';

// контролируемый 'вотчером' объект
const state = {
  [`url-input`]: {
    value: '',
  },
};

const validateValue = (key, value) => {
  setError(key, '');
  urlSchema.validate({ url: value }, { abortEarly: false })
  .then((result) => {
    httpsSchema.validate( { url: result.url}, { abortEarly: false})
    .then((result) => {
      rssSchema.validate( { url: result.url}, { abortEarly: false})
      .then((result) => {
        const temp = rss.feeds;
        // добавим в RSS-список новый фид
        temp.push(result.url);
        // проверим поток на дублирование
        urlsSchema.validate({ urls: temp }, { abortEarly: false})
        // @ts-ignore
        .then((result) => {
          // RSS-список пополнился новым фидом 
          rss.feeds = result.urls;
        })
        .catch((reason) => setError(key, reason.inner[0].errors[0]));
      })
      .catch((reason) => setError(key, reason.inner[0].errors[0]));
    })
    .catch((reason) => setError(key, reason.inner[0].errors[0]));
  })
  .catch(() => setError(key, 'RSS-фид должен соответствовать спецификации URL'));
}

const watchedState = onChange(state, (path, value, prevValue) => {
  const key = path.slice(0, path.indexOf('.'));
  validateValue(key, value);
});

const setWatcher = () => {
  const input = document.getElementById('url-input');
  input?.addEventListener('change', (evt) => {
    // @ts-ignore
    const value = evt.target?.value;
    watchedState['url-input'].value = value;
  });
}

const handleFormSubmit = (evt) => {
  evt.preventDefault();
  // обработаем сообщения об ошибках, если есть
  const keys = Object.keys(getErrors());
  // @ts-ignore
  keys.forEach((key) => {
    const div = document.getElementById(getErrDescrs()[key]);
    // удалим предыдущие сообщения об ошибке для элемента формы
    while(div?.firstChild) {
      div.removeChild(div.firstChild);
    }
    const ctrl = document.getElementById(key);
    if (getErrors()[key].length > 0) {
      // сформируем сообщение об ошибке  для элемента ctrl
      const p = document.createElement('p');
      p.classList.add('text-warning');
      p.textContent = getErrors()[key];
      // добавим текущее сообщение об ошибке для элемента
      const div = document.getElementById(getErrDescrs()[key]);
      div?.appendChild(p);
      // нарисуем красную рамку вокруг элемента
      ctrl?.classList.add('border-red');
    } else {
      // удалим красную рамку, если она была
      ctrl?.classList.remove('border-red');
      // проинициализируем элемент
      // @ts-ignore
      ctrl.value = '';
      ctrl?.focus();
    }
  });
}

export { handleFormSubmit, setWatcher };
