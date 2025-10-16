import { Button, StyleSheet, View, Text, ScrollView } from 'react-native';
import {
  DotLottie,
  Mode,
  type Dotlottie,
} from '@lottiefiles/dotlottie-react-native';
import { useRef, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

const modeData = [
  { label: 'Forward', value: Mode.FORWARD },
  { label: 'Reverse', value: Mode.REVERSE },
  { label: 'Bounce', value: Mode.BOUNCE },
  { label: 'Reverse Bounce', value: Mode.REVERSE_BOUNCE },
];

export default function App() {
  const ref = useRef<Dotlottie>(null);

  const [autoplay, setAutoplay] = useState(true);
  const [loop, setLoop] = useState(true);
  const [segment, setSegment] = useState<[number, number] | undefined>(
    undefined
  );
  const [playMode, setPlayMode] = useState<Mode>(Mode.FORWARD);
  const [speed, setSpeed] = useState(1);
  const [useFrameInterpolation, setUseFrameInterpolation] = useState(false);
  const [show, setShow] = useState(false);

  const stop = () => {
    ref.current?.stop();
  };

  const play = () => {
    ref.current?.play();
  };

  const pause = () => {
    ref.current?.pause();
  };

  const toggleLoop = () => {
    setLoop((prev) => !prev);
  };

  const incrementSpeed = () => {
    setSpeed((prev) => prev + 0.5);
  };

  const decrementSpeed = () => {
    setSpeed((prev) => (prev - 0.5 <= 0 ? 0.5 : prev - 0.5));
  };

  const toggleSegment = () => {
    setSegment((prev) => (prev ? undefined : [10, 50]));
  };

  const toggleAutoplay = () => {
    setAutoplay((prev) => !prev);
  };

  const toggleFrameInterpolation = () => {
    setUseFrameInterpolation((prev) => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          {show ? (
            <DotLottie
              ref={ref}
              style={styles.box}
              source={require('../assets/star-rating.lottie')}
              stateMachineId="star-rating"
              onStateMachineStart={() => console.log('State Machine Started')}
              onStateMachineStop={() => console.log('State Machine Stopped')}
              onStateMachineStateEntered={(state) =>
                console.log('State Machine State Entered: ', state)
              }
              onStateMachineStateExit={(state) => {
                console.log('State Machine State Exit:', state);
              }}
              onStateMachineError={(error) => {
                console.log('State Machine Error: ', error);
              }}
            />
          ) : null}
        </View>

        <View style={styles.controls}>
          <Button
            onPress={() => setShow((prev) => !prev)}
            title={show ? 'Hide Animation' : 'Show Animation'}
          />
          <View style={styles.spacer} />
          <Button
            onPress={() => ref.current?.stateMachineStop()}
            title="stateMachineStop"
          />
          <View style={styles.spacer} />
          <Button
            onPress={() => {
              ref.current?.stateMachineLoad('star-rating');
              ref.current?.stateMachineStart();
            }}
            title="stateMachineStart"
          />
          <View style={styles.spacer} />
          <Text style={styles.label}>Play Mode</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={modeData}
            labelField="label"
            valueField="value"
            placeholder="Select play mode"
            value={playMode}
            onChange={(item) => {
              setPlayMode(item.value);
            }}
          />

          <View style={styles.spacer} />

          <Button
            onPress={toggleAutoplay}
            title={`Autoplay: ${autoplay ? 'On' : 'Off'}`}
          />
          <View style={styles.spacer} />
          <Button onPress={play} title={'Play'} />
          <View style={styles.spacer} />
          <Button onPress={pause} title={'Pause'} />
          <View style={styles.spacer} />
          <Button onPress={stop} title={'Stop'} />
          <View style={styles.spacer} />
          <Button onPress={toggleLoop} title={`Loop: ${loop ? 'On' : 'Off'}`} />
          <View style={styles.spacer} />
          <Button onPress={incrementSpeed} title={`Speed +`} />
          <View style={styles.spacer} />
          <Button onPress={decrementSpeed} title={`Speed -`} />
          <View style={styles.spacer} />

          <Button
            onPress={toggleSegment}
            title={`Segment: ${segment ? `[${segment[0]}-${segment[1]}]` : 'Full'}`}
          />
          <View style={styles.spacer} />

          <Button
            onPress={toggleFrameInterpolation}
            title={`Frame Interpolation: ${useFrameInterpolation ? 'On' : 'Off'}`}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>Current State:</Text>
          <Text style={styles.infoDetail}>
            Autoplay: {autoplay ? 'true' : 'false'}
          </Text>
          <Text style={styles.infoDetail}>Loop: {loop ? 'true' : 'false'}</Text>
          <Text style={styles.infoDetail}>
            Play Mode: {modeData.find((m) => m.value === playMode)?.label}
          </Text>
          <Text style={styles.infoDetail}>Speed: {speed.toFixed(1)}x</Text>
          <Text style={styles.infoDetail}>
            Segment: {segment ? `[${segment[0]}, ${segment[1]}]` : 'null'}
          </Text>
          <Text style={styles.infoDetail}>
            Frame Interpolation: {useFrameInterpolation ? 'true' : 'false'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  animationContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  box: {
    width: 200,
    height: 200,
  },
  controls: {
    width: '100%',
    maxWidth: 400,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  spacer: {
    height: 8,
  },
  info: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  infoDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});
