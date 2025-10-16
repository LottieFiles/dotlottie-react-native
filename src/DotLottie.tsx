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
  type NativeSyntheticEvent,
} from 'react-native';
import { parseSource } from './utils';

const LINKING_ERROR =
  `The package '@lottiefiles/dotlottie-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export enum Mode {
  FORWARD,
  REVERSE,
  BOUNCE,
  REVERSE_BOUNCE,
}

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
  stateMachineStart: () => void;
  stateMachineStop: () => void;
  stateMachineLoad: (stateMachineId: string) => void;
  stateMachineFire: (event: string) => void;
  stateMachineSetNumericInput: (key: string, value: number) => boolean;
  stateMachineSetStringInput: (key: string, value: string) => boolean;
  stateMachineSetBooleanInput: (key: string, value: boolean) => boolean;
  resize: (width: number, height: number) => void;
  setSegment: (start: number, end: number) => void;
  setMarker: (marker: string) => void;
  setTheme: (themeId: string) => void;
  loadAnimation: (animationId: string) => void;
};

interface DotlottieNativeProps {
  source: string | { uri: string };
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  themeId?: string;
  marker?: string;
  segment?: [number, number];
  playMode?: Mode;
  useFrameInterpolation?: boolean;
  stateMachineId?: string;
  style: ViewStyle;
  ref?: MutableRefObject<any>;
  onLoad?: () => void;
  onComplete?: () => void;
  onLoadError?: () => void;
  onPlay?: () => void;
  onLoop?: (event: NativeSyntheticEvent<{ loopCount: number }>) => void;
  onDestroy?: () => void;
  onUnFreeze?: () => void;
  onFreeze?: () => void;
  onPause?: () => void;
  onFrame?: (event: NativeSyntheticEvent<{ frameNo: number }>) => void;
  onStop?: () => void;
  onRender?: (event: NativeSyntheticEvent<{ frameNo: number }>) => void;
  // State machine events
  onStateMachineStart?: () => void;
  onStateMachineStop?: () => void;
  onStateMachineStateEntered?: (
    event: NativeSyntheticEvent<{ enteringState: string }>
  ) => void;
  onStateMachineStateExit?: (
    event: NativeSyntheticEvent<{ leavingState: string }>
  ) => void;
  onStateMachineTransition?: (
    event: NativeSyntheticEvent<{ previousState: string; newState: string }>
  ) => void;
  onStateMachineBooleanInputChange?: (
    event: NativeSyntheticEvent<{
      inputName: string;
      oldValue: boolean;
      newValue: boolean;
    }>
  ) => void;
  onStateMachineNumericInputChange?: (
    event: NativeSyntheticEvent<{
      inputName: string;
      oldValue: number;
      newValue: number;
    }>
  ) => void;
  onStateMachineStringInputChange?: (
    event: NativeSyntheticEvent<{
      inputName: string;
      oldValue: string;
      newValue: string;
    }>
  ) => void;
  onStateMachineInputFired?: (
    event: NativeSyntheticEvent<{ inputName: string }>
  ) => void;
  onStateMachineCustomEvent?: (
    event: NativeSyntheticEvent<{ message: string }>
  ) => void;
  onStateMachineError?: (
    event: NativeSyntheticEvent<{ message: string }>
  ) => void;
}

interface DotlottieReactNativeProps {
  source: string | { uri: string };
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  themeId?: string;
  marker?: string;
  segment?: [number, number];
  playMode?: Mode;
  useFrameInterpolation?: boolean;
  stateMachineId?: string;
  style: ViewStyle;
  ref?: MutableRefObject<any>;
  onLoad?: () => void;
  onComplete?: () => void;
  onLoadError?: () => void;
  onPlay?: () => void;
  onLoop?: (loopCount: number) => void;
  onDestroy?: () => void;
  onUnFreeze?: () => void;
  onFreeze?: () => void;
  onPause?: () => void;
  onFrame?: (frameNo: number) => void;
  onStop?: () => void;
  onRender?: (frameNo: number) => void;
  // State machine events
  onStateMachineStart?: () => void;
  onStateMachineStop?: () => void;
  onStateMachineStateEntered?: (enteringState: string) => void;
  onStateMachineStateExit?: (leavingState: string) => void;
  onStateMachineTransition?: (previousState: string, newState: string) => void;
  onStateMachineBooleanInputChange?: (
    inputName: string,
    oldValue: boolean,
    newValue: boolean
  ) => void;
  onStateMachineNumericInputChange?: (
    inputName: string,
    oldValue: number,
    newValue: number
  ) => void;
  onStateMachineStringInputChange?: (
    inputName: string,
    oldValue: string,
    newValue: string
  ) => void;
  onStateMachineInputFired?: (inputName: string) => void;
  onStateMachineCustomEvent?: (message: string) => void;
  onStateMachineError?: (message: string) => void;
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
const COMMAND_STATE_MACHINE_START = 'stateMachineStart';
const COMMAND_STATE_MACHINE_STOP = 'stateMachineStop';
const COMMAND_STATE_MACHINE_LOAD = 'stateMachineLoad';
const COMMAND_STATE_MACHINE_FIRE = 'stateMachineFire';
const COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT = 'stateMachineSetNumericInput';
const COMMAND_STATE_MACHINE_SET_STRING_INPUT = 'stateMachineSetStringInput';
const COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT = 'stateMachineSetBooleanInput';
const COMMAND_SET_RESIZE = 'resize';
const COMMAND_SET_SEGMENT = 'setSegment';
const COMMAND_SET_MARKER = 'setMarker';
const COMMAND_SET_THEME = 'setTheme';
const COMMAND_SET_LOAD_ANIMATION = 'loadAnimation';

const ComponentName = 'DotlottieReactNativeView';

const NativeViewManager = UIManager.getViewManagerConfig(ComponentName);

const DotlottieReactNativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<DotlottieNativeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export const DotLottie = forwardRef(
  ({ source, ...props }: DotlottieReactNativeProps, ref) => {
    const nativeRef = useRef(null);

    const playWithUIManager = useCallback(() => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) {
        console.warn('play() - nativeRef is null');
        return;
      }

      const command = NativeViewManager?.Commands?.[COMMAND_PLAY];

      if (command !== undefined) {
        // Use command ID (older RN versions)
        UIManager.dispatchViewManagerCommand(nodeHandle, command, []);
      } else {
        // Fallback: Use command name as string (newer RN versions / iOS)
        UIManager.dispatchViewManagerCommand(nodeHandle, COMMAND_PLAY, []);
      }
    }, []);

    const pauseWithUIManager = useCallback(() => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_PAUSE];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_PAUSE,
        []
      );
    }, []);

    const stopWithUIManager = useCallback(() => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_STOP];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_STOP,
        []
      );
    }, []);

    const setLoopWithUIManager = useCallback((value: boolean) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_SET_LOOP];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_SET_LOOP,
        [value]
      );
    }, []);

    const setSpeedWithUIManager = useCallback((value: number) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_SET_SPEED];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_SET_SPEED,
        [value]
      );
    }, []);

    const setPlayModeWithUIManager = useCallback((mode: Mode) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_SET_PLAY_MODE];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_SET_PLAY_MODE,
        [mode]
      );
    }, []);

    const setFrameWithUIManager = useCallback((frame: number) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_SET_FRAME];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_SET_FRAME,
        [frame]
      );
    }, []);

    const freezeWithUIManager = useCallback(() => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_FREEZE];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_FREEZE,
        []
      );
    }, []);

    const unfreezeWithUIManager = useCallback(() => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_UNFREEZE];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_UNFREEZE,
        []
      );
    }, []);

    const setSegmentWithUIManager = useCallback(
      (start: number, end: number) => {
        const nodeHandle = findNodeHandle(nativeRef.current);
        if (!nodeHandle) return;

        const command = NativeViewManager?.Commands?.[COMMAND_SET_SEGMENT];
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          command !== undefined ? command : COMMAND_SET_SEGMENT,
          [start, end]
        );
      },
      []
    );

    const stateMachineStartWithUIManager = useCallback(() => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command =
        NativeViewManager?.Commands?.[COMMAND_STATE_MACHINE_START];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_STATE_MACHINE_START,
        []
      );
    }, []);

    const stateMachineStopWithUIManager = useCallback(() => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_STATE_MACHINE_STOP];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_STATE_MACHINE_STOP,
        []
      );
    }, []);

    const stateMachineLoadWithUIManager = useCallback(
      (stateMachineId: string) => {
        const nodeHandle = findNodeHandle(nativeRef.current);
        if (!nodeHandle) return;

        const command =
          NativeViewManager?.Commands?.[COMMAND_STATE_MACHINE_LOAD];
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          command !== undefined ? command : COMMAND_STATE_MACHINE_LOAD,
          [stateMachineId]
        );
      },
      []
    );

    const stateMachineFireWithUIManager = useCallback((event: string) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_STATE_MACHINE_FIRE];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_STATE_MACHINE_FIRE,
        [event]
      );
    }, []);

    const stateMachineSetNumericInputWithUIManager = useCallback(
      (key: string, value: number) => {
        const nodeHandle = findNodeHandle(nativeRef.current);
        if (!nodeHandle) return false;

        const command =
          NativeViewManager?.Commands?.[
            COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT
          ];
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          command !== undefined
            ? command
            : COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT,
          [key, value]
        );
        return true;
      },
      []
    );

    const stateMachineSetStringInputWithUIManager = useCallback(
      (key: string, value: string) => {
        const nodeHandle = findNodeHandle(nativeRef.current);
        if (!nodeHandle) return false;

        const command =
          NativeViewManager?.Commands?.[COMMAND_STATE_MACHINE_SET_STRING_INPUT];
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          command !== undefined
            ? command
            : COMMAND_STATE_MACHINE_SET_STRING_INPUT,
          [key, value]
        );
        return true;
      },
      []
    );

    const stateMachineSetBooleanInputWithUIManager = useCallback(
      (key: string, value: boolean) => {
        const nodeHandle = findNodeHandle(nativeRef.current);
        if (!nodeHandle) return false;

        const command =
          NativeViewManager?.Commands?.[
            COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT
          ];
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          command !== undefined
            ? command
            : COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT,
          [key, value]
        );
        return true;
      },
      []
    );

    const resizeWithUIManager = useCallback((width: number, height: number) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_SET_RESIZE];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_SET_RESIZE,
        [width, height]
      );
    }, []);

    const setMarkerWithUIManager = useCallback((marker: string) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_SET_MARKER];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_SET_MARKER,
        [marker]
      );
    }, []);

    const setThemeWithUIManager = useCallback((themeId: string) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_SET_THEME];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_SET_THEME,
        [themeId]
      );
    }, []);

    const loadAnimationWithUIManager = useCallback((animationId: string) => {
      const nodeHandle = findNodeHandle(nativeRef.current);
      if (!nodeHandle) return;

      const command = NativeViewManager?.Commands?.[COMMAND_SET_LOAD_ANIMATION];
      UIManager.dispatchViewManagerCommand(
        nodeHandle,
        command !== undefined ? command : COMMAND_SET_LOAD_ANIMATION,
        [animationId]
      );
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
      stateMachineStart: stateMachineStartWithUIManager,
      stateMachineStop: stateMachineStopWithUIManager,
      stateMachineLoad: stateMachineLoadWithUIManager,
      stateMachineFire: stateMachineFireWithUIManager,
      stateMachineSetNumericInput: stateMachineSetNumericInputWithUIManager,
      stateMachineSetStringInput: stateMachineSetStringInputWithUIManager,
      stateMachineSetBooleanInput: stateMachineSetBooleanInputWithUIManager,
      resize: resizeWithUIManager,
      setSegment: setSegmentWithUIManager,
      setMarker: setMarkerWithUIManager,
      setTheme: setThemeWithUIManager,
      loadAnimation: loadAnimationWithUIManager,
    }));

    const parsedSource = parseSource(source);

    return (
      <DotlottieReactNativeView
        ref={nativeRef}
        source={parsedSource || ''}
        {...props}
        onLoop={(event) => {
          props.onLoop?.(event.nativeEvent.loopCount);
        }}
        onFrame={(event) => {
          props.onFrame?.(event.nativeEvent.frameNo);
        }}
        onRender={(event) => {
          props.onRender?.(event.nativeEvent.frameNo);
        }}
        onStateMachineStateEntered={(event) => {
          props.onStateMachineStateEntered?.(event.nativeEvent.enteringState);
        }}
        onStateMachineStateExit={(event) => {
          props.onStateMachineStateExit?.(event.nativeEvent.leavingState);
        }}
        onStateMachineTransition={(event) => {
          props.onStateMachineTransition?.(
            event.nativeEvent.previousState,
            event.nativeEvent.newState
          );
        }}
        onStateMachineBooleanInputChange={(event) => {
          props.onStateMachineBooleanInputChange?.(
            event.nativeEvent.inputName,
            event.nativeEvent.oldValue,
            event.nativeEvent.newValue
          );
        }}
        onStateMachineNumericInputChange={(event) => {
          props.onStateMachineNumericInputChange?.(
            event.nativeEvent.inputName,
            event.nativeEvent.oldValue,
            event.nativeEvent.newValue
          );
        }}
        onStateMachineStringInputChange={(event) => {
          props.onStateMachineStringInputChange?.(
            event.nativeEvent.inputName,
            event.nativeEvent.oldValue,
            event.nativeEvent.newValue
          );
        }}
        onStateMachineInputFired={(event) => {
          props.onStateMachineInputFired?.(event.nativeEvent.inputName);
        }}
        onStateMachineCustomEvent={(event) => {
          props.onStateMachineCustomEvent?.(event.nativeEvent.message);
        }}
        onStateMachineError={(event) => {
          props.onStateMachineError?.(event.nativeEvent.message);
        }}
      />
    );
  }
);
