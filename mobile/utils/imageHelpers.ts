import * as FileSystem from 'expo-file-system';
import * as FileSystemLegacy from 'expo-file-system/legacy';

/**
 * Detect base64 corrupt: terlalu pendek, HTML error page, atau bukan
 * karakter base64 yang valid.
 */
function isBase64Corrupt(base64: string): boolean {
  if (base64.length < 100) return true;
  if (base64.startsWith('<')) return true;
  if (base64.includes('DOCTYPE') || base64.includes('<html')) return true;
  const sample = base64.slice(0, 200);
  if (!/^[A-Za-z0-9+/=]+$/.test(sample)) return true;
  return false;
}

async function convertSingleImage(uri: string, index: number): Promise<string> {
  // MIME detection dari ekstensi URI (default jpeg)
  const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
  const mime =
    ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  // Step A — next-gen File API (non-deprecated)
  const result = await new FileSystem.File(uri).base64();
  console.log(`[img ${index}] method=main len=${result.length} sample=${result.slice(0, 60)}`);
  if (!isBase64Corrupt(result)) {
    return `data:${mime};base64,${result}`;
  }

  // Step B — legacy fallback
  const result2 = await FileSystemLegacy.readAsStringAsync(uri, { encoding: 'base64' });
  console.log(`[img ${index}] method=legacy len=${result2.length} sample=${result2.slice(0, 60)}`);
  if (!isBase64Corrupt(result2)) {
    return `data:${mime};base64,${result2}`;
  }

  // Step C — both failed
  throw new Error(
    `Gagal mengkonversi foto ke-${index + 1}. Hapus foto tersebut dan coba foto ulang.`,
  );
}

/**
 * Convert single image URI ke base64 data URI.
 */
export async function convertImageToBase64(uri: string): Promise<string> {
  return convertSingleImage(uri, 0);
}

/**
 * Convert multiple image URIs ke base64 — sequential, supaya error per-foto
 * lebih mudah di-debug (vs Promise.all yang short-circuit).
 */
export async function convertImagesToBase64(uris: string[]): Promise<string[]> {
  const results: string[] = [];
  for (let i = 0; i < uris.length; i++) {
    const base64 = await convertSingleImage(uris[i], i);
    results.push(base64);
  }
  return results;
}
