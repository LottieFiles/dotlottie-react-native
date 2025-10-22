import type { ComponentProps } from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  DotLottie,
  type Dotlottie,
} from '@lottiefiles/dotlottie-react-native';

type EventLog = {
  id: number;
  label: string;
};

type InstrumentedProps = Omit<
  ComponentProps<typeof DotLottie>,
  'onLoad' | 'onComplete' | 'onDestroy' | 'onPause' | 'onPlay' | 'onStop'
> & {
  onInstanceMount?: () => void;
  onInstanceUnmount?: () => void;
  onLifecycleEvent: (label: string) => void;
};

const InstrumentedDotLottie = forwardRef<Dotlottie, InstrumentedProps>(
  (
    { onInstanceMount, onInstanceUnmount, onLifecycleEvent, ...props },
    forwardedRef
  ) => {
    useEffect(() => {
      onInstanceMount?.();
      return () => {
        onInstanceUnmount?.();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const emit = useCallback(
      (label: string) => {
        onLifecycleEvent(label);
      },
      [onLifecycleEvent]
    );

    return (
      <DotLottie
        {...props}
        ref={forwardedRef}
        onLoad={() => emit('onLoad')}
        onComplete={() => emit('onComplete')}
        onDestroy={() => emit('onDestroy')}
        onPause={() => emit('onPause')}
        onPlay={() => emit('onPlay')}
        onStop={() => emit('onStop')}
      />
    );
  }
);
InstrumentedDotLottie.displayName = 'InstrumentedDotLottie';

export function LifecycleExample() {
  const instanceRef = useRef<Dotlottie>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [instanceKey, setInstanceKey] = useState(0);
  const [mountCount, setMountCount] = useState(0);
  const [unmountCount, setUnmountCount] = useState(0);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [autoplay, setAutoplay] = useState(true);
  const eventIdRef = useRef(0);

  const appendEvent = useCallback((label: string) => {
    setEvents((prev) => {
      eventIdRef.current += 1;
      const entry: EventLog = {
        id: eventIdRef.current,
        label,
      };
      const next = [entry, ...prev];
      return next.slice(0, 20);
    });
  }, []);

  const statusSummary = useMemo(
    () =>
      `Mounted: ${mountCount} | Unmounted: ${unmountCount} | Visible: ${isVisible ? 'Yes' : 'No'
      } | Autoplay: ${autoplay ? 'On' : 'Off'}`,
    [mountCount, unmountCount, isVisible, autoplay]
  );

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const forceRemount = useCallback(() => {
    setInstanceKey((prev) => prev + 1);
    setIsVisible(true);
  }, []);

  const toggleAutoplay = useCallback(() => {
    setAutoplay((prev) => !prev);
  }, []);

  const fetchMetrics = useCallback(async () => {
    if (!instanceRef.current) {
      appendEvent('Metrics requested before mount');
      return;
    }

    try {
      const [
        totalFrames,
        duration,
        speed,
        currentFrame,
        paused,
        playing,
        stopped,
        loaded,
        themeId,
        animationId,
        loopCount,
      ] = await Promise.all([
        instanceRef.current.totalFrames(),
        instanceRef.current.duration(),
        instanceRef.current.speed(),
        instanceRef.current.currentFrame(),
        instanceRef.current.isPaused(),
        instanceRef.current.isPlaying(),
        instanceRef.current.isStopped(),
        instanceRef.current.isLoaded(),
        instanceRef.current.activeThemeId(),
        instanceRef.current.activeAnimationId(),
        instanceRef.current.loopCount(),
      ]);
      appendEvent(
        `Metrics duration=${duration.toFixed(2)}ms totalFrames=${totalFrames} speed=${speed.toFixed(2)} currentFrame=${currentFrame.toFixed(2)} paused=${paused} playing=${playing} stopped=${stopped} loaded=${loaded} themeId=${themeId || 'none'} animationId=${animationId || 'none'} loopCount=${loopCount}`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown metrics error';
      appendEvent(`Metrics error: ${message}`);
    }
  }, [appendEvent]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lifecycle Exerciser</Text>
      <Text style={styles.subtitle}>
        Toggle the animation visibility or force remounts to validate native
        teardown and reattachment on both platforms.
      </Text>

      <View style={styles.buttonRow}>
        <Button
          title={isVisible ? 'Hide Animation' : 'Show Animation'}
          onPress={toggleVisibility}
        />
        <View style={styles.buttonSpacer} />
        <Button title="Force Remount" onPress={forceRemount} />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Play" onPress={() => instanceRef.current?.play()} />
        <View style={styles.buttonSpacer} />
        <Button title="Pause" onPress={() => instanceRef.current?.pause()} />
        <View style={styles.buttonSpacer} />
        <Button title="Stop" onPress={() => instanceRef.current?.stop()} />
      </View>

      <View style={styles.buttonRow}>
        <Button
          title={`Autoplay: ${autoplay ? 'On' : 'Off'}`}
          onPress={toggleAutoplay}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Clear Log"
          onPress={() => {
            setEvents([]);
            eventIdRef.current = 0;
          }}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Fetch Metrics" onPress={fetchMetrics} />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{statusSummary}</Text>
      </View>

      <View style={styles.animationContainer}>
        {isVisible ? (
          <InstrumentedDotLottie
            key={instanceKey}
            ref={instanceRef}
            style={styles.dotLottie}
            source={require('../assets/star-rating.lottie')}
            autoplay={autoplay}
            loop
            onLifecycleEvent={(label) => appendEvent(label)}
            onInstanceMount={() => {
              setMountCount((prev) => prev + 1);
              appendEvent('React Mount');
            }}
            onInstanceUnmount={() => {
              setUnmountCount((prev) => prev + 1);
              appendEvent('React Unmount');
            }}
          />
        ) : null}
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Lifecycle Log</Text>
        <ScrollView style={styles.logScroll} contentContainerStyle={styles.logContent}>
          {events.length === 0 ? (
            <Text style={styles.logEmpty}>No events yet. Interact above to log events.</Text>
          ) : (
            events.map((event) => (
              <Text key={event.id} style={styles.logItem}>
                {event.label}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSpacer: {
    width: 12,
  },
  statusContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  statusText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 14,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dotLottie: {
    width: 100,
    height: 100,
  },
  logContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  logScroll: {
    flex: 1,
  },
  logContent: {
    paddingBottom: 20,
  },
  logItem: {
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    color: '#333',
    fontSize: 13,
  },
  logEmpty: {
    color: '#999',
    textAlign: 'center',
    fontSize: 13,
  },
});
