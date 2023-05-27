// Import our custom CSS
import '../scss/styles.scss'
import { handleFormSubmit, setWatcher } from './controller/controller.js';
import { getFeedContainer } from './view/feedsView.js';
import getMainView from './view/mainView.js';
import getFooterView from './view/footerView';
import { timerFeedsCheck } from '../js/model/model.js';

const body = document.getElementById('body');
body.insertAdjacentHTML('afterbegin', getMainView());
const main = document.getElementById('main');
main.insertAdjacentHTML('afterend', getFooterView());
const form = document.getElementById('rss-form');
form?.addEventListener('submit', handleFormSubmit);

const feedContainerElem = document.getElementById('feed-container');
feedContainerElem.insertAdjacentHTML('afterbegin', getFeedContainer());
setWatcher();
timerFeedsCheck();
