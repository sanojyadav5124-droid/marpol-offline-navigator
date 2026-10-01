document.addEventListener("DOMContentLoaded", async () => {
  loadState();
  loadOfflineData();
  applyTheme(state.theme);

  initOfflineData();
  initMarineCharts();
  setupAutoSync();

  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) {
    themeSelect.value = state.theme;
    themeSelect.addEventListener("change", (e) => {
      state.theme = e.target.value;
      applyTheme(state.theme);
      saveState();
    });
  }

  const adminBtn = document.getElementById("adminBtn");
  if (adminBtn) adminBtn.addEventListener("click", onAdminClick);
  const userBtn = document.getElementById("userBtn");
  if (userBtn) userBtn.addEventListener("click", () => setAdminUI(false));

  document.querySelectorAll("nav#tabs button").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });
  document.querySelectorAll(".tile").forEach(tile => {
    tile.addEventListener("click", () => showPage(tile.dataset.page));
  });

  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportStateToFile);

  const importFile = document.getElementById("importFile");
  if (importFile) {
    importFile.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      importStateFromFile(f, (ok, err) => {
        if (ok) {
          applyTheme(state.theme);
          if (themeSelect) themeSelect.value = state.theme;
          renderRouteTable();
          alert("Project loaded.");
        } else {
          alert("Could not load file: " + err);
        }
      });
    });
  }

  const checkPositionBtn = document.getElementById("checkPositionBtn");
  if (checkPositionBtn) {
    checkPositionBtn.addEventListener("click", () => {
      const lat = parseFloat(document.getElementById("posLat").value);
      const lon = parseFloat(document.getElementById("posLon").value);
      if (isNaN(lat) || isNaN(lon)) { alert("Enter a valid latitude and longitude."); return; }
      const hits = checkPoint(lat, lon);
      renderPositionResults(hits);
    });
  }

  const loadSampleBtn = document.getElementById("loadSampleBtn");
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener("click", () => {
      state.route.waypoints = loadSampleRoute();
      saveState();
      renderRouteTable();
      setImportStatus(`${state.route.waypoints.length} sample waypoints loaded.`, false);
      updateDashboardStatus();
    });
  }

  const routeFileInput = document.getElementById("routeFileInput");
  if (routeFileInput) {
    routeFileInput.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const name = f.name.toLowerCase();
      setImportStatus("Importing...", false);

      if (name.endsWith(".csv") || name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (ev) => applyImportResult(importRouteCSV(ev.target.result));
        reader.readAsText(f);
      } else if (name.endsWith(".xlsx")) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try { applyImportResult(await importXlsxRoute(ev.target.result)); }
          catch (err) { setImportStatus("Error: " + err.message, true); }
        };
        reader.readAsArrayBuffer(f);
      } else if (name.endsWith(".rtzp")) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try { applyImportResult(await importRtzpRoute(ev.target.result)); }
          catch (err) { setImportStatus("Error: " + err.message, true); }
        };
        reader.readAsArrayBuffer(f);
      } else if (name.endsWith(".rtz")) {
        const reader = new FileReader();
        reader.onload = (ev) => applyImportResult(importRtzXml(ev.target.result));
        reader.readAsText(f);
      } else {
        setImportStatus("Unrecognised file type. Use .csv, .txt, .xlsx, .rtz or .rtzp.", true);
      }
    });
  }

  function applyImportResult(result) {
    state.route.waypoints = result.waypoints;
    saveState();
    renderRouteTable();
    renderImportLog(result.log);
    setImportStatus(`${result.waypoints.length} waypoints imported, ${result.log.length} rejected/flagged.`, result.log.length > 0);
    updateDashboardStatus();
  }

  const runRouteCheckBtn = document.getElementById("runRouteCheckBtn");
  if (runRouteCheckBtn) {
    runRouteCheckBtn.addEventListener("click", () => {
      const result = runRouteCheck(state.route.waypoints);
      renderRouteCheckResults(result);
    });
  }

  const mapFullWorldBtn = document.getElementById("mapFullWorldBtn");
  if (mapFullWorldBtn) mapFullWorldBtn.addEventListener("click", mapZoomFullWorld);
  const mapFitRouteBtn = document.getElementById("mapFitRouteBtn");
  if (mapFitRouteBtn) mapFitRouteBtn.addEventListener("click", mapZoomToRoute);
  const showAreasChk = document.getElementById("showAreasChk");
  if (showAreasChk) showAreasChk.addEventListener("change", drawMap);

  initWorldMap();

  const simPlayBtn = document.getElementById("simPlayBtn");
  if (simPlayBtn) simPlayBtn.addEventListener("click", simPlay);
  const simPauseBtn = document.getElementById("simPauseBtn");
  if (simPauseBtn) simPauseBtn.addEventListener("click", simPause);
  const simStepBtn = document.getElementById("simStepBtn");
  if (simStepBtn) simStepBtn.addEventListener("click", simStep);
  const simResetBtn = document.getElementById("simResetBtn");
  if (simResetBtn) simResetBtn.addEventListener("click", simReset);
  const simInstantBtn = document.getElementById("simInstantBtn");
  if (simInstantBtn) simInstantBtn.addEventListener("click", simInstant);

  const genReportBtn = document.getElementById("genReportBtn");
  if (genReportBtn) genReportBtn.addEventListener("click", generateReport);
  const printReportBtn = document.getElementById("printReportBtn");
  if (printReportBtn) printReportBtn.addEventListener("click", () => window.print());

  const syncBtn = document.getElementById("syncBtn");
  if (syncBtn) {
    syncBtn.addEventListener("click", async () => {
      syncBtn.textContent = "↺ Syncing...";
      await triggerSync();
      const time = new Date().toISOString();
      localStorage.setItem("lastDataSync", time);
      document.getElementById("kpiLastSync").textContent = new Date(time).toLocaleDateString();
      syncBtn.textContent = "↺ Sync data";
    });
  }

  renderRouteTable();
  renderPositionResults([]);
  showPage("dashboard");
  updateDashboardStatus();
});

window.updateDashboardStatus = updateDashboardStatus;
