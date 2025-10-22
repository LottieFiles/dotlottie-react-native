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

Expo projects must include the native binaries before this library can render animations. We ship a config plugin scaffold (`withDotLottie`) so Expo developers can prepare builds with minimal setup.

1. **Add the plugin** – the package already declares it under the `expo.plugins` field, so it is applied automatically. To customize behaviour, you can reference it explicitly in `app.json`:

   ```json
   {
     "expo": {
       "plugins": ["@lottiefiles/dotlottie-react-native/plugin"]
     }
   }
   ```

2. **Generate native projects** – run `expo prebuild` (or initialise a development build if you haven’t already):

   ```sh
   expo prebuild
   ```

3. **Create a development build** – install the native code with `expo run:ios` / `expo run:android`, or your preferred EAS build workflow. Expo Go does not bundle the DotLottie native module.

> Tip: this repository ships an Expo dev-client harness under `expo-example/`. Use it to exercise the config plugin locally with `yarn workspace dotlottie-react-native-expo-example prebuild`.

#### Managed workflow fallback

If you must stay in Expo Go, fall back to the web implementation shipped in this package (or the underlying `@lottiefiles/dotlottie-react`) until a native build is available:

```tsx
import { Platform } from 'react-native';
import { DotLottie as DotLottieNative } from '@lottiefiles/dotlottie-react-native';
import { DotLottie as DotLottieWeb } from '@lottiefiles/dotlottie-react';

export const DotLottie = Platform.select({
  ios: DotLottieNative,
  android: DotLottieNative,
  default: DotLottieWeb,
});
```

This keeps the API surface consistent while you work entirely in Expo Go. Once you produce a dev build, swap back to the native export everywhere or gate the fallback behind feature flags.

### Web Support

