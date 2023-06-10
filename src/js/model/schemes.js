// @ts-check
import * as yup from 'yup';
import initLang, {tr} from '../locale/locale.js';

initLang();

yup.addMethod(yup.array, 'unique', function(message) {
  return this.test('unique', message, function(list) {
    const mapper = (x) => (x);
    const set = [...new Set(list?.map(mapper))];
    const isUnique = list?.length === set.length;
    if (isUnique) {
      return true;
    }
    const idx = list?.findIndex((l, i) => mapper(l) !== set[i]);
    return this.createError({ path: `urls[${idx}]`, message });
  });
});

function addMetod(mehtodName, testStr) {
  yup.addMethod(yup.string, mehtodName, function(message) {
    return this.test(mehtodName, message, function(url) {
      if (url?.includes(testStr)) {
        return true;
      }
      return this.createError({ path: url, message });
    })
  });
};

addMetod('https', 'https');

const urlSchema = yup.object().shape({
  url: yup.string()
  .url(tr('valid_url'))
  // @ts-ignore
  .https(tr('abs_address'))
  .required(),
});

const urlsSchema = yup.object().shape({
  urls: yup.array()
  .of(yup.string())
  .required()
  // @ts-ignore
  .unique(tr('url_present')),
});

export { urlSchema, urlsSchema, addMetod };
