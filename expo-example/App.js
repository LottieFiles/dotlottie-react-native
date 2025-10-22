import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DotLottie } from '@lottiefiles/dotlottie-react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <DotLottie
        style={styles.animationContainer}
        source={{
          uri: 'https://lottie.host/294b684d-d6b4-4116-ab35-85ef566d4379/VkGHcqcMUI.lottie',
        }}
        autoPlay
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
