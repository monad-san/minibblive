$(function(){
  update();
 });
function update() {
  var bbstat = 0;
  var nurlf = null;
  var sptitle = '';
  
  $.ajax("http://baseball.yahoo.co.jp/npb/", {
    type: 'GET',
    dataType: 'html',
    mimeType: 'text/html',
    success: function(response) {
      var teams = { 'dragons': '中日', 'tigers': '阪神', 'giants': '巨人', 'swallows': 'ヤクルト', 'carp': '広島', 'baystars': '横浜',
                    'hawks': 'ソフトバンク', 'lions': '西武', 'marines': 'ロッテ', 'fighters': '日本ハム', 'baffaloes': 'オリックス', 'goldeneagles': '楽天'};
      var steam = localStorage["selected_team"];
      if(steam == undefined) steam = 'dragons';

      $('table.NpbSP', response).each(function() {
        sptitle = "～ " + $('div.yjMSt',response).text() + " ～";
        $('div.standby', this).each(function() {
          nurlf = $(this).children('a').attr('href');
          if($(this).text().indexOf('結果') != -1) {
            bbstat = 3;
          } else if($(this).text().indexOf('中止') != -1) {
            bbstat = 4;
          } else if($(this).text().indexOf('試合前') != -1) {
            bbstat = 2;
          } else {
            bbstat = 1;
          }
        });
      });
      
      var get_gameinfo = function (gi_root) {
        if($(gi_root).text().indexOf(teams[steam]) != -1) {
          $('td.active', gi_root).each(function() {
            nurlf = $(this).children('a').attr('href');
            bbstat = 1;
          });
          if(nurlf == null) {
            $('td.standby', gi_root).each(function() {
              nurlf = $(this).children('a').attr('href');
              if($(this).text().indexOf('中止') != -1) {
                bbstat = 4;
              } else {
                bbstat = 2;
              }
            });
          }
          if(nurlf == null) {
            $('td.end', gi_root).each(function() {
              nurlf = $(this).children('a').attr('href');
              bbstat = 3;
            });
          }
        }
      }
      $('table.teams', response).each(function() {get_gameinfo(this)});
      $('table.cm1', response).each(function() {
        sptitle = "～ " + $('div.yjMSt',response).text() + " ～";
        get_gameinfo(this);
      });
      $('table.cm2', response).each(function() {
        sptitle = "～ " + $('div.yjMSt',response).text() + " ～";
        get_gameinfo(this);
      });
      
      switch(bbstat) {
      case 0:
        $('#header').text("試合なし");
        $('#url a').attr("href", "http://baseball.yahoo.co.jp/npb/");
        break;
      case 1:
      case 3:
        $.ajax("http://live.baseball.yahoo.co.jp"+nurlf+"score", {
          type: 'GET',
          dataType: 'html',
          mimeType: 'text/html',
          success: function(response) {
            $('#sptitle').text(sptitle);
            var matchings = $('#scoreboard table tbody tr:not(".chs-title") th',response);
            var scores = $('#scoreboard table tbody tr td.sum',response);
            $('#header').text(matchings[0].innerText+" "+scores[0].innerText+
                        " - "+scores[1].innerText+" "+matchings[1].innerText+ " || ");
            if(bbstat == 1) {
              $('#header').append($('#sbo h4.live em',response).text());
            } else {
              $('#header').append("試合終了");
            }
            
            $('#scnt').text("S "+$('p.s b',response).text().length);
            $('#bcnt').text("B "+$('p.b b',response).text().length);
            $('#ocnt').text("O "+$('p.o b',response).text().length);
            
            $('#base1').text("一塁["+$('#base1 span', response).text()+"]");
            $('#base2').text("二塁["+$('#base2 span', response).text()+"]");
            $('#base3').text("三塁["+$('#base3 span', response).text()+"]");
            
            $('#battle').text("打者："+$('#batter td.nm a', response).text()+" vs. 投手："+$('#pitcherR td.nm a', response).text()+$('#pitcherL td.nm a', response).text());
            $('#ball').text($('#kyusyuR p em', response).text()+$('#kyusyuL p em', response).text());
            $('#result').text($('#result', response).text());
            $('#url a').attr("href", "http://live.baseball.yahoo.co.jp"+nurlf+"score");
          }
        });
        break;
      case 2:
      case 4:
        $.ajax("http://baseball.yahoo.co.jp"+nurlf+"top", {
          type: 'GET',
          dataType: 'html',
          mimeType: 'text/html',
          success: function(response) {
            $('#sptitle').text(sptitle);
            $('#header').text($('#ch-navi em',response).text());
            if(bbstat == 2) {
              $('#battle').text($('p.stadium', response).text());
            } else {
              $('#battle').text("中止");
            }
            $('#url a').attr("href", "http://baseball.yahoo.co.jp"+nurlf+"top");
          }
        });
        break;
      }
    }
  });
}
function body() {
  return $("body").html();
}
