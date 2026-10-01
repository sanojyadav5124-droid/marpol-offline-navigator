function xmlUnescape(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

function parseSharedStrings(xml) {
  const strings = [];
  const matches = xml.match(/<t>([^<]*)<\/t>/g) || [];
  for (const match of matches) {
    strings.push(xmlUnescape(match.replace(/<\/?t>/g, '')));
  }
  return strings;
}

function excelSerialToDate(serial) {
  const excelEpoch = new Date(1900, 0, 0);
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

function colLetterToIndex(letters) {
  let index = 0;
  for (let i = 0; i < letters.length; i++) {
    index = index * 26 + (letters.charCodeAt(i) - 64);
  }
  return index - 1;
}

function parseWorksheetXml(xml, sharedStrings) {
  const rows = [];
  const rowMatches = xml.match(/<row[^>]*>.*?<\/row>/gs) || [];
  for (const rowMatch of rowMatches) {
    const cells = rowMatch.match(/<c[^>]*>.*?<\/c>/g) || [];
    const row = [];
    for (const cell of cells) {
      const valueMatch = cell.match(/<v>([^<]*)<\/v>/);
      row.push(valueMatch ? valueMatch[1] : '');
    }
    rows.push(row);
  }
  return rows;
}

async function importXlsxRoute(arrayBuffer) {
  const zip = new Uint8Array(arrayBuffer);
  const entries = await readZipEntries(zip, ['xl/sharedStrings.xml', 'xl/worksheets/sheet1.xml']);
  const sharedStrings = parseSharedStrings(entries['xl/sharedStrings.xml']);
  const rows = parseWorksheetXml(entries['xl/worksheets/sheet1.xml'], sharedStrings);
  return rowsToWaypointResult(rows);
}

function rowsToWaypointResult(rows) {
  const waypoints = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    waypoints.push({
      lat: parseFloat(row[0]),
      lon: parseFloat(row[1]),
      speed: parseFloat(row[2]),
      timestamp: new Date(row[3]).getTime()
    });
  }
  return waypoints;
}
