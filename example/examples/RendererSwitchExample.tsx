import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { DotLottie, type Renderer } from '@lottiefiles/dotlottie-react-native';

export function RendererSwitchExample() {
  const [renderer, setRenderer] = useState<Renderer>('sw');
  const [error, setError] = useState<string | null>(null);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {(['sw', 'gl', 'wg'] as Renderer[]).map(r => (
          <Button
            key={r}
            title={r}
            onPress={() => {
              setError(null);
              setRenderer(r);
            }}
          />
        ))}
      </View>
      <Text style={styles.label}>renderer: {renderer}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <DotLottie
        key={renderer}
        renderer={renderer}
        source={require('../assets/star-rating.lottie')}
        autoplay
        loop
        style={styles.player}
        onLoadError={() => setError(`load error (renderer=${renderer})`)}
      />
      <Text style={styles.note}>
        wg loads local and remote sources (requires dotlottie-ios 0.16.2+),
        including Metro-served assets in Debug.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 16, fontWeight: '600' },
  error: { color: 'red' },
  note: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  player: { width: 240, height: 240 },
});
