import { useMemo, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LifecycleExample } from './examples/LifecycleExample';
import { StateMachineExample } from './examples/StateMachineExample';

type ExampleDescriptor = {
  key: string;
  title: string;
  description: string;
  Component: React.ComponentType;
};

const EXAMPLES: ExampleDescriptor[] = [
  {
    key: 'state-machine',
    title: 'State Machine Playground',
    description:
      'Interactively tweak state machine props, segments, play mode, speed, and frame interpolation.',
    Component: StateMachineExample,
  },
  {
    key: 'lifecycle',
    title: 'Lifecycle Exerciser',
    description:
      'Stress mount/unmount flows to validate native resource cleanup and event consistency.',
    Component: LifecycleExample,
  },
];

export default function App() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const activeExample = useMemo(
    () => EXAMPLES.find((example) => example.key === activeKey) ?? null,
    [activeKey]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {activeExample ? (
        <View style={styles.exampleContainer}>
          <View style={styles.exampleHeader}>
            <Button
              title="Back to examples"
              onPress={() => setActiveKey(null)}
            />
            <Text style={styles.exampleTitle}>{activeExample.title}</Text>
            <Text style={styles.exampleDescription}>
              {activeExample.description}
            </Text>
          </View>
          <View style={styles.exampleContent}>
            <activeExample.Component />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.menuContent}>
          <Text style={styles.menuTitle}>DotLottie Example Scenarios</Text>
          <Text style={styles.menuSubtitle}>
            Pick an example to explore different integration paths and check
            native lifecycle behavior.
          </Text>
          {EXAMPLES.map((example) => (
            <View key={example.key} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{example.title}</Text>
                <Text style={styles.cardDescription}>{example.description}</Text>
              </View>
              <Button
                title="Open"
                onPress={() => setActiveKey(example.key)}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  menuContent: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
  },
  menuTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
  },
  menuSubtitle: {
    fontSize: 15,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
  },
  cardHeader: {
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  exampleContainer: {
    flex: 1,
  },
  exampleHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    gap: 8,
  },
  exampleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  exampleDescription: {
    fontSize: 14,
    color: '#555',
  },
  exampleContent: {
    flex: 1,
  },
});
