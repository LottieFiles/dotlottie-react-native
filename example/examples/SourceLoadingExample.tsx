import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DotLottie } from '@lottiefiles/dotlottie-react-native';

type LoadState = 'pending' | 'loaded' | 'error';

const STATUS_LABEL: Record<LoadState, string> = {
  pending: '… loading',
  loaded: '✅ loaded',
  error: '❌ load error',
};

function SourceCase({
  title,
  source,
}: {
  title: string;
  source: number | { uri: string };
}) {
  const [state, setState] = useState<LoadState>('pending');

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text
        style={[
          styles.status,
          state === 'loaded' && styles.statusOk,
          state === 'error' && styles.statusErr,
        ]}
      >
        {STATUS_LABEL[state]}
      </Text>
      <View style={styles.animationBox}>
        <DotLottie
          source={source}
          style={styles.animation}
          autoplay
          loop
          onLoad={() => setState('loaded')}
          onLoadError={() => setState('error')}
        />
      </View>
    </View>
  );
}

export function SourceLoadingExample() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SourceCase
        title="Local require() — regressed on Android release"
        source={require('../assets/star-rating.lottie')}
      />
      <SourceCase
        title="Remote HTTPS URL"
        source={{
          uri: 'https://lottie.host/50f65a48-2f50-432f-b47a-4e6b271625c0/O4jvHbwypB.lottie',
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  status: {
    fontSize: 14,
    color: '#888',
  },
  statusOk: {
    color: '#1a7f37',
    fontWeight: '600',
  },
  statusErr: {
    color: '#cf222e',
    fontWeight: '600',
  },
  animationBox: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
  },
  animation: {
    width: 180,
    height: 180,
  },
});
