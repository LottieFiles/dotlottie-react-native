import { Button, StyleSheet, View } from 'react-native';
import { DotLottie, type Dotlottie } from 'dotlottie-react-native';
import { useRef } from 'react';

export default function App() {
  const ref = useRef<Dotlottie>(null);

  return (
    <View style={styles.container}>
      <DotLottie
        ref={ref}
        source="https://lottie.host/80de4a37-cdb8-4b91-b864-6428bb13f468/WINl04NyRy.json"
        style={styles.box}
        loop={true}
        autoplay={false}
      />
      <Button title="Play" onPress={() => ref.current?.play()} />
      <Button title="Pause" onPress={() => ref.current?.pause()} />
      <Button title="Stop" onPress={() => ref.current?.stop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
