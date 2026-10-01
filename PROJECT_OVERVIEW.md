# MARPOL Offline Navigator

Repository: https://github.com/sanojyadav5124-droid/marpol-offline-navigator

## Overview
This project is an offline-first web application for MARPOL and ECA compliance monitoring. It allows users to import route data, check whether the route crosses restricted marine zones, review compliance events, simulate voyage timing, and generate printable reports without requiring continuous internet access.

## Core features
- Offline-first PWA structure
- MARPOL / ECA area checks using geospatial logic
- Route import from CSV, TXT, XLSX, RTZ, and RTZP
- Position-based area lookup
- Voyage simulator for route timeline analysis
- Export/import of project state
- Local persistence via browser storage
- Marine chart tile support with local caching when online

## App architecture
- `index.html` – application shell and all UI pages
- `styles.css` – layout and theme styling
- `manifest.json` – installable app metadata
- `service-worker.js` and `service-worker-register.js` – offline caching and PWA support
- `js/geo_areas.js` – MARPOL and ECA area dataset
- `js/geo_engine.js` – geospatial calculations, polygon checks, distance logic
- `js/compliance.js` – route compliance analysis logic
- `js/state.js` – save/load/export project state
- `js/route_import.js` – CSV/TXT route parsing
- `js/xlsx_import.js` – Excel route import logic
- `js/rtz_import.js` – RTZ / RTZP import logic
- `js/world_map.js` – map rendering and world view
- `js/simulator.js` – time-based voyage simulation
- `js/report.js` – generated compliance report
- `js/offline_data.js` – local offline data models
- `js/marine_charts.js` – chart cache and tile support
- `js/sync_manager.js` – chart/data sync management
- `js/main.js` – application bootstrap and UI event wiring

## Offline chart caching flow
1. The app checks whether the browser is online.
2. If online, the chart loader requests marine tiles from an OpenSeaMap-compatible source.
3. Each tile is downloaded and saved in IndexedDB.
4. The cache is used for future offline display without reloading internet data.
5. The compliance engine remains fully functional even when charts are unavailable.
6. Users can clear the chart cache manually or let it refresh on demand.

## Run locally
From the project folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Notes
This is an offline-first marine compliance app and not a packaged global marine navigation dataset. The core compliance tool works without internet, while chart tiles are downloaded when available and cached locally for later use.

## Purpose
This app is intended as a practical marine operational tool for compliance checks, route planning review, and offline voyage analysis in low-connectivity environments.
