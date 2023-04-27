// Import our custom CSS
import '../scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import { handleFormSubmit, setWatcher } from './controller.js';

// init();
const form = document.getElementById('rss-form');
form?.addEventListener('submit', handleFormSubmit);
setWatcher();
