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

## API Reference

### Props

| Prop                     | Type                           | Default Value | Description                                                         |
| ------------------------ | ------------------------------ | ------------- | ------------------------------------------------------------------- |
| `source`                 | `string \| { uri: string }`    | **Required**  | Specifies the animation file to be loaded (local or remote URL).    |
| `style`                  | `ViewStyle`                    | `undefined`   | Custom styles for the animation container.                          |
| `loop`                   | `boolean`                      | `false`       | Determines if the animation should loop continuously.               |
| `autoplay`               | `boolean`                      | `false`       | Determines if the animation should start playing automatically.     |
| `speed`                  | `number`                       | `1.0`         | The playback speed of the animation (e.g., 0.5, 1, 2).              |
| `playMode`               | `Mode`                         | `FORWARD`     | The play mode: `FORWARD`, `REVERSE`, `BOUNCE`, `REVERSE_BOUNCE`.   |
| `useFrameInterpolation`  | `boolean`                      | `false`       | Enables frame interpolation for smoother animations.                |
| `segment`                | `[number, number]`             | `undefined`   | Specifies a segment of the animation to play `[startFrame, endFrame]`. |
| `marker`                 | `string`                       | `undefined`   | Specifies a marker to use for playback.                             |
| `themeId`                | `string`                       | `undefined`   | The theme ID to apply to the animation.                             |
| `stateMachineId`         | `string`                       | `undefined`   | The ID of the state machine to load and start automatically.        |

### Methods

Access these methods via a ref:

```typescript
const ref = useRef<Dotlottie>(null);
ref.current?.play();
```

| Method                                                          | Description                                                      |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| `play()`                                                        | Starts playing the animation.                                    |
| `pause()`                                                       | Pauses the animation.                                            |
| `stop()`                                                        | Stops the animation and resets to the beginning.                 |
| `setLoop(loop: boolean)`                                        | Sets the looping behavior of the animation.                      |
| `setSpeed(speed: number)`                                       | Sets the playback speed of the animation.                        |
| `setPlayMode(mode: Mode)`                                       | Sets the play mode of the animation.                             |
| `setFrame(frame: number)`                                       | Sets the current frame of the animation.                         |
| `freeze()`                                                      | Freezes the animation at the current frame.                      |
| `unfreeze()`                                                    | Unfreezes the animation.                                         |
| `resize(width: number, height: number)`                         | Resizes the animation viewport.                                  |
| `setSegment(start: number, end: number)`                        | Sets a segment of the animation to play.                         |
| `setMarker(marker: string)`                                     | Sets a marker for playback.                                      |
| `setTheme(themeId: string)`                                     | Applies a theme to the animation.                                |
| `loadAnimation(animationId: string)`                            | Loads a specific animation by ID.                                |
| `stateMachineStart()`                                           | Starts the state machine.                                        |
| `stateMachineStop()`                                            | Stops the state machine.                                         |
| `stateMachineLoad(stateMachineId: string)`                      | Loads a state machine by ID.                                     |
| `stateMachineFire(event: string)`                               | Fires an event in the state machine.                             |
| `stateMachineSetNumericInput(key: string, value: number)`       | Sets a numeric input value in the state machine.                 |
| `stateMachineSetStringInput(key: string, value: string)`        | Sets a string input value in the state machine.                  |
| `stateMachineSetBooleanInput(key: string, value: boolean)`      | Sets a boolean input value in the state machine.                 |

### Events

| Event                                                                     | Description                                                      |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `onLoad?: () => void`                                                     | Called when the animation is loaded.                             |
| `onComplete?: () => void`                                                 | Called when the animation completes.                             |
| `onLoadError?: () => void`                                                | Called when there's an error loading the animation.              |
| `onPlay?: () => void`                                                     | Called when the animation starts playing.                        |
| `onPause?: () => void`                                                    | Called when the animation is paused.                             |
| `onStop?: () => void`                                                     | Called when the animation is stopped.                            |
| `onLoop?: (loopCount: number) => void`                                    | Called when the animation loops, with the current loop count.    |
| `onFrame?: (frameNo: number) => void`                                     | Called on each frame update.                                     |
| `onRender?: (frameNo: number) => void`                                    | Called when a frame is rendered.                                 |
| `onFreeze?: () => void`                                                   | Called when the animation is frozen.                             |
| `onUnFreeze?: () => void`                                                 | Called when the animation is unfrozen.                           |
| `onDestroy?: () => void`                                                  | Called when the animation is destroyed.                          |

### State Machine Events

| Event                                                                                         | Description                                                      |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `onStateMachineStart?: () => void`                                                            | Called when the state machine starts.                            |
| `onStateMachineStop?: () => void`                                                             | Called when the state machine stops.                             |
| `onStateMachineStateEntered?: (enteringState: string) => void`                                | Called when entering a new state.                                |
| `onStateMachineStateExit?: (leavingState: string) => void`                                    | Called when exiting a state.                                     |
| `onStateMachineTransition?: (previousState: string, newState: string) => void`                | Called during a state transition.                                |
| `onStateMachineBooleanInputChange?: (inputName: string, oldValue: boolean, newValue: boolean) => void` | Called when a boolean input changes.                    |
| `onStateMachineNumericInputChange?: (inputName: string, oldValue: number, newValue: number) => void`   | Called when a numeric input changes.                    |
| `onStateMachineStringInputChange?: (inputName: string, oldValue: string, newValue: string) => void`    | Called when a string input changes.                     |
| `onStateMachineInputFired?: (inputName: string) => void`                                      | Called when an input event is fired.                             |
| `onStateMachineCustomEvent?: (message: string) => void`                                       | Called when a custom state machine event occurs.                 |
| `onStateMachineError?: (message: string) => void`                                             | Called when a state machine error occurs.                        |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
