fetch('https://www.salzburg24.at/newsletter/busdisplay/busxml/xml')
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    let items = xml.getElementsByTagName('item');
    document.getElementById(
      'headline'
    ).innerHTML = items[0].getElementsByTagName(
      'title'
    )[0].childNodes[0].nodeValue;
  })
  .catch(console.error);
