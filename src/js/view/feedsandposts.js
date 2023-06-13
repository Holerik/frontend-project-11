// @ts-ignore
import { getFeedList, getPostList } from './feedsView.js';

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
 * @param {string} position куда делать вставку
 */
const genPostsListHTML = (posts, position = 'beforeend') => {
  const postListElem = document.getElementById('post-list');
  postListElem?.insertAdjacentHTML(position, getPostList(posts));
};

/**
 * Очистка списка постов перед изменением текущего фида
 */
const cleanPostsList = () => {
  const postList = document.getElementById('post-list');
  while (postList?.firstChild) {
    postList.removeChild(postList.firstChild);
  }
};

/**
 * Очистка списка фидов
 */
const cleanFeedsList = () => {
  const feedList = document.getElementById('feed-list');
  while (feedList?.firstChild) {
    feedList.removeChild(feedList.firstChild);
  }
};

export {
  genFeedsListHTML,
  genPostsListHTML,
  cleanFeedsList,
  cleanPostsList,
};
