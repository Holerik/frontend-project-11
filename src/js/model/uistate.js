// @ts-ignore
import _ from 'lodash';
/**
 * Описывает состояние постов в потоке
 * прочитанный - true, непрочитанный - false
 * Описание поста
 * const post = {
 *  guid: 'postGuidId',
 *  state: false | true,
 * }
 * Описание потока
 * const feed = {
 *  guid: 'feedGuidId',
 *  posts: [],
 * }
 * feeds: [] - массив для потоков
 */
const uiState = {
  feeds: [],
  addFeed(feedGuid) {
    const feed = { guid: feedGuid, posts: [] };
    this.feeds.push(feed);
    return feed;
  },
  getFeed(feedGuid) {
    const feed = _.find(this.feeds, (item) => item.guid === feedGuid);
    if (feed === undefined) {
      return this.addFeed(feedGuid);
    }
    return feed;
  },
  addPost(feedGuid, postGuid) {
    const feed = this.getFeed(feedGuid);
    const post = { guid: postGuid, state: false };
    feed.posts.push(post);
    return post;
  },
  getPost(feedGuid, postGuid) {
    const feed = this.getFeed(feedGuid);
    const post = _.find(feed.posts, (item) => item.guid === postGuid);
    if (post === undefined) {
      return this.addPost(feedGuid, postGuid);
    }
    return post;
  },
  getState(feedGuid, postGuid) {
    const post = this.getPost(feedGuid, postGuid);
    return post.state;
  },
  setState(feedGuid, postGuid, state) {
    const post = this.getPost(feedGuid, postGuid);
    post.state = state;
  },
};

const getState = (feedGuid, postGuid) => uiState.getState(feedGuid, postGuid);
const setState = (feedGuid, postGuid, state = false) => uiState.setState(feedGuid, postGuid, state);

export { getState, setState };
