// @ts-ignore

const genModalDialog = (title = 'title', descr = 'description', header = 'Заголовок окна') => (
  `
  <!-- Модальное окно -->
  <div class="modal fade" id="postInfoModal" tabindex="-1" aria-labelledby="postInfoLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal-header">${header}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <p class="text-center fs-5 fst-italic" id="modal-body-title">${title}</p>
          <p class="text-md-start" id="modal-body-descr">${descr}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
  `
);

export default genModalDialog;
