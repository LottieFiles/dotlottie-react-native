import { Image } from 'react-native';

function parseSource(
  source: { uri: string } | string | number
): string | undefined {
  const uri = (source as any).uri;

  if (typeof source === 'object' && uri) {
    return uri;
  }

  if (typeof source === 'number') {
    return Image.resolveAssetSource(source).uri;
  }

  return undefined;
}

/** Decodes base64, or a base64 `data:` URI, into bytes. Returns `undefined` if it is not valid. */
function decodeBase64(value: string): Uint8Array | undefined {
  const base64 = value.startsWith('data:')
    ? value.slice(value.indexOf(',') + 1)
    : value;

  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return undefined;
  }
}

export { parseSource, decodeBase64 };
