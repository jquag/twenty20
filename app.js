(function () {
  'use strict';
  
  var SCREEN_MINS = 20;
  var AWAY_SECONDS = 20;
  var NOTIFICATION_TIMEOUT = 10000;

  var moment = require('moment');
  var sprintf = require('sprintf');
  var gui = require('nw.gui');
  var settings = require('./settings');
  var fs = require('fs');

  var audio = document.querySelector('audio');
  var timerInterval;
  var onScreen = true;

  var quit = function() {
    gui.App.quit();
  };

  var reset = function() {
    clearInterval(timerInterval);
    startTimer('screen', moment().add(SCREEN_MINS, 'minutes'));
  };

  var muteLabel = function() {
    return settings.mute ? 'unmute' : 'mute';
  };

  var toggleMute = function() {
    settings.mute = !settings.mute;
    fs.writeFile('settings.json', JSON.stringify(settings));
    this.label = muteLabel();
  };

  //build menu
  var menu = new gui.Menu();
  menu.append(new gui.MenuItem({ label: '20:00', enabled: false }));
  menu.append(new gui.MenuItem({ type: 'separator' }));
  menu.append(new gui.MenuItem({ label: muteLabel(), click: toggleMute }));
  menu.append(new gui.MenuItem({ label: 'reset timer', click: reset }));
  menu.append(new gui.MenuItem({ label: 'quit', click: quit }));

  var tray = new gui.Tray({ icon: 'icons/eye1.png', menu: menu });

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
    tray.icon = 'icons/eye2.png';
    var notification = new Notification(sprintf('Look away from the screen for %d seconds.', AWAY_SECONDS), { body: 'Try to focus on something at least 20 feet away.'});
    setTimeout(function() { notification.close() }, NOTIFICATION_TIMEOUT);
  };

  var lookAtScreen = function() {
    onScreen = true;
    tray.icon = 'icons/eye1.png';
    var notification = new Notification('It is time to look at the screen again.');
    setTimeout(function() { notification.close() }, NOTIFICATION_TIMEOUT);
  };

  var startTimer = function(type, endTime) {
    timerInterval = setInterval(function() {
      var stillCountingDown = updateTimer(endTime);
      if (!stillCountingDown) {
        clearInterval(timerInterval);
        if (!settings.mute) {
          audio.play();
        }
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
