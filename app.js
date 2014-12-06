(function () {
  'use strict';

  var moment = require('moment');
  var sprintf = require('sprintf');

  var timer = document.getElementById('timer');
  var lookAwayAt = moment().add(1, 'minutes');
  var lookingAtScreenLoop = setInterval(function() {
    var duration = moment.duration(lookAwayAt.diff(moment()));
    if (duration.asMilliseconds() <= 0) {
      clearInterval(lookingAtScreenLoop);
      timer.textContent = '00 : 00';
    } else {
      timer.textContent = sprintf('%02d', duration.minutes()) + ' : ' + sprintf('%02d', duration.seconds());
    }
  }, 200);
}());
