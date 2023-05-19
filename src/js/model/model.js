// @ts-check
import axios from 'axios';
import { setMessage } from '../controller/controller.js';
import { tr } from '../locale/locale.js';
import { getFeedList, getPostList } from '../view/feedsView.js';
import _ from 'lodash';
import { Guid } from 'js-guid';

// список RSS-потоков
let urls = [];

const rss = {
  feeds: [],
  proxy: true,
  get urls() {
    // @ts-ignore
    return this.feeds.map((item) => item.url);
  },
};

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

const genFeedsList = (feeds) => {
  const feedListElem = document.getElementById('feed-list');
  feedListElem?.insertAdjacentHTML('afterbegin', getFeedList(feeds));
};

const genPostsList = (posts) => {
  const postListElem = document.getElementById('post-list');
  postListElem?.insertAdjacentHTML('afterbegin', getPostList(posts));
};

const addRSSFeed = (url) => {
  const key = 'url-input';
  const feed = {
    guid: Guid.EMPTY,
    url: '',
    title: '',
    descr: '',
    posts: [],
  };
  axios({
    method: 'get',
    url: rss.proxy ?
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}` :
      url,
    responseType: 'json',
  })
  .then((result) => {
    const parser = new DOMParser();
    setError(key, tr('success'));
    setMessage(key, false);
    const doc = parser.parseFromString(result.data.contents, "application/xml");
    const channel = getItemElementByTagName(doc, 'channel');
    feed.guid = Guid.newGuid().toString();
    feed.url = url;
    feed.title = getItemElementByTagName(channel, 'title').textContent;
    feed.descr = getItemElementByTagName(channel, 'description').textContent;
    const items = channel.getElementsByTagName('item');
    for (const item of items) {
      // @ts-ignore
      feed.posts.push({
        guid: Guid.newGuid().toString(),
        feed_giud: feed.guid,
        title: getItemElementByTagName(item, 'title').textContent,
        href: getItemElementByTagName(item, 'link').textContent,
      });
    };
    // @ts-ignore
    rss.feeds.push(feed);
    genFeedsList(rss.feeds);
    genPostsList(feed.posts);
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

export { getErrDescrs, rss, setError, getErrors, addRSSFeed };
