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
import type { Mode } from './constants';
import { parseSource } from './utils';

const LINKING_ERROR =
  `The package 'dotlottie-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export type Dotlottie = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setLoop: (value: boolean) => void;
  setSpeed: (value: number) => void;
  setPlayMode: (mode: Mode) => void;
  setFrame: (frame: number) => void;
  freeze: () => void;
  unfreeze: () => void;
};

interface DotlottieReactNativeProps {
  source: string | { uri: string };
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  style: ViewStyle;
  ref?: MutableRefObject<any>;
}

const COMMAND_PLAY = 'play';
const COMMAND_PAUSE = 'pause';
const COMMAND_STOP = 'stop';
const COMMAND_SET_LOOP = 'setLoop';
const COMMAND_SET_SPEED = 'setSpeed';
const COMMAND_SET_PLAY_MODE = 'setPlayMode';
const COMMAND_SET_FRAME = 'setFrame';
const COMMAND_FREEZE = 'freeze';
const COMMAND_UNFREEZE = 'unfreeze';

const ComponentName = 'DotlottieReactNativeView';

const NativeViewManager = UIManager.getViewManagerConfig(ComponentName);

console.log('NativeViewManager.Commands', NativeViewManager.Commands);

const DotlottieReactNativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<DotlottieReactNativeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const DotLottie = forwardRef(
  ({ source, ...props }: DotlottieReactNativeProps, ref) => {
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

    const setLoopWithUIManager = useCallback((value: boolean) => {
      const command = NativeViewManager.Commands[COMMAND_SET_LOOP];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [value]
        );
      }
    }, []);

    const setSpeedWithUIManager = useCallback((value: number) => {
      const command = NativeViewManager.Commands[COMMAND_SET_SPEED];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [value]
        );
      }
    }, []);

    const setPlayModeWithUIManager = useCallback((mode: Mode) => {
      const command = NativeViewManager.Commands[COMMAND_SET_PLAY_MODE];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [mode]
        );
      }
    }, []);

    const setFrameWithUIManager = useCallback((frame: number) => {
      const command = NativeViewManager.Commands[COMMAND_SET_FRAME];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [frame]
        );
      }
    }, []);

    const freezeWithUIManager = useCallback(() => {
      const command = NativeViewManager.Commands[COMMAND_FREEZE];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          []
        );
      }
    }, []);

    const unfreezeWithUIManager = useCallback(() => {
      const command = NativeViewManager.Commands[COMMAND_UNFREEZE];
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
      setLoop: setLoopWithUIManager,
      setSpeed: setSpeedWithUIManager,
      setPlayMode: setPlayModeWithUIManager,
      setFrame: setFrameWithUIManager,
      freeze: freezeWithUIManager,
      unfreeze: unfreezeWithUIManager,
    }));

    const parsedSource = parseSource(source);
    return (
      <DotlottieReactNativeView
        ref={nativeRef}
        loop={false}
        autoplay={false}
        source={parsedSource || ''}
        {...props}
      />
    );
  }
);
