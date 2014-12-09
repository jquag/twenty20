(function () {
  'use strict';
  
  var SCREEN_MINS = 20;
  var AWAY_SECONDS = 20;

  var moment = require('moment');
  var sprintf = require('sprintf');

  var timer = document.querySelector('#timer');
  var audio = document.querySelector('audio');
  var message = document.querySelector('p');
  var gui = require('nw.gui');
  //TODO JQ: create icon
  var win = gui.Window.get();

  //var tray = new gui.Tray({ icon: 'images/mouser1.png' });
  var tray = new gui.Tray({ title: '<o (]' });
  tray.on('click', function() { win.show(); });

  var updateTimer = function(endingMoment) {
      var duration = moment.duration(endingMoment.diff(moment()));
      if (duration.asMilliseconds() <= 0) {
        timer.textContent = '00:00';
        return false;
      } else {
        timer.textContent = sprintf('%02d', duration.minutes()) + ':' + sprintf('%02d', duration.seconds());
        return true;
      }
  };

  //TODO JQ: make a mute button
  var lookAway = function() {
    //TODO JQ: change to an icon
    tray.title = 'o> (]';
    audio.play();
    new Notification(sprintf('Look away from the screen for %d seconds.', AWAY_SECONDS), {body: 'Try to focus on something at least 20 feet away.'});
    message.textContent = 'Look away for ...';
    timer.className = 'looking-away';
  };

  var lookAtScreen = function() {
    //TODO JQ: change to an icon
    tray.title = '<o (]';
    audio.play();
    new Notification('It is time to look at the screen again.');
    message.textContent = 'Look away in ... ';
    timer.className = 'looking-at-screen';
  };

  var startTimer = function(type, endTime) {
    var intervalId = setInterval(function() {
      var stillCountingDown = updateTimer(endTime);
      if (!stillCountingDown) {
        clearInterval(intervalId);
        if (type == 'screen') {
          lookAway();
          startTimer('away', moment().add(AWAY_SECONDS, 'seconds'));
        } else {
          lookAtScreen();
          startTimer('screen', moment().add(SCREEN_MINS, 'minutes'));
        }
      }
    }, 200);
  };

  startTimer('screen', moment().add(SCREEN_MINS, 'minutes'));

}());
