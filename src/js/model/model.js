// @ts-check
// список RSS-потоков
let urls = [];

const rss = {
  urls: [],
  get feeds() {
    return urls.slice();
  },
  set feeds(data) {
    urls = data.slice();
  },
  get length() {
    return urls.length;
  }
};

// сообщения об ошибках для елемента
const errors = {
  ['url-input']: '',
};

// описание блока с ошибкой для элемента
const errDescrs = {
  ['url-input']: 'url-error',
};

const getErrDescrs = () => errDescrs;

const setError = (key, error) => {
  errors[key] = error;
};

const getErrors = () => errors;

export { getErrDescrs, rss, setError, getErrors };
