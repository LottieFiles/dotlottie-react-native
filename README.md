# dotLottie React Native

## Installation

```sh
npm install @lottiefiles/dotlottie-react-native
```

## Usage

```ts
import { Button, StyleSheet, View } from 'react-native';
import { DotLottie, Mode, type Dotlottie } from '@lottiefiles/dotlottie-react-native';
import { useRef } from 'react';

export default function App() {
  const ref = useRef<Dotlottie>(null);

  return (
    <View style={styles.container}>
      <DotLottie
        ref={ref}
        source={require('../assets/animation.lottie')}
        style={styles.box}
        loop={false}
        autoplay={false}
      />
      <Button title="Play" onPress={() => ref.current?.play()} />
      <Button title="Pause" onPress={() => ref.current?.pause()} />
      <Button title="Stop" onPress={() => ref.current?.stop()} />
      <Button title="Loop" onPress={() => ref.current?.setLoop(true)} />
      <Button title="Speed" onPress={() => ref.current?.setSpeed(1)} />
      <Button
        title="FORWARD"
        onPress={() => ref.current?.setPlayMode(Mode.FORWARD)}
      />
      <Button
        title="REVERSE"
        onPress={() => ref.current?.setPlayMode(Mode.REVERSE)}
      />
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
