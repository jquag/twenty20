(function () {
  'use strict';
  
  var SCREEN_MINS = 20;
  var AWAY_SECONDS = 20;

  var moment = require('moment');
  var sprintf = require('sprintf');

  var audio = document.querySelector('audio');
  var gui = require('nw.gui');
  var timerInterval;
  var onScreen = true;

  var quit = function() {
    gui.App.quit();
  };

  var reset = function() {
    clearInterval(timerInterval);
    startTimer('screen', moment().add(SCREEN_MINS, 'minutes'));
  };

  //build menu
  var menu = new gui.Menu();
  //TODO JQ: use an icon for the timer menu item
  menu.append(new gui.MenuItem({ label: '20:00', enabled: false }));
  menu.append(new gui.MenuItem({ type: 'separator' }));
  //TODO JQ: wireup mute
  menu.append(new gui.MenuItem({ label: 'mute' }));
  menu.append(new gui.MenuItem({ label: 'reset timer', click: reset }));
  menu.append(new gui.MenuItem({ label: 'quit', click: quit }));

  //TODO JQ: use an icon for the tray
  var tray = new gui.Tray({ title: '( o o )', menu: menu });

  var updateTimer = function(endingMoment) {
      var duration = moment.duration(endingMoment.diff(moment()));
      if (duration.asMilliseconds() <= 0) {
        menu.items[0].label = '00:00';
        return false;
      } else {
        var time = sprintf('%02d', duration.minutes()) + ':' + sprintf('%02d', duration.seconds());
        menu.items[0].label = time;
        return true;
      }
  };

  var lookAway = function() {
    onScreen = false;
    tray.title = '( - - )';
    audio.play();
    new Notification(sprintf('Look away from the screen for %d seconds.', AWAY_SECONDS), {body: 'Try to focus on something at least 20 feet away.'});
  };

  var lookAtScreen = function() {
    onScreen = true;
    tray.title = '( o o )';
    audio.play();
    new Notification('It is time to look at the screen again.');
  };

  var startTimer = function(type, endTime) {
    timerInterval = setInterval(function() {
      var stillCountingDown = updateTimer(endTime);
      if (!stillCountingDown) {
        clearInterval(timerInterval);
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
