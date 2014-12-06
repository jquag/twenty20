define(function (require) {
  var moment = require('moment');

  var timer = document.getElementById('timer');
  var lookAwayAt = moment().add(20, 'minutes');
  var lookingAtScreenLoop = setInterval(function() {
    var duration = moment.duration(lookAwayAt.diff(moment()));
    if (duration.asMilliseconds <= 0) {
      clearInterval(lookingAtScreenLoop);
      timer.textContent = '00 : 00';
    } else {
      timer.textContent = duration.minutes() + ' : ' + duration.seconds();
    }
  }, 200);
});
