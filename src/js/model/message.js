//@ts-ignore

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

const setMessage = (key, error = true) => {
  const ctrl = document.getElementById(key);
  const p = document.createElement('p');
  p.classList.add(
    error ? 'text-warning' : 'text-success',
    'feedback' ,
    'm-0',
    'position-absolute',
    'small'
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

export { setMessage, setError, getErrDescrs, getErrors };
