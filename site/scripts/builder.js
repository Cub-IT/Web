$(function () {
    const includes = $('[data-include]');

    $.each(includes, function () {
      const file = './includes/' + $(this).data('include') + '.html';
      $(this).load(file);
    })
})