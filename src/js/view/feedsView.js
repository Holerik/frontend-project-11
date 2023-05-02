// @ts-check
import { tr } from '../locale/locale.js';

const getFeedList = (data) => (
  `
  <li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">Новые уроки на Хекслете</h3>
    <p class="m-0 small text-black-50">Практические уроки по программированию</p>
  </li>
  `
);

const getPostList = (data) => (
  `
  <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
    <a href="#" class="fw-normal link-secondary" data-id="2" target="_blank" rel="noopener noreferrer">Группировка по выборке / Основы SQL</a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">${tr('viewing')}</button>
  </li>
  <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
    <a href="#" class="fw-normal link-secondary" data-id="3" target="_blank" rel="noopener noreferrer">Уникальные строки / Основы SQL</a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-id="3" data-bs-toggle="modal" data-bs-target="#modal">${tr('viewing')}</button>
  </li>
  `
);

const getFeedContainer = () => (
  `
  <div class="row">
    <div class="col-md-10 col-lg-8 order-1 mx-auto posts">
      <div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">${tr('posts')}</h2>
        </div>
        <ul class="list-group border-0 rounded-0" id="post-list"></ul>
        <div class="card-body">
          <h2 class="card-title h4">${tr('feeds')}</h2>
        </div>
        <ul class="list-group border-0 rounded-0" id="feed-list">
        </ul>
      </div>
    </div>
  </div>
  `
);

export { getFeedContainer, getFeedList, getPostList };

