const state = {
  currentRoute: null,
  complianceEvents: [],
  vesselName: 'MV NORTHERN STAR',
  layers: []
};

function saveState() {
  const stateJson = JSON.stringify(state);
  localStorage.setItem('marpol_state', stateJson);
}

function loadState() {
  const stateJson = localStorage.getItem('marpol_state');
  if (stateJson) {
    Object.assign(state, JSON.parse(stateJson));
  }
}

function exportStateToFile() {
  const dataStr = JSON.stringify(state, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `marpol_state_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importStateFromFile(file, onDone) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      Object.assign(state, imported);
      saveState();
      onDone(true, null);
    } catch (err) {
      onDone(false, err.message);
    }
  };
  reader.readAsText(file);
}

async function saltedHash(pwd, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pwd + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
