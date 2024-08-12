import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'dotlottie-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type DotlottieReactNativeProps = {
  source: string;
  style: ViewStyle;
};

const ComponentName = 'DotlottieReactNativeView';

export const DotlottieReactNativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<DotlottieReactNativeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
