import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type MutableRefObject,
} from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewStyle,
  findNodeHandle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'dotlottie-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export type Dotlottie = {
  play: () => void;
  pause: () => void;
  stop: () => void;
};

interface DotlottieReactNativeProps {
  source: string;
  loop?: boolean;
  autoplay?: boolean;
  style: ViewStyle;
  ref?: MutableRefObject<any>;
}

const COMMAND_PLAY = 'play';
const COMMAND_PAUSE = 'pause';
const COMMAND_STOP = 'stop';

const ComponentName = 'DotlottieReactNativeView';

const NativeViewManager = UIManager.getViewManagerConfig(ComponentName);

const DotlottieReactNativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<DotlottieReactNativeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const DotLottie = forwardRef((props: DotlottieReactNativeProps, ref) => {
  const nativeRef = useRef(null);

  const playWithUIManager = useCallback(() => {
    const command = NativeViewManager.Commands[COMMAND_PLAY];
    if (command) {
      return UIManager.dispatchViewManagerCommand(
        findNodeHandle(nativeRef.current),
        command,
        []
      );
    }
  }, []);

  const pauseWithUIManager = useCallback(() => {
    const command = NativeViewManager.Commands[COMMAND_PAUSE];
    if (command) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(nativeRef.current),
        command,
        []
      );
    }
  }, []);

  const stopWithUIManager = useCallback(() => {
    const command = NativeViewManager.Commands[COMMAND_STOP];
    if (command) {
      return UIManager.dispatchViewManagerCommand(
        findNodeHandle(nativeRef.current),
        command,
        []
      );
    }
  }, []);

  useImperativeHandle(ref, () => ({
    play: playWithUIManager,
    pause: pauseWithUIManager,
    stop: stopWithUIManager,
  }));
  return (
    <DotlottieReactNativeView
      ref={nativeRef}
      loop={false}
      autoplay={false}
      {...props}
    />
  );
});
