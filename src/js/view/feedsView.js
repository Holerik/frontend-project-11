// @ts-ignore
import { tr } from '../locale/locale.js';
import _ from 'lodash';
import { selectFeed } from '../controller/controller.js';

const genFeedItem = (href, info, id) => (
  `
  <li class="list-group-item border-0 border-end-0 feed-link">
    <a href="#" class="fs-4 fst-italic" data-id=${id}>${info}</a>
  </li>
  `
);

const getFeedList = (feedsList) => {
  let res = ``;
  feedsList.forEach((feed) => {
    res += genFeedItem(feed.url, feed.title, feed.guid);
  });
  return res;
};

const genPostItem = (href, info, guid, read) => (
`
<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
  <a href=${href} class=${read ? "fw-normal" : "fw-bold"} id=${guid} target="_blank" rel="noopener noreferrer">${info}</a>
  <button data-id=${guid} type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#postInfoModal">${tr('viewing')}</button>
</li>
`
);

const getPostList = (postsList) => {
  let res = ``;
  postsList.forEach((post) => {
    res += genPostItem(post.href, post.title, post.guid, post.read);
  });
  return res;
};

const getFeedContainerElements = () => (
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

export { getFeedContainerElements, getFeedList, getPostList };
