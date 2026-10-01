function generateReport() {
  // Generate compliance report from route check events
  const doc = {
    title: 'MARPOL Compliance Report',
    vesselName: state.vesselName,
    reportDate: new Date().toISOString(),
    route: state.currentRoute,
    events: state.complianceEvents,
    summary: {
      totalWaypoints: state.currentRoute ? state.currentRoute.waypoints.length : 0,
      zonesEntered: new Set(state.complianceEvents.filter(e => e.type === 'entry').map(e => e.zone)).size,
      zonesExited: new Set(state.complianceEvents.filter(e => e.type === 'exit').map(e => e.zone)).size
    }
  };
  return doc;
}
