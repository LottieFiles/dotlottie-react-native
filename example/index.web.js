import { AppRegistry } from 'react-native';
import App from './App';

const appName = 'example';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
