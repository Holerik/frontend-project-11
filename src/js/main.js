// Import our custom CSS
import '../scss/styles.scss'
import { handleFormSubmit, setWatcher } from './controller/controller.js';
import { getFeedContainer, getFeedList, getPostList } from './view/feedsView.js';
import getMainView from './view/mainView.js';
import getFooterView from './view/footerView';

const body = document.getElementById('body');
body.insertAdjacentHTML('afterbegin', getMainView());
const main = document.getElementById('main');
main.insertAdjacentHTML('afterend', getFooterView());
const form = document.getElementById('rss-form');
form?.addEventListener('submit', handleFormSubmit);

const feedContainerElem = document.getElementById('feed-container');
feedContainerElem.insertAdjacentHTML('afterbegin', getFeedContainer());
const postListElem = document.getElementById('post-list');
postListElem.insertAdjacentHTML('afterbegin', getPostList());
const feedListElem = document.getElementById('feed-list');
feedListElem.insertAdjacentHTML('afterbegin', getFeedList());
setWatcher();
