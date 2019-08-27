$('document').ready(function () {
  $('.footer .footer-content').each(function() {
    $(this).click( function () {
      $('.footer-text', this).toggle(500);
    })
  });
});

