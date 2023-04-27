// @ts-check
import * as yup from 'yup';

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

yup.addMethod(yup.string, 'https', function(message) {
  return this.test('https', message, function(url) {
    if (url?.includes('https')) {
      return true;
    }
    return this.createError({ path: url, message });
  })
});

yup.addMethod(yup.string, 'rss', function(message) {
  return this.test('rss', message, function(url) {
    if (url?.endsWith('.rss')) {
      return true;
    }
    return this.createError({ path: url, message });
  })
});

const urlSchema = yup.object({
  url: yup.string()
  .url()
  .required(),
});

const urlsSchema = yup.object().shape({
  urls: yup.array()
  .of(yup.string())
  .required()
  // @ts-ignore
  .unique('RSS-фид c таким URL уже существует'),
});

const httpsSchema = yup.object().shape({
  url: yup.string()
  // @ts-ignore
  .https('Требуется абсолютный адрес: см. пример'),
});

const rssSchema = yup.object().shape({
  url: yup.string()
  // @ts-ignore
  .rss('Адрес должен указывать на rss-pecypc'),
});

export { urlSchema, urlsSchema, httpsSchema, rssSchema };
