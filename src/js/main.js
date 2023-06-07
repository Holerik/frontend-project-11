import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import { handleFormSubmit, setWatcher, setModalInfo } from './controller/controller.js';
import { getFeedContainerElements } from './view/feedsView.js';
import getMainView from './view/mainView.js';
import getFooterView from './view/footerView';
import { timerFeedsCheck } from '../js/model/model.js';
import genModalDialog from '../js/view/modalView.js';

const body = document.getElementById('body');
body.insertAdjacentHTML('afterbegin', getMainView());
const main = document.getElementById('main');
main.insertAdjacentHTML('afterend', getFooterView());
const form = document.getElementById('rss-form');
form?.addEventListener('submit', handleFormSubmit);
const modal = document.getElementById('body');
modal?.insertAdjacentHTML('afterbegin', genModalDialog());

const feedContainerElem = document.getElementById('feed-container');
feedContainerElem.insertAdjacentHTML('afterbegin', getFeedContainerElements());
setWatcher();
setModalInfo();
//timerFeedsCheck();
