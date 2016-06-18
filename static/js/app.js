var parseQueryString = function() {
  var queryString = window.location.search;
  var params = {}, queries, temp, i, l;

  if(queryString.indexOf('?') !== -1) {
    queryString = queryString.split('?')[1];

    // Split into key/value pairs
    queries = queryString.split("&");

    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
      temp = queries[i].split('=');
      params[temp[0]] = temp[1];
    }
  }

  return params;
};

$(document).ready(function(){

  var song, lines;
  var i = 3;
  var locked = false;
  var $index = $('#index');
  var $dynStyle = $('#dyn-style');
  var options;
  var params;
  var url;
  var $body = $('body');

  var makeTitle = function(str){
    str = str.split('-').join(' ');
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  var setDynStyle = function(options, band){
    var style = '' +
      '#background {' +
      '  background: #232323 url("static/img/'+band+'.jpg") no-repeat center;' +
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

  var addHandlers = function(options){
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
      params = parseQueryString();
      if(params.song) {
        $body.removeClass('index');
        setDynStyle(options, params.band);
        url = 'static/songs/' + params.song + '.txt';
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
            addHandlers(options);
          });
      } else {
        // show the index
        $body.addClass('index');
        var html = '<div class="list">';
        var currBand = '';
        var songArr;
        for(var s in options.songs) {
          for(var i=0; i<options.songs[s].length; i++) {
            html += '<a href="?song=' + options.songs[s][i] + '&band=' + s + '">' +
              '<img src="static/img/'+s+'.jpg"/>'
              + makeTitle(s + ': ' + options.songs[s][i]) + '</a>';
          }
        }
        html += '</div>';
        $index.html(html);
      }
    });

});
