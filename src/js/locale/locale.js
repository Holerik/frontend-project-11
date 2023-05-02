// @ts-check

import i18next from 'i18next';
import langDetector from 'i18next-browser-languagedetector';

const ns = 'translation';

export default () => {
  i18next
  .use(langDetector)
  .init({
    resources: {},
  });

  i18next.addResources(
    `${i18next.language.slice(0,2)}`,
    ns,
    require(`../../json/${i18next.language.slice(0,2)}.json`),
  );
};

const tr = (key) => i18next.t(key);

const setLang = (lang) => {
  i18next.changeLanguage(lang);
  if (i18next.getResource(lang, ns, 'test_message') === 'test_message') {
    i18next.addResources(
      lang,
      ns,
      require(`../../json/${lang}.json`),
    );
  }
}

export { tr, setLang };
