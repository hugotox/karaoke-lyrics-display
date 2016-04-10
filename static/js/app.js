$(document).ready(function(){

  var song, lines;
  var i = 3;
  var locked = false;
  var $index = $('#index');
  var $dynStyle = $('#dyn-style');
  var options;
  var songParam;
  var url;

  var makeTitle = function(text){
    return text.split('-').join(' ');
  };

  var setDynStyle = function(options){
    var style = '' +
      '#background {' +
      '  background: #232323 url("static/img/'+options.images[songParam]+'") no-repeat center;' +
      '  background-size: cover;' +
      '}' +

      '.current-line {' +
      '  font-size: '+options.currentLineFontSize+';' +
      '  text-shadow: 1px 1px 1px #666;' +
      '  color: '+options.currentLineColor+';' +
      '  height: '+options.currentLineHeight+';' +
      '}' +

      '.next-line, .next-line-2 {' +
      '  font-size: '+options.nextLineFontSize+';' +
      '  color: '+options.nextLineColor+';' +
      '  height: '+options.nextLineHeight+';' +
      '}' +

      '.next-line-2 {' +
      '  opacity: 0;' +
      '}' +
      '';
    $dynStyle.html(style);
  };

  var addHandlers = function(){
    $(document).on('click keydown', function(){
      if(!locked) {
        locked = true;
        var $currentLine = $('.current-line');
        var $nextLine = $('.next-line');
        var $nextLine2 = $('.next-line-2');
        var $lyrics = $('#lyrics');
        $currentLine.css('opacity', 0);
        $currentLine.css('font-size', '0px');
        $currentLine.css('height', '0px');
        $nextLine.css('color', options.currentLineColor);
        $nextLine.css('font-size', options.currentLineFontSize);
        $nextLine.css('height', options.currentLineHeight);
        $nextLine2.css('opacity', 1);
        setTimeout(function() {
          $currentLine.remove();
          $nextLine.removeClass('next-line').addClass('current-line');
          $nextLine2.removeClass('next-line-2').addClass('next-line');
          $lyrics.append('<div class="next-line-2"></div>');
          $('.next-line-2').html(song[i]);
          i++;
          locked = false;
        }, 500);
      }
    });
  };

  $.getJSON('config.json')
    .done(function(data){
      options = data;
      songParam = window.location.search.split('?song=')[1];
      if(songParam) {
        setDynStyle(options, songParam);
        url = 'static/songs/' + songParam + '.txt';
        $index.hide();
        // load the song
        $.ajax({url: url})
          .done(function(data) {
            song = data.split('\n');
            lines = song.length;
            var $currentLine = $('.current-line');
            var $nextLine = $('.next-line');
            var $nextLine2 = $('.next-line-2');
            $currentLine.html(song[0]);
            $nextLine.html(song[1]);
            $nextLine2.html(song[2]);
            addHandlers();
          });
      } else {
        // show the index
        var html = '<ul>';
        for(var s in options.images) {
          html += '<li><a href="?song='+s+'">'+makeTitle(s)+'</a></li>';
        }
        html += '</ul>';
        $index.html(html);
      }
    });

});