This package supports React Native Web out of the box. The web implementation uses [@lottiefiles/dotlottie-react](https://www.npmjs.com/package/@lottiefiles/dotlottie-react) under the hood.

## React Native New Architecture

`@lottiefiles/dotlottie-react-native` now ships with a Legacy Interop bridge so the same component works on both Paper and Fabric. Paper remains the default on every platform, and you can opt-in to the new architecture per-app.

- **iOS:** enable Fabric by turning on `RCT_NEW_ARCH_ENABLED` before running `pod install`. For example:

  ```sh
  cd ios
  RCT_NEW_ARCH_ENABLED=1 bundle exec pod install
  ```

  Clearing the flag (or setting it to `0`) keeps the Paper manager in place. No changes are required to continue using Paper.

- **Android:** toggle the architecture by setting `newArchEnabled=true` in `android/gradle.properties`, or pass `-PnewArchEnabled=true`/`false` (or `ORG_GRADLE_PROJECT_newArchEnabled=...`) on the Gradle command line.

The repository’s example app exposes Yarn scripts to exercise each mode:

```sh
yarn ios:paper         # Paper build
yarn ios:fabric        # Fabric build
yarn android:paper     # Paper build
yarn android:fabric    # Fabric build
```

Use the matching `:build` variants (for example, `yarn ios:fabric:build`) when you only need to compile instead of launching the simulator/emulator.

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

| Prop                    | Type                        | Default Value | Description                                                            |
| ----------------------- | --------------------------- | ------------- | ---------------------------------------------------------------------- |
| `source`                | `string \| { uri: string }` | **Required**  | Specifies the animation file to be loaded (local or remote URL).       |
| `style`                 | `ViewStyle`                 | `undefined`   | Custom styles for the animation container.                             |
| `loop`                  | `boolean`                   | `false`       | Determines if the animation should loop continuously.                  |
| `autoplay`              | `boolean`                   | `false`       | Determines if the animation should start playing automatically.        |
| `speed`                 | `number`                    | `1.0`         | The playback speed of the animation (e.g., 0.5, 1, 2).                 |
| `playMode`              | `Mode`                      | `FORWARD`     | The play mode: `FORWARD`, `REVERSE`, `BOUNCE`, `REVERSE_BOUNCE`.       |
| `useFrameInterpolation` | `boolean`                   | `false`       | Enables frame interpolation for smoother animations.                   |
| `segment`               | `[number, number]`          | `undefined`   | Specifies a segment of the animation to play `[startFrame, endFrame]`. |
| `marker`                | `string`                    | `undefined`   | Specifies a marker to use for playback.                                |
| `themeId`               | `string`                    | `undefined`   | The theme ID to apply to the animation.                                |
| `stateMachineId`        | `string`                    | `undefined`   | The ID of the state machine to load and start automatically.           |

### Methods

Access these methods via a ref:

```typescript
const ref = useRef<Dotlottie>(null);
ref.current?.play();
```

| Method                                                     | Description                                      |
| ---------------------------------------------------------- | ------------------------------------------------ |
| `play()`                                                   | Starts playing the animation.                    |
| `pause()`                                                  | Pauses the animation.                            |
| `stop()`                                                   | Stops the animation and resets to the beginning. |
| `setLoop(loop: boolean)`                                   | Sets the looping behavior of the animation.      |
| `setSpeed(speed: number)`                                  | Sets the playback speed of the animation.        |
| `setPlayMode(mode: Mode)`                                  | Sets the play mode of the animation.             |
| `setFrame(frame: number)`                                  | Sets the current frame of the animation.         |
| `freeze()`                                                 | Freezes the animation at the current frame.      |
| `unfreeze()`                                               | Unfreezes the animation.                         |
| `resize(width: number, height: number)`                    | Resizes the animation viewport.                  |
| `setSegment(start: number, end: number)`                   | Sets a segment of the animation to play.         |
| `setMarker(marker: string)`                                | Sets a marker for playback.                      |
| `setTheme(themeId: string)`                                | Applies a theme to the animation.                |
| `loadAnimation(animationId: string)`                       | Loads a specific animation by ID.                |
| `stateMachineStart()`                                      | Starts the state machine.                        |
| `stateMachineStop()`                                       | Stops the state machine.                         |
| `stateMachineLoad(stateMachineId: string)`                 | Loads a state machine by ID.                     |
| `stateMachineFire(event: string)`                          | Fires an event in the state machine.             |
| `stateMachineSetNumericInput(key: string, value: number)`  | Sets a numeric input value in the state machine. |
| `stateMachineSetStringInput(key: string, value: string)`   | Sets a string input value in the state machine.  |
| `stateMachineSetBooleanInput(key: string, value: boolean)` | Sets a boolean input value in the state machine. |

### Events

| Event                                  | Description                                                   |
| -------------------------------------- | ------------------------------------------------------------- |
| `onLoad?: () => void`                  | Called when the animation is loaded.                          |
| `onComplete?: () => void`              | Called when the animation completes.                          |
| `onLoadError?: () => void`             | Called when there's an error loading the animation.           |
| `onPlay?: () => void`                  | Called when the animation starts playing.                     |
| `onPause?: () => void`                 | Called when the animation is paused.                          |
| `onStop?: () => void`                  | Called when the animation is stopped.                         |
| `onLoop?: (loopCount: number) => void` | Called when the animation loops, with the current loop count. |
| `onFrame?: (frameNo: number) => void`  | Called on each frame update.                                  |
| `onRender?: (frameNo: number) => void` | Called when a frame is rendered.                              |
| `onFreeze?: () => void`                | Called when the animation is frozen.                          |
| `onUnFreeze?: () => void`              | Called when the animation is unfrozen.                        |
| `onDestroy?: () => void`               | Called when the animation is destroyed.                       |

### State Machine Events

| Event                                                                                                  | Description                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `onStateMachineStart?: () => void`                                                                     | Called when the state machine starts.            |
| `onStateMachineStop?: () => void`                                                                      | Called when the state machine stops.             |
| `onStateMachineStateEntered?: (enteringState: string) => void`                                         | Called when entering a new state.                |
| `onStateMachineStateExit?: (leavingState: string) => void`                                             | Called when exiting a state.                     |
| `onStateMachineTransition?: (previousState: string, newState: string) => void`                         | Called during a state transition.                |
| `onStateMachineBooleanInputChange?: (inputName: string, oldValue: boolean, newValue: boolean) => void` | Called when a boolean input changes.             |
| `onStateMachineNumericInputChange?: (inputName: string, oldValue: number, newValue: number) => void`   | Called when a numeric input changes.             |
| `onStateMachineStringInputChange?: (inputName: string, oldValue: string, newValue: string) => void`    | Called when a string input changes.              |
| `onStateMachineInputFired?: (inputName: string) => void`                                               | Called when an input event is fired.             |
| `onStateMachineCustomEvent?: (message: string) => void`                                                | Called when a custom state machine event occurs. |
| `onStateMachineError?: (message: string) => void`                                                      | Called when a state machine error occurs.        |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
