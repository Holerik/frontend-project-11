// @ts-check
import { tr } from '../locale/locale.js';

const genFeedItem = (href, info, id) => (
  `
  <li class="list-group-item border-0 border-end-0 feed-link" id="${id}">
    <a href=${href}>${info}</a>
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

const genPostItem = (href, info) => (
`
<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
<p class="fw-normal" data-id="3" target="_blank" rel="noopener noreferrer">${info}</p>
<a href=${href} type="button" class="btn btn-outline-primary btn-sm" data-id="3" data-bs-toggle="modal" data-bs-target="#modal">${tr('viewing')}</a>
</li>
`
);

const getPostList = (postsList) => {
  let res = ``;
  postsList.forEach((post) => {
    res += genPostItem(post.href, post.title);
  });
  return res;
};

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
