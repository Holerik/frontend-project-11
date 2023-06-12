// @ts-check

import i18next from 'i18next';
import langDetector from 'i18next-browser-languagedetector';
import ru from '../../json/ru.json';
import en from '../../json/en.json';

const ns = 'translation';

export default () => {
  i18next
    .use(langDetector)
    .init({
      resources: {},
    });

  i18next.addResources(
    `${i18next.language.slice(0, 2)}`,
    ns,
    i18next.language.slice(0, 2) === 'ru' ? ru : en,
  );
};

const tr = (key) => i18next.t(key);

const setLang = (lang) => {
  i18next.changeLanguage(lang);
  if (i18next.getResource(lang, ns, 'test_message') === 'test_message') {
    i18next.addResources(
      lang,
      ns,
      lang === 'ru' ? ru : en,
    );
  }
};

export { tr, setLang };
