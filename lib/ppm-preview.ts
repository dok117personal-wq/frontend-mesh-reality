/**
 * Browser doesn't support PPM in <img>. Decode PPM (P3/P6) and return a data URL for preview.
 */

function isPPMFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".ppm") || file.type === "image/x-portable-pixmap";
}

/**
 * Parse PPM buffer (P3 ASCII or P6 binary). Returns { width, height, rgb: Uint8Array } or null.
 */
function parsePPM(buffer: ArrayBuffer): { width: number; height: number; rgb: Uint8Array } | null {
  const u8 = new Uint8Array(buffer);
  const view = new DataView(buffer);
  if (u8.length < 3) return null;

  const isP3 = u8[0] === 0x50 && u8[1] === 0x33; // "P3"
  const isP6 = u8[0] === 0x50 && u8[1] === 0x36; // "P6"
  if (!isP3 && !isP6) return null;

  let idx = 2;
  while (idx < u8.length && (u8[idx] === 0x0a || u8[idx] === 0x0d || u8[idx] === 0x20)) idx++;
  while (idx < u8.length && u8[idx] === 0x23) {
    while (idx < u8.length && u8[idx] !== 0x0a) idx++;
    idx++;
    while (idx < u8.length && (u8[idx] === 0x0a || u8[idx] === 0x0d || u8[idx] === 0x20)) idx++;
  }

  function readInt(): number | null {
    while (idx < u8.length && (u8[idx] === 0x20 || u8[idx] === 0x0a || u8[idx] === 0x0d || u8[idx] === 0x09)) idx++;
    if (idx >= u8.length) return null;
    let n = 0;
    while (idx < u8.length && u8[idx] >= 0x30 && u8[idx] <= 0x39) {
      n = n * 10 + (u8[idx] - 0x30);
      idx++;
    }
    return n;
  }

  const width = readInt();
  const height = readInt();
  const maxval = readInt();
  if (width == null || height == null || maxval == null || width <= 0 || height <= 0 || maxval <= 0) return null;

  const scale = maxval <= 255 ? 1 : 255 / maxval;
  const expectedPixels = width * height * 3;
  const rgb = new Uint8Array(expectedPixels);

  if (isP6) {
    while (idx < u8.length && (u8[idx] === 0x0a || u8[idx] === 0x0d || u8[idx] === 0x20)) idx++;
    if (maxval <= 255) {
      if (idx + expectedPixels > u8.length) return null;
      for (let i = 0; i < expectedPixels; i++) rgb[i] = u8[idx + i];
    } else {
      const expectedBytes = expectedPixels * 2;
      if (idx + expectedBytes > u8.length) return null;
      for (let i = 0; i < expectedPixels; i++) {
        const v = view.getUint16(idx + i * 2, false);
        rgb[i] = Math.min(255, Math.round(v * scale));
      }
    }
  } else {
    for (let i = 0; i < expectedPixels; i++) {
      const v = readInt();
      if (v == null) return null;
      rgb[i] = Math.min(255, Math.round(v * scale));
    }
  }

  return { width, height, rgb };
}

/**
 * Convert PPM file to a JPEG data URL for use in <img src="...">. Returns null if not PPM or decode fails.
 */
export async function ppmToDataUrl(file: File): Promise<string | null> {
  if (!isPPMFile(file)) return null;
  const buffer = await file.arrayBuffer();
  const parsed = parsePPM(buffer);
  if (!parsed) return null;

  const { width, height, rgb } = parsed;
  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
  if (!canvas) return null;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imageData = ctx.createImageData(width, height);
  for (let i = 0; i < width * height; i++) {
    imageData.data[i * 4] = rgb[i * 3];
    imageData.data[i * 4 + 1] = rgb[i * 3 + 1];
    imageData.data[i * 4 + 2] = rgb[i * 3 + 2];
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.9);
}

export { isPPMFile };
