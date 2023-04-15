// @ts-check

export default class Element {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.textContent = 'Hello, Bootstrap and Webpack!';
    console.log('ehu!');
  }
}
