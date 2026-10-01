function runRouteCheck(waypoints) {
  // Route compliance check against MARPOL zones
  const events = [];
  let currentZone = null;

  for (let i = 0; i < waypoints.length; i++) {
    const wp = waypoints[i];
    const zone = checkPoint(wp.lat, wp.lon);

    if (zone !== currentZone) {
      if (currentZone !== null) {
        events.push({
          type: 'exit',
          zone: currentZone,
          waypoint: i,
          timestamp: wp.timestamp
        });
      }
      if (zone !== null) {
        events.push({
          type: 'entry',
          zone: zone,
          waypoint: i,
          timestamp: wp.timestamp
        });
      }
      currentZone = zone;
    }
  }

  return events;
}
