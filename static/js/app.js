
$(document).ready(function(){

  var song, lines;
  var i = 3;
  var clickLocked = false;

  var addOnClick = function(){
    $(window).click(function(){
      if(!clickLocked) {
        clickLocked = true;
        var $currentLine = $('.current-line');
        var $nextLine = $('.next-line');
        var $nextLine2 = $('.next-line-2');
        var $lyrics = $('#lyrics');
        $currentLine.css('opacity', 0);
        $currentLine.css('font-size', '0px');
        $currentLine.css('height', '0px');
        $nextLine.css('color', '#ffffff');
        $nextLine.css('font-size', '60px');
        $nextLine.css('height', '170px');
        $nextLine2.css('opacity', 1);
        setTimeout(function() {
          $currentLine.remove();
          $nextLine.removeClass('next-line').addClass('current-line');
          $nextLine2.removeClass('next-line-2').addClass('next-line');
          $lyrics.append('<div class="next-line-2"></div>');
          $('.next-line-2').html(song[i]);
          i++;
          clickLocked = false;
        }, 500);
      }
    });
  };

  // load the song
  $.ajax({
    url: 'static/songs/highway-to-hell.txt'
  })
    .done(function(data){
      song = data.split('\n');
      lines = song.length;
      var $currentLine = $('.current-line');
      var $nextLine = $('.next-line');
      var $nextLine2 = $('.next-line-2');
      $currentLine.html(song[0]);
      $nextLine.html(song[1]);
      $nextLine2.html(song[2]);
      addOnClick();
    });

});
