'use strict'

$('.select-button').on('click', function () {
  console.log('IS THIS WORKING!?!?!?!?');
  $(this).next().removeClass('hide-me');
});
