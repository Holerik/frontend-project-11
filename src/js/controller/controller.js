// @ts-ignore
import '../../css/styles.css';
import onChange from 'on-change';
import { urlSchema, urlsSchema } from '../model/schemes.js';
import { rss, addRSSFeed } from '../model/model.js';
import { cleanPostsList, genPostsListHTML } from '../view/feedsandposts.js';
import {
  setMessage,
  setError,
  getErrors,
  removeErrorMessages,
} from '../model/message.js';
import { tr } from '../locale/locale.js';
import { setState } from '../model/uistate.js';

const validateValue = (key, value) => {
  setError(key, '');
  urlSchema.validate({ url: value }, { abortEarly: false })
    .then((result) => {
      const temp = rss.urls;
      // добавим в список RSS-потоков новый фид
      temp.push(result.url);
      // проверим поток на дублирование
      urlsSchema.validate({ urls: temp }, { abortEarly: false })
        // список RSS-потоков пополнился новым фидом
        .then(() => addRSSFeed(result.url))
        .catch((reason) => setError(key, reason.inner[0].errors[0]));
    })
    .catch((reason) => setError(key, reason.inner[0].errors[0]));
};

const getInitState = () => ({
  ['url-input']: {
    value: '',
  },
  ['proxy-check']: {
    proxy: true,
  },
});

const watchedState = onChange(
  getInitState(),
  (path, value) => {
    const key = path.slice(0, path.indexOf('.'));
    if (path === 'url-input.value') {
      if (value.length === 0) {
        removeErrorMessages(key);
        setError(key, tr('not_empty'));
        setMessage(key);
      } else {
        validateValue(key, value);
      }
    } else if (path === 'proxy-check.proxy') {
      rss.proxy = value;
    }
  },
);

const setWatcher = () => {
  const input = document.getElementById('url-input');
  input?.addEventListener('change', (evt) => {
    const value = evt.target?.value;
    watchedState['url-input'].value = value;
  });
  const check = document.getElementById('proxy-check');
  check?.addEventListener('change', (evt) => {
    const value = evt.target?.checked;
    watchedState['proxy-check'].proxy = value > 0;
    watchedState['url-input'].value = '';
  });
};

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
    if (ctrl.value.length > 0) {
      // ошибок нет, уберем красную рамку
      // и очистим поле ввода
      ctrl.value = '';
      ctrl?.classList.remove('border-red');
      ctrl?.focus();
    } else {
      // строка ввода url канала - пустая
      setError('url-input', tr('not_empty'));
      setMessage('url-input');
    }
  }
};

const setModalInfo = () => {
  const modalDlg = document.getElementById('postInfoModal');
  modalDlg?.addEventListener('show.bs.modal', (evt) => {
    const guid = evt.relatedTarget.dataset.id;
    const feed = rss.feeds[rss.currFeed];
    const post = feed.posts.filter((item) => item.guid === guid)[0];
    document.getElementById('modal-body-title').textContent = post.title;
    document.getElementById('modal-body-descr').textContent = post.descr;
    document.getElementById('modal-header').textContent = feed.title;
    const elem = document.getElementById(guid);
    if (elem?.classList.contains('fw-bold')) {
      elem?.classList.remove('fw-bold');
      elem?.classList.add('fw-normal');
      setState(feed.guid, post.guid, true);
    }
  });
};

const handleSelectFeed = (evt) => {
  const guid = evt.target.dataset.id;
  const selFeed = rss.feeds.findIndex((feed) => feed.guid === guid);
  if (selFeed !== rss.currFeed) {
    rss.currFeed = selFeed;
    cleanPostsList();
    genPostsListHTML(rss.feeds[rss.currFeed].posts);
  }
};

const setHandlesForFeedList = () => {
  const feedElements = document.getElementsByClassName('feed-link');
  for (const elem of feedElements) {
    elem.addEventListener('click', handleSelectFeed);
  }
};

export {
  handleFormSubmit,
  setWatcher,
  setModalInfo,
  setHandlesForFeedList,
};
