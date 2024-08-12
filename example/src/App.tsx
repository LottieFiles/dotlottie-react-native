import { StyleSheet, View } from 'react-native';
import { DotlottieReactNativeView } from 'dotlottie-react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <DotlottieReactNativeView
        source="https://lottie.host/3a34a38a-e52f-486f-8709-3063f9d18af9/1tzAlg30dp.json"
        style={styles.box}
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
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
