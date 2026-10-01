let mapCanvas, mapView = { centerLon: 0, centerLat: 20, zoom: 1 };

function initWorldMap() {
  mapCanvas = document.getElementById('worldMapCanvas');
  if (mapCanvas) {
    resizeMapCanvas();
    drawMap();
  }
}

function resizeMapCanvas() {
  if (mapCanvas) {
    mapCanvas.width = mapCanvas.offsetWidth;
    mapCanvas.height = mapCanvas.offsetHeight;
  }
}

function baseScale() {
  // pixels per degree of longitude at zoom=1, sized so the whole world fits width-wise
  return mapCanvas.width / 360;
}

function project(lat, lon) {
  const scale = baseScale() * mapView.zoom;
  const x = (lon - mapView.centerLon) * scale + mapCanvas.width / 2;
  const y = (mapView.centerLat - lat) * scale + mapCanvas.height / 2;
  return { x, y };
}

function themeColor(varName) {
  return getComputedStyle(document.body).getPropertyValue(varName).trim();
}

function drawMap() {
  if (!mapCanvas) return;
  const ctx = mapCanvas.getContext('2d');
  ctx.fillStyle = themeColor('--color-bg');
  ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
  // Draw MARPOL zones and route
}

function mapZoomFullWorld() {
  mapView = { centerLon: 0, centerLat: 20, zoom: 1 };
  drawMap();
}

function mapZoomToRoute() {
  if (state.currentRoute) {
    // Calculate bounds and zoom to route
    drawMap();
  }
}
