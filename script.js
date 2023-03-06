// GLOBAL VARIABLES
var items;
var xmlIndex = 0;
var loopDuration = 3000;

getXML();

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
function getXML() {
  fetch('https://www.salzburg24.at/newsletter/busdisplay/busxml/xml')
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'application/xml');
      items = xml.getElementsByTagName('item');
      pasteArticle();
      loopArticles();
    })
    .catch(console.error);
}

function loopArticles() {
  setTimeout(() => {
    pasteArticle();
    loopArticles();
  }, loopDuration);
}

function pasteArticle() {
  let headline = document.getElementById('headline');
  let descr1 = document.querySelectorAll('.description')[0];
  let descr2 = document.querySelectorAll('.description')[1];
  // HEADLINE
  headline.innerHTML = items[xmlIndex].getElementsByTagName('title')[0].childNodes[0].nodeValue;
  // DESCRIPTION
  let descriptionTxt = items[xmlIndex].getElementsByTagName('description')[0].childNodes[0].nodeValue.split(' ');
  let txtForDescr2 = fillDescriptionAndReturnRest(descriptionTxt, descr1);
  let remainingTxtFromDescr2 = fillDescriptionAndReturnRest(txtForDescr2, descr2);
  // QR CODE
  // TODO: FIX QR CODE GENERATOR
  let articleURL = items[xmlIndex].getElementsByTagName('link')[0].childNodes[0].nodeValue;
  let qrcode = new QRCode(document.getElementById('qrcode'), {
    text: articleURL,
    width: 500,
    height: 500,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.L
  });
  // IMAGE
  let articleImg = document.getElementById('articleIMG');
  let articleImgUrl = items[xmlIndex].getElementsByTagName('enclosure')[0].getAttribute('url');
  articleImg.style.backgroundImage = "url(" + articleImgUrl + ")";
  xmlIndex++;
  if (xmlIndex == items.length) {
    xmlIndex = 0;
  }
}

function fillDescriptionAndReturnRest(txtToFill, elToFill) {
  elToFill.innerHTML = txtToFill.join(" ");
  elToFill.style.height = window.getComputedStyle(elToFill).height;
  let baseLineHeight = parseFloat(window.getComputedStyle(elToFill).lineHeight);
  let newHeight = parseFloat(elToFill.clientHeight / baseLineHeight * baseLineHeight);
  elToFill.style.height = "fit-content";
  for (let index = txtToFill.length; index > 1; index--) {
    let fillTxt = txtToFill.slice(0, index);
    elToFill.innerHTML = fillTxt.join(" ");
    if (elToFill.scrollHeight < newHeight) {
      let remainingTxt = txtToFill.slice(index, txtToFill.length);
      elToFill.style.overflow = "visible";
      return remainingTxt;
    }
  }
}
