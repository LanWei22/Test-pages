function $(str) {
  return document.getElementById(str);
}

var targetElem = $('touchTarget');
var logElem = $('log');

var events = ['pointerdown', 'pointermove', 'pointerup', 'pointerover', 'pointerout',
             'pointerenter', 'pointerleave', 'pointercancel',
             'gotpointercapture', 'lostpointercapture'];
for (var e in events) {
  targetElem.addEventListener(e, pointerEventHandler);
}

var dupCount = 0;

// Try to avoid layout thrashing in setting the scroll position
var scrollLogPending = false;
function scrollLogToBottom()
{
  if (!scrollLogPending) {
    scrollLogPending = true;
    requestAnimationFrame(function() {
      logElem.scrollTop = 1000000;
      scrollLogPending = false;
    });
  }
}

function log(msg)
{
  var line = document.createElement('div');
  line.appendChild(document.createTextNode(msg));
  logElem.appendChild(line);
  scrollLogToBottom();
}

var lastTime = undefined;

// Round to 2 decimal places
function round(val)
{
    return Math.round(val * 100) / 100;
}

function pointerEventHandler(event)
{
  var msg = '';
  if (window.PointerEvent && event instanceof PointerEvent) {
    msg += ', pointerType=' + event.pointerType + ', pointerId=' +
      event.pointerId + ', width=' + round(event.width) + ', height=' + round(event.height) + 
      ', pressure=' + round(event.pressure) + ', tiltX=' + round(event.tiltX) + ', tiltY=' + round(event.tiltY)
      + ', tangentialPressure=' + round(event.tangentialPressure) + ', twist=' + round(event.twist);
  }
 
  msg = ' client=' + round(event.clientX) + ',' + round(event.clientY) + 
      ' screen=' + round(event.screenX) + ',' + round(event.screenY) +
      ' button=' + event.button + ' buttons=' + event.buttons +
      ' detail=' + event.detail + ' cancelable=' + event.cancelable + msg;
  
  if (lastTime && event.timeStamp) {
    msg += ' ' + Math.round(event.timeStamp - lastTime) + 'ms';
  }
  lastTime = event.timeStamp;

  var line = event.type +
    (dupCount > 0 ? '[' + dupCount + ']' : '') +
    ': target=' + event.target.id + msg; 
  if (dupCount) {
    logElem.lastChild.textContent = line;    
  } else {
    log(line);
  }
}