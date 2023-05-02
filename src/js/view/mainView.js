// @ts-check
import { tr } from '../locale/locale.js';

const mainView = () => (
  `
  <main class="flex-grow-1" id="main">
  <section class="container-fluid bg-dark p-5">
    <div class="row">
      <div class="col-md-10 col-lg-8 mx-auto text-white rss" id="rss-container">
        <h1 class="display-3 mb-0" id="rss-header">RSS ${tr('aggregator')}</h1>
        <p class="lead" id="rss-prompt">${tr('prompt')}</p>
        <form action="" class="rss-form text-body" id="rss-form" novalidate>
          <div class="row">
            <div class="col">
              <div class="form-floating">
                <input id="url-input" autofocus required name="url"
                  aria-label="url" class="form-control" placeholder="${tr('link')} RSS" autocomplete="off" required>
                <label for="url-input">${tr('link')} RSS</label>
              </div>
            </div>
            <div class="col-auto">
              <button type="submit" class="btn btn-primary h-100 btn-lg px-sm-5" aria-label="add" id="submit">
                ${tr('add')}
              </button>
            </div>
          </div>
        </form>
        <p class="mt-2 mb-0 text-muted">${tr('example')}: https://ru.hexlet.io/lessons.rss</p>
        <div id="url-error"></div>
      </div>
    </div>
  </section>
  <section class="container-fluid container-xxl p-5" id="feed-container"></section>
  </main>
  `
);

export default mainView;
