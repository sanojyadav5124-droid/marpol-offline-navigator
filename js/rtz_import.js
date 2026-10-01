function getAttr(tagXml, attrName) {
  const m = tagXml.match(new RegExp(`${attrName}="([^"]*)"`);
  return m ? xmlUnescape(m[1]) : "";
}

function parseIso8601(s) {
  return new Date(s);
}

function importRtzXml(xmlText) {
  const waypoints = [];
  const waypointMatches = xmlText.match(/<Waypoint[^>]*>.*?<\/Waypoint>/gs) || [];
  
  for (const match of waypointMatches) {
    const lat = parseFloat(getAttr(match, 'Lat'));
    const lon = parseFloat(getAttr(match, 'Lon'));
    const id = getAttr(match, 'id');
    waypoints.push({ lat, lon, id });
  }
  return waypoints;
}

async function importRtzpRoute(arrayBuffer) {
  const zip = new Uint8Array(arrayBuffer);
  const entries = await readZipEntries(zip, ['route.xml']);
  const xmlText = bytesToText(entries['route.xml']);
  return importRtzXml(xmlText);
}
