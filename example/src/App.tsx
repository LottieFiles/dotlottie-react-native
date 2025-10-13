import { Button, StyleSheet, View } from 'react-native';
import {
  DotLottie,
  Mode,
  type Dotlottie,
} from '@lottiefiles/dotlottie-react-native';
import { useRef } from 'react';

export default function App() {
  const ref = useRef<Dotlottie>(null);

  return (
    <View style={styles.container}>
      <DotLottie
        ref={ref}
        source={require('../assets/pigeon_with_listeners.lottie')}
        style={styles.box}
        loop={false}
        autoplay={true}
        onPlay={() => console.log('onPlay')}
        onLoop={(loopCount) => console.log('onLoop', loopCount)}
        onPause={() => console.log('onPause')}
        onStop={() => console.log('onStop')}
        onTransition={(event) => console.log('onTransitionEnd', event)}
        onStateEntered={(event) => console.log('onStateEntered', event)}
      />

      <Button title="Play" onPress={() => ref.current?.play()} />
      <Button title="Pause" onPress={() => ref.current?.pause()} />
      <Button title="Stop" onPress={() => ref.current?.stop()} />
      <Button title="Loop" onPress={() => ref.current?.setLoop(true)} />
      <Button title="Speed" onPress={() => ref.current?.setSpeed(4)} />

      <Button
        title="FORWARD"
        onPress={() => ref.current?.setPlayMode(Mode.FORWARD)}
      />
      <Button
        title="REVERSE"
        onPress={() => ref.current?.setPlayMode(Mode.REVERSE)}
      />
      <Button
        title="START_STATE_MACHINE"
        onPress={() => ref.current?.startStateMachine('pigeon_fsm')}
      />

      <Button
        title="LOAD_STATE_MACHINE"
        onPress={() => ref.current?.loadStateMachine('pigeon_fsm')}
      />
      <Button
        title="REMOVE_STATE_MACHINE"
        onPress={() => ref.current?.removeStateMachineEventListener()}
      />

      <Button
        title="STOP_STATE_MACHINE"
        onPress={() => ref.current?.stopStateMachine()}
      />

      <Button title="post Event" onPress={() => ref.current?.postEvent(0, 0)} />
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
