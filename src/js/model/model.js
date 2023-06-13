// @ts-ignore
import axios from 'axios';
import _ from 'lodash';
import { Guid } from 'js-guid';
import { setHandlesForFeedList } from '../controller/controller.js';
import { setMessage, setError } from './message.js';
import { tr } from '../locale/locale.js';
import { setState } from './uistate.js';
import {cleanFeedsList, cleanPostsList, genFeedsListHTML, genPostsListHTML } from '../view/feedsandposts.js';
 
const rssCheckPeriod = 4900;

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

const getItemElementByTagName = (item, name, index = 0) => item.getElementsByTagName(name)[index];

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
      return this.posts.map((post) => post.href);
    },
  };
  const doc = parser.parseFromString(contents, 'application/xml');
  const channel = getItemElementByTagName(doc, 'channel');
  feed.guid = Guid.newGuid().toString();
  feed.title = getItemElementByTagName(channel, 'title').textContent;
  feed.descr = getItemElementByTagName(channel, 'description').textContent;
  const postItems = channel.getElementsByTagName('item');
  for (const item of postItems) {
    feed.posts.push({
      guid: Guid.newGuid().toString(),
      feed_guid: feed.guid,
      title: getItemElementByTagName(item, 'title').textContent,
      descr: parseDescription(parser, getItemElementByTagName(item, 'description')),
      href: getItemElementByTagName(item, 'link').textContent,
    });
  }
  return feed;
};

/**
 * Чтение данных потока и парсинг
 * @param {string} url интернет-адрес потока
 * @returns {Promise} распарсенный поток или ошибка
 */
const getFeed = (url) => new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: rss.proxy
      ? `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`
      : url,
    responseType: 'json',
  })
    .then((result) => {
      if (result.data.contents.includes('<?xml')) {
        const feed = parseRSSFeed(url, result.data.contents);
        resolve(feed);
      } else {
        // ресурс не содержит RSS-контент
        console.log(result.data.contents);
        throw new Error(tr('valid_address'));
      }
    })
    .catch((error) => {
      reject(error);
    });
});

/**
 * Отслеживание обновлений постов для добавленных rss-потоков
 * @param {array} feeds список потоков
 * @param {number} index  номер текущего потока
 * @param {number} currFeed номер потока, посты которого отображаются на странице
 */
const checkFeedsState = (feeds, index, currFeed) => {
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
        for (const post of newPosts) {
          feed.posts.push(post);
          setState(feed.guid, post.guid);
        }
        if (index === currFeed) {
          // обновим список постов
          genPostsListHTML(newPosts, 'afterbegin');
        }
      } else {
        console.log(feed.title, `: ${tr('nothing_new')}`);
      }
      checkFeedsState(feeds, index + 1, currFeed);
    })
    .catch((error) => {
      console.log(error.message);
      checkFeedsState(feeds, index + 1, currFeed);
    });
};

/**
 * Функция запускает проверку добаленных потоков на предмет новых постов
 * @param {number} timeOut задержка в милисекундах
 */
const timerFeedsCheck = (timeOut = rssCheckPeriod) => {
  setTimeout(() => checkFeedsState(rss.feeds, 0, rss.currFeed), timeOut);
};

/**
 * Парсинг описания поста, если описание содержит элементы разметки
 * или просто возврат содержимого описания в противном случае
 * @param {DOMParser} parser
 * @param {string} description описание поста
 * @returns текстовую часть описания
 */
const parseDescription = (parser, description) => {
  const doc = parser.parseFromString(description.textContent, 'text/html');
  const items = doc.getElementsByTagName('p');
  if (items.length === 0) {
    return doc.body.textContent;
  }
  return items[0].textContent;
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
      rss.feeds.push(feed);
      rss.currFeed = rss.feeds.length - 1;
      feed.posts.forEach((post) => setState(feed.guid, post.guid));
      cleanFeedsList();
      genFeedsListHTML(rss.feeds);
      cleanPostsList();
      genPostsListHTML(feed.posts);
      setHandlesForFeedList();
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

export { rss, addRSSFeed, timerFeedsCheck };
