// @ts-ignore

// сообщения об ошибках для елемента
const errors = {};

// описание блока с ошибкой для элемента
const getErrDescrs = () => ({
  ['url-input']: 'url-error',
});

const setError = (key, error) => {
  errors[key] = error;
};

const getErrors = () => errors;

const setMessage = (key, error = true) => {
  const ctrl = document.getElementById(key);
  const p = document.createElement('p');
  p.classList.add(
    error ? 'text-warning' : 'text-success',
    'feedback',
    'm-0',
    'position-absolute',
    'small',
  );
  p.textContent = getErrors()[key];
  // добавим текущее сообщение об ошибке для элемента
  const div = document.getElementById(getErrDescrs()[key]);
  div?.appendChild(p);
  if (error) {
    // нарисуем красную рамку вокруг элемента
    ctrl?.classList.add('border-red');
  }
};

const removeErrorMessages = (key) => {
  const div = document.getElementById(getErrDescrs()[key]);
  // удалим предыдущие сообщения об ошибке для элемента формы
  while (div?.firstChild) {
    div.removeChild(div.firstChild);
  }
};

export {
  setMessage,
  setError,
  getErrDescrs,
  getErrors,
  removeErrorMessages
};
