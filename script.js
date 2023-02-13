// DATUM
function getDate() {
  let jsDate = new Date();
  let tag = jsDate.getDate();
  let monat = jsDate.getMonth();
  const monatsnamen = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  document.getElementById('datum').innerHTML = tag + ". " + monatsnamen[monat];
}

// CLOCK
function startClock() {
  let jsDate = new Date();
  let h = jsDate.getHours();
  let m = jsDate.getMinutes();
  let s = jsDate.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('zeit').innerHTML = h + ":" + m + ":" + s;
  setTimeout(startClock, 1000);
}

function checkTime(x) { // add zero in front of single digits
  if (x < 10) {
    x = "0" + x;
  }
  return x;
}

// XML FEED
fetch('https://www.salzburg24.at/newsletter/busdisplay/busxml/xml')
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    let items = xml.getElementsByTagName('item');
    document.getElementById('headline').innerHTML = items[0].getElementsByTagName('title')[0].childNodes[0].nodeValue;
  })
  .catch(console.error);
