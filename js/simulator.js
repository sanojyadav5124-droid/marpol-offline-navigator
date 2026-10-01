const sim = {
  running: false,
  intervalId: null,
  currentWaypointIndex: 0,
  currentTime: 0
};

function simReset() {
  sim.running = false;
  sim.currentWaypointIndex = 0;
  sim.currentTime = 0;
  if (sim.intervalId) clearInterval(sim.intervalId);
  drawMap();
}

function simPlay() {
  sim.running = true;
  sim.intervalId = setInterval(simTick, 100);
}

function simPause() {
  sim.running = false;
  clearInterval(sim.intervalId);
}

function simStep() {
  if (state.currentRoute && sim.currentWaypointIndex < state.currentRoute.waypoints.length) {
    sim.currentWaypointIndex++;
    drawMap();
  }
}

function simInstant() {
  if (state.currentRoute) {
    sim.currentWaypointIndex = state.currentRoute.waypoints.length - 1;
    drawMap();
  }
}

function simTick() {
  advanceAndRender(sim.currentTime);
  sim.currentTime += 100;
}

function advanceAndRender(targetTime) {
  if (state.currentRoute) {
    for (let i = 0; i < state.currentRoute.waypoints.length; i++) {
      if (state.currentRoute.waypoints[i].timestamp >= targetTime) {
        sim.currentWaypointIndex = i;
        break;
      }
    }
    drawMap();
  }
}
