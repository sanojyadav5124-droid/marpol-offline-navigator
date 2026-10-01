async function readZipEntries(arrayBuffer, wantedNames) {
  const entries = {};
  const view = new DataView(arrayBuffer);
  let offset = 0;

  // Scan for local file headers
  while (offset < view.byteLength) {
    const signature = view.getUint32(offset, true);
    if (signature !== 0x04034b50) break; // Local file header signature
    
    offset += 26;
    const filenameLength = view.getUint16(offset, true);
    const extraLength = view.getUint16(offset + 2, true);
    offset += 4;
    
    const filenameBytes = new Uint8Array(arrayBuffer, offset, filenameLength);
    const filename = new TextDecoder('utf-8').decode(filenameBytes);
    offset += filenameLength + extraLength;
    
    if (wantedNames.includes(filename)) {
      const compMethod = view.getUint16(offset - filenameLength - extraLength - 8, true);
      const compSize = view.getUint32(offset - filenameLength - extraLength - 16, true);
      const data = await extractLocalEntry(arrayBuffer, view, offset - filenameLength - extraLength - 30, compMethod, compSize);
      entries[filename] = data;
    }
  }
  return entries;
}

async function extractLocalEntry(bytes, dv, localOffset, compMethod, compSize) {
  if (compMethod === 0) {
    return new Uint8Array(bytes, localOffset + 30, compSize);
  } else if (compMethod === 8) {
    return await inflateRaw(new Uint8Array(bytes, localOffset + 30, compSize));
  }
  return new Uint8Array();
}

async function inflateRaw(compressedBytes) {
  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(compressedBytes);
  writer.close();
  const reader = ds.readable.getReader();
  const chunks = [];
  let result;
  while (!(result = await reader.read()).done) {
    chunks.push(result.value);
  }
  return new Uint8Array(await new Blob(chunks).arrayBuffer());
}

function bytesToText(bytes) {
  return new TextDecoder("utf-8").decode(bytes);
}
