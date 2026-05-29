import { useCallback, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DotLottie } from '@lottiefiles/dotlottie-react-native';

type LoadState = 'pending' | 'loaded' | 'error';

type VisitRecord = {
  visitNumber: number;
  loadState: LoadState;
};

function AnimationScreen({
  visitNumber,
  onBack,
  onVisitComplete,
}: {
  visitNumber: number;
  onBack: (loadState: LoadState) => void;
  onVisitComplete: (record: VisitRecord) => void;
}) {
  const [loadState, setLoadState] = useState<LoadState>('pending');

  const handleBack = useCallback(() => {
    onVisitComplete({ visitNumber, loadState });
    onBack(loadState);
  }, [visitNumber, loadState, onBack, onVisitComplete]);

  return (
    <View style={styles.screen}>
      <View style={styles.screenHeader}>
        <Button title="← Back" onPress={handleBack} />
        <Text style={styles.visitBadge}>Visit #{visitNumber}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text
          style={[
            styles.statusLabel,
            loadState === 'loaded' && styles.statusOk,
            loadState === 'error' && styles.statusErr,
          ]}
        >
          {loadState === 'pending'
            ? '… loading'
            : loadState === 'loaded'
            ? '✅ Loaded successfully'
            : '❌ Load error — bug reproduced'}
        </Text>
        {loadState === 'loaded' && visitNumber > 1 && (
          <Text style={styles.successNote}>
            Animation loaded on revisit #{visitNumber}. Bug not triggered this time.
          </Text>
        )}
        {loadState === 'error' && (
          <Text style={styles.errorNote}>
            onLoadError fired on visit #{visitNumber}. Navigate back and check
            the log. On iOS this usually manifests as an EXC_BAD_ACCESS crash
            before this event even fires.
          </Text>
        )}
      </View>

      <View style={styles.animationBox}>
        <DotLottie
          source={require('../assets/star-rating.lottie')}
          style={styles.animation}
          autoplay
          loop
          onLoad={() => setLoadState('loaded')}
          onLoadError={() => setLoadState('error')}
        />
      </View>

      <Text style={styles.instruction}>
        Animation playing? Tap "← Back" then re-open this screen to trigger
        the crash (iOS) or blank view (Android).
      </Text>
    </View>
  );
}

export function NavigationCrashExample() {
  const [visitNumber, setVisitNumber] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [history, setHistory] = useState<VisitRecord[]>([]);

  const openAnimation = useCallback(() => {
    setVisitNumber((n) => n + 1);
    setShowAnimation(true);
  }, []);

  const handleBack = useCallback(() => {
    setShowAnimation(false);
  }, []);

  const recordVisit = useCallback((record: VisitRecord) => {
    setHistory((prev) => [record, ...prev]);
  }, []);

  if (showAnimation) {
    return (
      <AnimationScreen
        key={visitNumber}
        visitNumber={visitNumber}
        onBack={handleBack}
        onVisitComplete={recordVisit}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.menu}>
      <Text style={styles.title}>Navigation Crash Repro</Text>
      <Text style={styles.description}>
        Reproduces the bug reported when navigating away from and back to a
        screen that contains a DotLottie loaded from a local bundled asset.
        {'\n\n'}
        iOS: EXC_BAD_ACCESS crash inside DotLottiePlayerBridge.loadDotlottieData
        {'\n'}
        Android: blank view — animation silently fails to render on revisit
        {'\n\n'}
        Steps to reproduce:{'\n'}
        1. Tap "Open Animation Screen"{'\n'}
        2. Wait for the ✅ loaded status{'\n'}
        3. Tap "← Back"{'\n'}
        4. Tap "Open Animation Screen" again{'\n'}
        5. Observe crash (iOS) or blank view (Android)
      </Text>

      <Button title="Open Animation Screen" onPress={openAnimation} />

      {history.length > 0 && (
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Visit History</Text>
          {history.map((record) => (
            <View key={record.visitNumber} style={styles.historyRow}>
              <Text style={styles.historyVisit}>Visit #{record.visitNumber}</Text>
              <Text
                style={[
                  styles.historyState,
                  record.loadState === 'loaded' && styles.statusOk,
                  record.loadState === 'error' && styles.statusErr,
                  record.loadState === 'pending' && styles.statusPending,
                ]}
              >
                {record.loadState}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  visitBadge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  statusOk: {
    color: '#1a7f37',
  },
  statusErr: {
    color: '#cf222e',
  },
  statusPending: {
    color: '#888',
  },
  successNote: {
    fontSize: 13,
    color: '#555',
  },
  errorNote: {
    fontSize: 13,
    color: '#cf222e',
  },
  animationBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  animation: {
    width: 180,
    height: 180,
  },
  instruction: {
    marginHorizontal: 16,
    marginTop: 16,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  menu: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  historyVisit: {
    fontSize: 14,
    color: '#333',
  },
  historyState: {
    fontSize: 14,
    fontWeight: '500',
  },
});
