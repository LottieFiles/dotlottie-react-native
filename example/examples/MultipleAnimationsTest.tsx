

import { DotLottie } from '@lottiefiles/dotlottie-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const TEST_ANIMATIONS = [
  {
    id: 'animation-1',
    source: 'https://lottie.host/50f65a48-2f50-432f-b47a-4e6b271625c0/O4jvHbwypB.lottie',
    label: 'Animation 1',
  },
  {
    id: 'animation-2',
    source: 'https://lottie.host/6037ce8d-16b8-4922-a013-bbb42336605d/rhoaleeUiW.lottie',
    label: 'Animation 2',
  },
  {
    id: 'animation-3',
    source: 'https://lottie.host/ecfc8e66-1a24-4723-90a5-d158bee66db4/kJfdmk9Rj6.lottie',
    label: 'Animation 3',
  },
];

export function MultipleAnimationsTest() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.animationGrid}>
        {TEST_ANIMATIONS.map((anim) => (
          <View key={anim.id} style={styles.animationCard}>
            <Text style={styles.label}>{anim.label}</Text>
            <DotLottie
              source={{
                uri: anim.source
              }}
              style={styles.animation}
              autoplay
              loop
              renderer='gl'
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  animationGrid: {
    gap: 16,
  },
  animationCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  animation: {
    width: 200,
    height: 200,
  },
  status: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
});
