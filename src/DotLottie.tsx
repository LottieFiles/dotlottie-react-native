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
  startStateMachine: () => void;
  stopStateMachine: () => void;
  loadStateMachine: (stateMachineId: string) => void;
  setPostEvent: (event: string) => void;
  addStateMachineEventListener: () => void;
  removeStateMachineEventListener: () => void;
  resize: (width: number, height: number) => void;
  setSegment: (start: number, end: number) => void;
  setMarker: (marker: string) => void;
  loadTheme: (themeId: string) => void;
  loadAnimation: (animationId: string) => void;
  setManifest: () => void;
};

interface DotlottieReactNativeProps {
  source: string | { uri: string };
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  themeId?: string;
  marker?: string;
  segment?: number[];
  playMode?: Mode;
  style: ViewStyle;
  ref?: MutableRefObject<any>;
  onLoad?: () => void;
  onComplete?: () => void;
  onLoadError?: () => void;
  onPlay?: (e: any) => void;
  onLoop?: (e: any) => void;
  onDestroy?: () => void;
  onUnFreeze?: () => void;
  onFreeze?: () => void;
  onPause?: () => void;
  onFrame?: () => void;
  onStop?: () => void;
  onRender?: () => void;
  onTransition?: (state: { previousState: string; newState: string }) => void;
  onStateExit?: (state: { leavingState: string }) => void;
  onStateEntered?: (state: { enteringState: string }) => void;
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
const COMMAND_SET_START_STATE_MACHINE = 'startStateMachine';
const COMMAND_SET_STOP_STATE_MACHINE = 'stopStateMachine';
const COMMAND_SET_LOAD_STATE_MACHINE = 'loadStateMachine';
const COMMAND_SET_POST_EVENT = 'postEvent';
const COMMAND_SET_ADD_STATE_MACHINE_EVENT_LISTENER =
  'addStateMachineEventListener';
const COMMAND_SET_REMOVE_STATE_MACHINE_EVENT_LISTENER =
  'removeStateMachineEventListener';
const COMMAND_SET_RESIZE = 'resize';
const COMMAND_SET_SEGMENT = 'setSegment';
const COMMAND_SET_MARKER = 'setMarker';
const COMMAND_SET_LOAD_THEME = 'loadTheme';
const COMMAND_SET_LOAD_ANIMATION = 'loadAnimation';
const COMMAND_SET_MANIFEST = 'manifest';

const ComponentName = 'DotlottieReactNativeView';

const NativeViewManager = UIManager.getViewManagerConfig(ComponentName);

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

    const setSegmentWithUIManager = useCallback(
      (start: number, end: number) => {
        const command = NativeViewManager.Commands[COMMAND_SET_SEGMENT];
        if (command) {
          return UIManager.dispatchViewManagerCommand(
            findNodeHandle(nativeRef.current),
            command,
            [start, end]
          );
        }
      },
      []
    );

    const startStateMachineWithUIManager = useCallback(() => {
      const command =
        NativeViewManager.Commands[COMMAND_SET_START_STATE_MACHINE];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          []
        );
      }
    }, []);

    const stopStateMachineWithUIManager = useCallback(() => {
      const command =
        NativeViewManager.Commands[COMMAND_SET_STOP_STATE_MACHINE];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          []
        );
      }
    }, []);

    const loadStateMachineWithUIManager = useCallback(
      (stateMachineId: string) => {
        const command =
          NativeViewManager.Commands[COMMAND_SET_LOAD_STATE_MACHINE];
        if (command) {
          return UIManager.dispatchViewManagerCommand(
            findNodeHandle(nativeRef.current),
            command,
            [stateMachineId]
          );
        }
      },
      []
    );

    const setPostEventWithUIManager = useCallback((event: string) => {
      const command = NativeViewManager.Commands[COMMAND_SET_POST_EVENT];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [event]
        );
      }
    }, []);

    const addStateMachineEventListenerWithUIManager = useCallback(() => {
      const command =
        NativeViewManager.Commands[
          COMMAND_SET_ADD_STATE_MACHINE_EVENT_LISTENER
        ];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          []
        );
      }
    }, []);

    const removeStateMachineEventListenerWithUIManager = useCallback(() => {
      const command =
        NativeViewManager.Commands[
          COMMAND_SET_REMOVE_STATE_MACHINE_EVENT_LISTENER
        ];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          []
        );
      }
    }, []);

    const resizeWithUIManager = useCallback((width: number, height: number) => {
      const command = NativeViewManager.Commands[COMMAND_SET_RESIZE];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [width, height]
        );
      }
    }, []);

    const setMarkerWithUIManager = useCallback((marker: string) => {
      const command = NativeViewManager.Commands[COMMAND_SET_MARKER];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [marker]
        );
      }
    }, []);

    const loadThemeWithUIManager = useCallback((themeId: string) => {
      const command = NativeViewManager.Commands[COMMAND_SET_LOAD_THEME];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [themeId]
        );
      }
    }, []);

    const loadAnimationWithUIManager = useCallback((animationId: string) => {
      const command = NativeViewManager.Commands[COMMAND_SET_LOAD_ANIMATION];
      if (command) {
        return UIManager.dispatchViewManagerCommand(
          findNodeHandle(nativeRef.current),
          command,
          [animationId]
        );
      }
    }, []);

    const setManifestWithUIManager = useCallback(() => {
      const command = NativeViewManager.Commands[COMMAND_SET_MANIFEST];
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
      startStateMachine: startStateMachineWithUIManager,
      stopStateMachine: stopStateMachineWithUIManager,
      loadStateMachine: loadStateMachineWithUIManager,
      setPostEvent: setPostEventWithUIManager,
      addStateMachineEventListener: addStateMachineEventListenerWithUIManager,
      removeStateMachineEventListener:
        removeStateMachineEventListenerWithUIManager,
      resize: resizeWithUIManager,
      setSegment: setSegmentWithUIManager,
      setMarker: setMarkerWithUIManager,
      loadTheme: loadThemeWithUIManager,
      loadAnimation: loadAnimationWithUIManager,
      setManifest: setManifestWithUIManager,
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
