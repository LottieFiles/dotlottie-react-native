import { AppRegistry } from 'react-native';
import App from './src/App';

const appName = 'DotlottieReactNativeExample';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
