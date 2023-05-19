// @ts-check
import  '../../css/styles.css';
import onChange from 'on-change';
import { urlSchema, urlsSchema } from '../model/schemes.js';
import { getErrDescrs, rss, setError, getErrors, addRSSFeed } from '../model/model.js';
import { tr } from '../locale/locale.js';

// контролируемый 'вотчером' объект
const state = {
  [`url-input`]: {
    value: '',
  },
  ['proxy-check'] : {
    proxy: true,
  }
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
    const temp = rss.urls;
    // добавим в список RSS-потоков новый фид
    temp.push(result.url);
    // проверим поток на дублирование
    urlsSchema.validate({ urls: temp }, { abortEarly: false})
    // @ts-ignore
    .then(() => 
      // список RSS-потоков пополнился новым фидом
      addRSSFeed(result.url)
    )
    .catch((reason) => setError(key, reason.inner[0].errors[0]));
  })
  .catch((reason) => setError(key, reason.inner[0].errors[0]));
}

const watchedState = onChange(state, (path, value, prevValue) => {
  const key = path.slice(0, path.indexOf('.'));
  if (path === 'url-input.value') {
    // @ts-ignore
    if (value.length === 0) {
      removeErrorMessages(key);
      setError(key, tr('not_empty'));
      setMessage(key);
    } else {
      validateValue(key, value);
    }
  } else if (path === 'proxy-check.proxy') {
    // @ts-ignore
    rss.proxy = value;
  }
});

const setWatcher = () => {
  const input = document.getElementById('url-input');
  input?.addEventListener('change', (evt) => {
    // @ts-ignore
    const value = evt.target?.value;
    watchedState['url-input'].value = value;
  });
  const check = document.getElementById('proxy-check');
  check?.addEventListener('change', (evt) => {
    // @ts-ignore
    const value = evt.target?.checked;
    watchedState['proxy-check'].proxy = value > 0;
    watchedState['url-input'].value = '';
  })
}

const setMessage = (key, error = true) => {
  const ctrl = document.getElementById(key);
  const p = document.createElement('p');
  p.classList.add(
    error ? 'text-warning' : 'text-success',
    'feedback' ,
    'm-0',
    'position-absolute',
    'small'
  );
  p.textContent = getErrors()[key];
  // добавим текущее сообщение об ошибке для элемента
  const div = document.getElementById(getErrDescrs()[key]);
  div?.appendChild(p);
  if (error) {
    // нарисуем красную рамку вокруг элемента
    ctrl?.classList.add('border-red');
  }
}

const handleFormSubmit = (evt) => {
  evt.preventDefault();
  // обработаем сообщения об ошибках, если есть
  const keys = Object.keys(getErrors());
  let isError = false;
  keys.forEach((key) => {
    removeErrorMessages(key);
    if (getErrors()[key].length > 0) {
      if (getErrors()[key] === tr('success')) {
        // загрузка канала прошла успешно
        // сразу после чего была попытка загрузить его снова
        // событие onChange при этом не инициируется, поэтому
        // подобный случай обработаем здесь
        setError(key, tr('url_present'));
      }
      setMessage(key);
      isError = true;
    }
  });
  if (!isError) {
    const ctrl = document.getElementById('url-input');
    // @ts-ignore
    if (ctrl.value.length > 0) {
      // ошибок нет, уберем красную рамку
      // и очистим поле ввода
      // @ts-ignore
      ctrl.value = '';
      ctrl?.classList.remove('border-red');
      ctrl?.focus();
    } else {
      // строка ввода url канала - пустая
      setError('url-input', tr('not_empty'));
      setMessage('url-input');
    }
  }
}

export { handleFormSubmit, setWatcher, setMessage };
