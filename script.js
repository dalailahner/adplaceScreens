// GLOBAL VARIABLES
var items;
var xmlIndex = 0;
var loopDuration = 10000;
var qrcode;
const fadeOut = [{
    opacity: 1
  },
  {
    opacity: 0
  },
];
const fadeIn = [{
    opacity: 0
  },
  {
    opacity: 1
  },
];
const animTiming = {
  duration: 1500,
  iterations: 1,
  fill: "forwards"
};

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
  fetch('https://www.salzburg24.at/newsletter/busdisplay/busxml/xmlfull')
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
    elementsArr.forEach(element => element.animate(fadeOut, animTiming));
  }, (loopDuration - animTiming.duration));
  setTimeout(() => {
    pasteArticle();
    loopArticles();
  }, loopDuration);
}

function pasteArticle() {
  // QR CODE
  qrcode.replaceChildren();
  let articleURL = items[xmlIndex].getElementsByTagName('link')[0].childNodes[0].nodeValue;
  articleURL = articleURL + "?utm_source=adplace&utm_medium=display&utm_campaign=S24AdplaceScreens";
  new QRCode(qrcode, {
    text: articleURL,
    width: 500,
    height: 500,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.L
  });
  // HEADLINE
  headline.innerHTML = items[xmlIndex].getElementsByTagName('title')[0].childNodes[0].nodeValue;
  // DESCRIPTION
  let descriptionTxt = items[xmlIndex].getElementsByTagName('description')[0].childNodes[0].nodeValue.split(' ');
  let txtForDescr2 = fillDescriptionAndReturnRest(descriptionTxt, descr1, false);
  let remainingTxtFromDescr2 = fillDescriptionAndReturnRest(txtForDescr2, descr2, true);
  // IMAGE
  let articleImgUrl = items[xmlIndex].getElementsByTagName('enclosure')[0].getAttribute('url');
  articleImg.style.backgroundImage = "url(" + articleImgUrl + ")";
  xmlIndex++;
  if (xmlIndex == items.length) {
    xmlIndex = 0;
  }
  elementsArr.forEach(element => element.animate(fadeIn, animTiming));
}

function fillDescriptionAndReturnRest(txtToFill, elToFill, dots) {
  elToFill.innerHTML = "";
  elToFill.style.height = "100%";
  elToFill.style.overflow = "hidden";
  let baseLineHeight = parseFloat(window.getComputedStyle(elToFill).lineHeight);
  let newHeight = parseFloat(elToFill.clientHeight / baseLineHeight * baseLineHeight);
  if (newHeight > baseLineHeight) {
    elToFill.style.height = "fit-content";
    for (let index = txtToFill.length; index > 0; index--) {
      let fillTxt = txtToFill.slice(0, index);
      elToFill.innerHTML = fillTxt.join(" ");
      if (dots) {
        elToFill.innerHTML = elToFill.innerHTML + " ...";
      }
      if (elToFill.scrollHeight < newHeight) {
        let remainingTxt = txtToFill.slice(index);
        elToFill.style.overflow = "visible";
        return remainingTxt;
      }
    }
  } else {
    elToFill.style.height = 0;
    return txtToFill;
  }
}
