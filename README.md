# MARPOL Offline Navigator

**Offline-first PWA for maritime MARPOL compliance and marine navigation.**

Works with limited or no internet at sea. All data stored locally on your device.

## Features

✓ **100% Offline** — No internet required. Works on planes, ships, remote areas.  
✓ **Marine Navigation** — MARPOL special areas + ECAs (17 zones pre-loaded).  
✓ **Route Compliance** — Import CSV/Excel/RTZ routes, check against regulations.  
✓ **Position Check** — Single lat/lon check against all MARPOL zones.  
✓ **Simulator** — Animated playback with real-time zone detection.  
✓ **Reports** — Export compliance timeline as PDF.  
✓ **PWA Installable** — Install as an app on your device (iOS/Android/Desktop).  
✓ **Multiple Themes** — Ocean Deep, Night Bridge, Chart Paper.  
✓ **Data Export** — Backup and move your routes between devices.

## Quick Start

### Web Browser (Recommended)

1. Visit: `https://your-domain.com/marpol-navigator` (coming soon)
2. Click **Settings** → **Install App** on mobile/Chrome
3. Works offline after first load

### Local / Portable Use

```bash
# Clone the repo
git clone https://github.com/sanojyadav5124-droid/marpol-offline-navigator.git
cd marpol-offline-navigator

# Serve locally (Python)
python3 -m http.server 8000

# Or use Node http-server
npx http-server

# Open browser to http://localhost:8000
```

## Usage

### Position Check
Enter your vessel's current latitude and longitude to check against MARPOL special areas and ECAs.

### Route Import
1. Prepare a route file (CSV, Excel, or ECDIS RTZ/RTZP)
2. Required columns: `latitude`, `longitude`, `speed`, `etd`/`eta`
3. Click **Route Import** → Select file
4. Review the import log for any warnings

### Route Check
1. Import a route (see above)
2. Click **Route Check** → **Run Route Check**
3. View entry/exit events for each MARPOL zone
4. Export as PDF report

### Simulator
1. Load a route with timestamped waypoints
2. Click **Simulator** → **Reset**
3. Click **Play** to animate vessel movement
4. Monitor real-time zone entries/exits

### Marine Map
- View loaded route on canvas map
- Drag to pan, scroll to zoom
- Toggle MARPOL zone outlines
- Future: Integration with OpenSeaMap for marine charts

## Data & Offline Maps

### Current Data (Built-in)
- 17 MARPOL special areas (Annex I, II, IV, V)
- 8 ECAs (Emission Control Areas, Annex VI)
- Polygon and latitude-based zone definitions
- Source: IMO MARPOL Annex circulars + garbage management plans

### Future Enhancements (Roadmap)
- **OpenSeaMap Integration** — Offline marine chart tiles
- **Vector Chart Data** — S-57 ENC format support
- **Port Database** — World port reference data
- **Weather Integration** — Offline weather routing (limited)
- **GIS Layer Import** — Custom shapefiles and GeoJSON
- **Route Optimization** — Avoid restricted areas

## Architecture

```
marpol-offline-navigator/
├── index.html                 # Main app shell
├── manifest.json              # PWA manifest
├── service-worker.js          # Offline caching
├── service-worker-register.js # PWA registration
├── styles.css                 # Theming (3 palettes)
├── js/
│   ├── app.js                 # Main app logic & navigation
│   ├── geo_areas.js           # MARPOL zone definitions
│   ├── geo_engine.js          # Point-in-polygon compliance engine
│   ├── state.js               # Local storage + data persistence
│   ├── route_import.js        # CSV/Excel/RTZ route parsing
│   ├── compliance.js          # Route-wide compliance checking
│   ├── simulator.js           # Animated playback
│   ├── report.js              # Compliance report generation
│   ├── world_map.js           # Canvas-based map renderer
│   ├── xlsx_import.js         # Excel .xlsx parsing
│   ├── rtz_import.js          # ECDIS RTZ/RTZP parsing
│   └── zip_reader.js          # ZIP extraction for RTZ/XLSX
└── README.md                  # This file
```

## Data Sync

When internet is available:

1. **Manual Sync** — Click **Settings** → **Sync data** to check for updates
2. **Background Sync** — PWA may sync in background when device is online
3. **Data Updates** — New MARPOL zones, chart data, or routing rules

Your local data is never overwritten without confirmation.

## Offline Capabilities

| Feature | Offline | Online |
|---------|---------|--------|
| Dashboard | ✓ | ✓ |
| Position Check | ✓ | ✓ |
| Route Import (file) | ✓ | ✓ |
| Route Check | ✓ | ✓ |
| Simulator | ✓ | ✓ |
| Reports | ✓ | ✓ |
| Marine Map | ✓ (basic) | ✓ (with charts) |
| Data Sync | — | ✓ |

## Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✓ | ✓ |
| Firefox | ✓ | ✓ |
| Safari | ✓ | ✓ (iOS 13+) |
| Edge | ✓ | ✓ |

**Minimum:** ES6 support, Service Workers, IndexedDB.

## Themes

1. **Ocean Deep** — Dark blue nautical theme (default)
2. **Night Bridge** — Dark professional bridge view
3. **Chart Paper** — Light paper chart aesthetic

Switch anytime in header → **Theme Select**.

## File Formats Supported

### Route Import
- **CSV/TXT** — Comma or semicolon separated
  - Columns: `lat`, `lon`, `speed`, `etd`/`eta`, optional `name`
- **Excel (.xlsx)** — First sheet with headers
- **ECDIS RTZ** — Standard IEC 61174 plain XML
- **ECDIS RTZP** — ZIP-compressed RTZ files

### Export
- **JSON Project** — Settings > Export project
- **PDF Report** — Reports > Export as PDF (browser print)

## Performance & Storage

- **App Size** — ~500 KB (uncompressed)
- **Local Storage** — ~10 MB for full project with layers
- **Load Time** — <2 seconds (cached)
- **Update Check** — On-demand, no background drain

## Privacy

✓ **All data stays on your device**  
✓ No tracking, no analytics  
✓ No cloud sync (unless you export and share)  
✓ No third-party services  
✓ Open source — audit the code

## License

MIT License — Free for commercial and non-commercial use.

## Contributing

Contributions welcome! Areas of focus:

- OpenSeaMap chart tile integration
- Additional MARPOL zones (if newly designated)
- Port database import
- Performance optimizations
- UI/UX improvements

See **CONTRIBUTING.md** for details.

## Support

- **Bug Reports** — GitHub Issues
- **Questions** — Discussions
- **Feedback** — Pull Requests welcome

## Roadmap

### Phase 1 (Current)
- ✓ Core compliance engine
- ✓ Route import & checking
- ✓ Offline PWA shell
- ✓ Simulator

### Phase 2 (Next)
- [ ] OpenSeaMap chart integration
- [ ] Port database search
- [ ] Weather routing
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Real-time AIS integration (when online)
- [ ] Advanced route optimization
- [ ] Multi-vessel tracking
- [ ] Fleet compliance dashboard

## Credits

- **MARPOL Data** — IMO Annex circulars, Garbage Management Plans
- **Core Engine** — Adapted from Excel-based compliance checker
- **Marine Charts** — Future: OpenSeaMap, OpenNauticalChart projects
- **Tech Stack** — Vanilla JS, Canvas, Service Workers, IndexedDB

---

**Made for maritime professionals who need compliance tools at sea, with or without internet.**

⚓ Safe sailing.
