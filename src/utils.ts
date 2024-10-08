import { Image } from 'react-native';

function parseSource(source: { uri: string } | string): string | undefined {
  const uri = (source as any).uri;

  if (typeof source === 'object' && uri) {
    return uri;
  }

  if (typeof source === 'number') {
    console.log('numberSOurce', Image.resolveAssetSource(source).uri);
    return Image.resolveAssetSource(source).uri;
  }

  return undefined;
}

export { parseSource };
