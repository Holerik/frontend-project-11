// @ts-check
import axios from 'axios';
import { setMessage } from '../controller/controller.js';
import { tr } from '../locale/locale.js';
import { getFeedList, getPostList } from '../view/feedsView.js';
import _ from 'lodash';
import { Guid } from 'js-guid';

const rssCheckPeriod = 5000;

/**
 * Список потоков
 */
const rss = {
  // массив добавленных потоков
  feeds: [],
  // признак использования прокси-сервера
  proxy: true,
  // получение списка адресов добавленных потоков
  get urls() {
    // @ts-ignore
    return this.feeds.map((item) => item.url);
  },
  // номер потока, посты которого отображаются на странице
  currFeed: 0,
};

/**
 * Отслеживание обновлений постов для добавленных rss-потоков
 * @param {array} feeds список потоков
 * @param {number} index  номер текущего потока
 * @param {number} currFeed номер потока, посты которого отображаются на странице
 */
const checkFeedsState = (feeds, index, currFeed) =>
{
  if (index === feeds.length) {
    timerFeedsCheck();
    return;
  }
  const feed = feeds[index];
  // url-список постов фида
  const oldUrls = feed.urls;
  getFeed(feed.url)
  .then((result) => {
    // обновленый url-список постов фида
    const newUrls = result.urls;
    const diffUrls = _.difference(newUrls, oldUrls);
    if (diffUrls.length > 0) {
      // список новых постов фида
      const newPosts = result.posts.filter((post) => diffUrls.indexOf(post.href) > -1);
      feed.posts.push(newPosts);
      console.log(feed.title, `:  ${newPosts.length} новых постов`);
      if (index === currFeed) {
        // обновим список постов
        genPostsListHTML(newPosts);
      }
    } else {
      console.log(feed.title, ':  новых постов нет');
    }
    checkFeedsState(feeds, index + 1, currFeed);
  })
  .catch((error) => {
    console.log(error.message);
    checkFeedsState(feeds, index + 1, currFeed);
  });
}

// сообщения об ошибках для елемента
const errors = {
  ['url-input']: '',
};

// описание блока с ошибкой для элемента
const errDescrs = {
  ['url-input']: 'url-error',
};

const getErrDescrs = () => errDescrs;

const setError = (key, error) => {
  errors[key] = error;
};

const getErrors = () => errors;

const getItemElementByTagName = (item, name, index = 0) => item.getElementsByTagName(name)[index];

/**
 * Генерация HTML-списка добавленных постов
 * @param {Array} feeds список постов
 */
const genFeedsListHTML = (feeds) => {
  const feedListElem = document.getElementById('feed-list');
  feedListElem?.insertAdjacentHTML('beforeend', getFeedList(feeds));
};

/**
 * Генерация HTML-списка постов потока
 * @param {Array} posts список постов потока
 */
const genPostsListHTML = (posts) => {
  const postListElem = document.getElementById('post-list');
  postListElem?.insertAdjacentHTML('beforeend', getPostList(posts));
};

/**
 * Очистка списка постов перед изменением текущего фида
 */
const cleanPostsList = () => {
  const postList = document.getElementById('post-list');
  while(postList?.firstChild) {
    postList.removeChild(postList.firstChild);
  }
};

/**
 * 
 * @param {string} url адрес фида
 * @param {string} contents содержимое фида
 * @returns {feed} сущность типа feed
 */
const parseRSSFeed = (url, contents) => {
  const parser = new DOMParser();
  // параметры добавляемого потока
  const feed = {
    guid: Guid.EMPTY,
    url,
    title: '',
    descr: '',
    posts: [],
    get urls() {
      // @ts-ignore
      return this.posts.map((post) => post.href);
    },
  };
  const doc = parser.parseFromString(contents, "application/xml");
  const channel = getItemElementByTagName(doc, 'channel');
  feed.guid = Guid.newGuid().toString();
  feed.title = getItemElementByTagName(channel, 'title').textContent;
  feed.descr = getItemElementByTagName(channel, 'description').textContent;
  const items = channel.getElementsByTagName('item');
  for (const item of items) {
    // добаление постов в поток
    // @ts-ignore
    feed.posts.push({
      guid: Guid.newGuid().toString(),
      feed_giud: feed.guid,
      title: getItemElementByTagName(item, 'title').textContent,
      href: getItemElementByTagName(item, 'link').textContent,
    });
  };
  return feed;
};

/**
 * Чтение данных потока и парсинг
 * @param {string} url интернет-адрес потока
 * @returns {Promise} распарсенный поток или ошибка
 */
const getFeed = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: rss.proxy ?
        `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}` :
        url,
      responseType: 'json',
    })
    .then((result) => {
      // @ts-ignore
      const feed = parseRSSFeed(url, result.data.contents);
      resolve(feed);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

/**
 * Добавление потока в общий список
 * @param {string} url интернет-адрес добавляемого потока
 */
const addRSSFeed = (url) => {
  const key = 'url-input';
  getFeed(url)
  .then((feed) => {
    setError(key, tr('success'));
    setMessage(key, false);
    // @ts-ignore
    rss.feeds.push(feed);
    rss.currFeed = rss.feeds.length - 1;
    genFeedsListHTML(rss.feeds);
    cleanPostsList();
    genPostsListHTML(feed.posts);
    timerFeedsCheck();
  })
  .catch((error) => {
    if (error.response) {
      setError(key, error.response.status);
    } else if (error.request) {
      setError(key, tr('no_response'));
    } else {
      setError(key, error.message);
    }
    setMessage(key);
  }); 
};

/**
 * Функция запускает проверку добаленных потоков на предмет новых постов
 * @param {number} timeOut задержка в милисекундах
 */
const timerFeedsCheck = (timeOut  = rssCheckPeriod) => {
  setTimeout(() => checkFeedsState(rss.feeds, 0, rss.currFeed), timeOut);
};

export { getErrDescrs, rss, setError, getErrors, addRSSFeed, timerFeedsCheck };
