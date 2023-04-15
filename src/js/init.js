// @ts-check

import Element from './Element.js';

export default () => {
  const element = document.getElementById('container');
  const obj = new Element(element);
  obj.init();
};
