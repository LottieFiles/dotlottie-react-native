import { Button, StyleSheet, View } from 'react-native';
import { DotLottie, Mode, type Dotlottie } from 'dotlottie-react-native';
import { useRef } from 'react';

export default function App() {
  const ref = useRef<Dotlottie>(null);

  return (
    <View style={styles.container}>
      <DotLottie
        ref={ref}
        source={{
          uri: 'https://lottie.host/3a34a38a-e52f-486f-8709-3063f9d18af9/1tzAlg30dp.json',
        }}
        style={styles.box}
        loop={true}
        autoplay={true}
        onPlay={(a) => console.log('onPlay', a.nativeEvent)}
        onLoop={(a) => console.log('onLoop', a)}
        onPause={() => console.log('onPause')}
        onStop={() => console.log('onStop')}
        onTransition={(event) => console.log('onTransitionEnd', event)}
        onStateEntered={(event) => console.log('onStateEntered', event)}
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
