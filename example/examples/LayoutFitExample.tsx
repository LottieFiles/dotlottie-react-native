import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DotLottie, type Fit } from '@lottiefiles/dotlottie-react-native';

const FITS: Fit[] = [
  'contain',
  'cover',
  'fill',
  'fit-width',
  'fit-height',
  'none',
];

export function LayoutFitExample() {
  const [fit, setFit] = useState<Fit>('cover');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.hint}>
        The stage below is intentionally wide (2:1). Switch the fit mode and
        watch the square animation fill, crop, stretch, or letterbox it.
      </Text>

      <View style={styles.fitRow}>
        {FITS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.chip, fit === option && styles.chipActive]}
            onPress={() => setFit(option)}
          >
            <Text
              style={[styles.chipText, fit === option && styles.chipTextActive]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.stage}>
        <DotLottie
          source={require('../assets/star-rating.lottie')}
          style={styles.animation}
          autoplay
          loop
          layout={{ fit }}
        />
      </View>

      <Text style={styles.current}>{`layout={{ fit: '${fit}' }}`}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  hint: {
    fontSize: 14,
    color: '#555',
  },
  fitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e6e6e6',
  },
  chipActive: {
    backgroundColor: '#1a7f37',
  },
  chipText: {
    fontSize: 13,
    color: '#333',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  stage: {
    width: '100%',
    aspectRatio: 2,
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  animation: {
    flex: 1,
  },
  current: {
    fontSize: 13,
    color: '#888',
  },
});
