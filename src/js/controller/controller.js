// @ts-check
import  '../../css/styles.css';
import onChange from 'on-change';
import { urlSchema, urlsSchema } from '../model/schemes.js';
import { getErrDescrs, rss, setError, getErrors } from '../model/model.js';
import { tr } from '../locale/locale.js';

// контролируемый 'вотчером' объект
const state = {
  [`url-input`]: {
    value: '',
  },
};

const removeErrorMessages = (key) => {
  const div = document.getElementById(getErrDescrs()[key]);
  // удалим предыдущие сообщения об ошибке для элемента формы
  while(div?.firstChild) {
    div.removeChild(div.firstChild);
  }
}

const validateValue = (key, value) => {
  setError(key, '');
  urlSchema.validate({ url: value }, { abortEarly: false })
  .then((result) => {
    const temp = rss.feeds;
    // добавим в список RSS-потоков новый фид
    temp.push(result.url);
    // проверим поток на дублирование
    urlsSchema.validate({ urls: temp }, { abortEarly: false})
    // @ts-ignore
    .then((result) => {
      // список RSS-потоковк пополнился новым фидом
      rss.feeds = result.urls;
    })
    .catch((reason) => setError(key, reason.inner[0].errors[0]));
  })
  .catch((reason) => setError(key, reason.inner[0].errors[0]));
}

const watchedState = onChange(state, (path, value, prevValue) => {
  const key = path.slice(0, path.indexOf('.'));
  // @ts-ignore
  if (value.length === 0) {
    removeErrorMessages(key);
    setError(key, tr('not_empty'));
    setErrorMessage(key);
  } else {
    validateValue(key, value);
  }
});

const setWatcher = () => {
  const input = document.getElementById('url-input');
  input?.addEventListener('change', (evt) => {
    // @ts-ignore
    const value = evt.target?.value;
    watchedState['url-input'].value = value;
  });
}

const setErrorMessage = (key) => {
  const ctrl = document.getElementById(key);
  const p = document.createElement('p');
  p.classList.add('text-warning', 'feedback' , 'm-0', 'position-absolute', 'small');
  p.textContent = getErrors()[key];
  // добавим текущее сообщение об ошибке для элемента
  const div = document.getElementById(getErrDescrs()[key]);
  div?.appendChild(p);
  // нарисуем красную рамку вокруг элемента
  ctrl?.classList.add('border-red');
};

const handleFormSubmit = (evt) => {
  evt.preventDefault();
  // обработаем сообщения об ошибках, если есть
  const keys = Object.keys(getErrors());
  let isError = false;
  keys.forEach((key) => {
    removeErrorMessages(key);
    if (getErrors()[key].length > 0) {
      setErrorMessage(key);
      isError = true;
    }
  });
  if (!isError) {
    const ctrl = document.getElementById('url-input');
    // @ts-ignore
    if (ctrl.value.length > 0) {
      // @ts-ignore
      ctrl.value = '';
      ctrl?.classList.remove('border-red');
      ctrl?.focus();
    } else {
      setError('url-input', tr('not_empty'));
      setErrorMessage('url-input');
    }
  }
}

export { handleFormSubmit, setWatcher };
