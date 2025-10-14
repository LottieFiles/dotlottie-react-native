# dotLottie React Native

Lottie & dotLottie component for React Native ([iOS](https://github.com/LottieFiles/dotlottie-ios/), [Android](https://github.com/LottieFiles/dotlottie-android/), and [Web](https://github.com/LottieFiles/dotlottie-web))

## Installation

### npm

```sh
npm install @lottiefiles/dotlottie-react-native
```

### yarn

```sh
yarn add @lottiefiles/dotlottie-react-native
```

### Pod Installation (iOS)

To support iOS 15.4, ensure your `Podfile` specifies the platform version:

```ruby
platform :ios, '15.4'
```

After installing the package, navigate to the `ios` directory and install the pods:

```sh
cd ios
pod install
```

### Metro Configuration

To support `.lottie` files, update your `metro.config.js`:

```javascript
// metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    resolver: {
      assetExts: [...assetExts, 'lottie'],
    },
  };
})();
```

### Expo Configuration

If you're using Expo, you need to prebuild to generate the `ios` and `android` folders:

```sh
expo prebuild
```

### Web Support

This package supports React Native Web out of the box. The web implementation uses [@lottiefiles/dotlottie-react](https://www.npmjs.com/package/@lottiefiles/dotlottie-react) under the hood.

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

## Props and Methods

| Prop/Method                         | Type                           | Default Value | Description                                                       |
| ----------------------------------- | ------------------------------ | ------------- | ----------------------------------------------------------------- |
| `source`                            | `{ uri: string }` or `require` | **Required**  | Specifies the animation file to be loaded.                        |
| `style`                             | `StyleProp<ViewStyle>`         | `undefined`   | Custom styles for the animation container.                        |
| `loop`                              | `boolean`                      | `false`       | Determines if the animation should loop continuously.             |
| `autoplay`                          | `boolean`                      | `false`       | Determines if the animation should start playing automatically.   |
| `ref`                               | `React.RefObject<Dotlottie>`   | `null`        | Reference to control the animation programmatically.              |
| `play()`                            | `function`                     | N/A           | Starts playing the animation.                                     |
| `pause()`                           | `function`                     | N/A           | Pauses the animation.                                             |
| `stop()`                            | `function`                     | N/A           | Stops the animation and resets to the beginning.                  |
| `setLoop(loop: boolean)`            | `function`                     | N/A           | Sets the looping behavior of the animation.                       |
| `setSpeed(speed: number)`           | `function`                     | N/A           | Sets the playback speed of the animation.                         |
| `setPlayMode(mode: Mode)`           | `function`                     | N/A           | Sets the play mode (`FORWARD` or `REVERSE`) of the animation.     |
| `startStateMachine(name: string)`   | `function`                     | N/A           | Initiates a state machine by name for advanced animation control. |
| `removeStateMachineEventListener()` | `function`                     | N/A           | Removes event listeners associated with the state machine.        |
| `stopStateMachine()`                | `function`                     | N/A           | Stops the state machine controlling the animation.                |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
