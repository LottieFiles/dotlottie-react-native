import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type MutableRefObject,
  type ComponentType,
} from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewStyle,
  findNodeHandle,
  NativeModules,
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
  totalFrames: () => Promise<number>;
  duration: () => Promise<number>;
  speed: () => Promise<number>;
  currentFrame: () => Promise<number>;
  isPaused: () => Promise<boolean>;
  isPlaying: () => Promise<boolean>;
  isStopped: () => Promise<boolean>;
  isLoaded: () => Promise<boolean>;
  activeThemeId: () => Promise<string>;
  activeAnimationId: () => Promise<string>;
  loopCount: () => Promise<number>;
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
const isNativeModuleAvailable = NativeViewManager != null;

let hasWarnedMissingNativeModule = false;
const warnMissingNativeModule = () => {
  if (hasWarnedMissingNativeModule) {
    return;
  }
  hasWarnedMissingNativeModule = true;
  console.warn(
    "'@lottiefiles/dotlottie-react-native' native module not found. " +
      "If you're using Expo, run 'expo prebuild' and create a development build, " +
      'or fall back to @lottiefiles/dotlottie-react for managed workflow support.'
  );
};

type DotlottieNativeModule = {
  getTotalFrames: (viewTag: number) => Promise<number>;
  getDuration: (viewTag: number) => Promise<number>;
  getSpeed: (viewTag: number) => Promise<number>;
  getCurrentFrame: (viewTag: number) => Promise<number>;
  isPaused: (viewTag: number) => Promise<boolean>;
  isPlaying: (viewTag: number) => Promise<boolean>;
  isStopped: (viewTag: number) => Promise<boolean>;
  isLoaded: (viewTag: number) => Promise<boolean>;
  getActiveThemeId: (viewTag: number) => Promise<string>;
  getActiveAnimationId: (viewTag: number) => Promise<string>;
  getLoopCount: (viewTag: number) => Promise<number>;
};

const NativeMetricsModule: DotlottieNativeModule | undefined =
  NativeModules?.DotlottieReactNativeModule;

const DotlottieReactNativeView = isNativeModuleAvailable
  ? requireNativeComponent<DotlottieNativeProps>(ComponentName)
  : (((_props: DotlottieNativeProps) => {
      warnMissingNativeModule();
      return null;
    }) as ComponentType<DotlottieNativeProps>);

export const DotLottie = forwardRef(
  ({ source, ...props }: DotlottieReactNativeProps, ref) => {
    const nativeRef = useRef(null);

    const dispatchCommand = useCallback(
      (
        commandName: string,
        args: unknown[] = [],
        warnTag?: string
      ): boolean => {
        const nodeHandle = findNodeHandle(nativeRef.current);
        if (!nodeHandle) {
          if (warnTag) {
            console.warn(`${warnTag} - nativeRef is null`);
          }
          return false;
        }

        const commandId = NativeViewManager?.Commands?.[commandName];
        UIManager.dispatchViewManagerCommand(
          nodeHandle,
          commandId !== undefined ? commandId : commandName,
          args
        );

        return true;
      },
      []
    );

    const playWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_PLAY, [], 'play()');
    }, [dispatchCommand]);

    const pauseWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_PAUSE);
    }, [dispatchCommand]);

    const stopWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_STOP);
    }, [dispatchCommand]);

    const setLoopWithUIManager = useCallback(
      (value: boolean) => {
        dispatchCommand(COMMAND_SET_LOOP, [value]);
      },
      [dispatchCommand]
    );

    const setSpeedWithUIManager = useCallback(
      (value: number) => {
        dispatchCommand(COMMAND_SET_SPEED, [value]);
      },
      [dispatchCommand]
    );

    const setPlayModeWithUIManager = useCallback(
      (mode: Mode) => {
        dispatchCommand(COMMAND_SET_PLAY_MODE, [mode]);
      },
      [dispatchCommand]
    );

    const setFrameWithUIManager = useCallback(
      (frame: number) => {
        dispatchCommand(COMMAND_SET_FRAME, [frame]);
      },
      [dispatchCommand]
    );

    const freezeWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_FREEZE);
    }, [dispatchCommand]);

    const unfreezeWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_UNFREEZE);
    }, [dispatchCommand]);

    const setSegmentWithUIManager = useCallback(
      (start: number, end: number) => {
        dispatchCommand(COMMAND_SET_SEGMENT, [start, end]);
      },
      [dispatchCommand]
    );

    const stateMachineStartWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_STATE_MACHINE_START);
    }, [dispatchCommand]);

    const stateMachineStopWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_STATE_MACHINE_STOP);
    }, [dispatchCommand]);

    const stateMachineLoadWithUIManager = useCallback(
      (stateMachineId: string) => {
        dispatchCommand(COMMAND_STATE_MACHINE_LOAD, [stateMachineId]);
      },
      [dispatchCommand]
    );

    const stateMachineFireWithUIManager = useCallback(
      (event: string) => {
        dispatchCommand(COMMAND_STATE_MACHINE_FIRE, [event]);
      },
      [dispatchCommand]
    );

    const stateMachineSetNumericInputWithUIManager = useCallback(
      (key: string, value: number) =>
        dispatchCommand(COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT, [key, value]),
      [dispatchCommand]
    );

    const stateMachineSetStringInputWithUIManager = useCallback(
      (key: string, value: string) =>
        dispatchCommand(COMMAND_STATE_MACHINE_SET_STRING_INPUT, [key, value]),
      [dispatchCommand]
    );

    const stateMachineSetBooleanInputWithUIManager = useCallback(
      (key: string, value: boolean) =>
        dispatchCommand(COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT, [key, value]),
      [dispatchCommand]
    );

    const resizeWithUIManager = useCallback(
      (width: number, height: number) => {
        dispatchCommand(COMMAND_SET_RESIZE, [width, height]);
      },
      [dispatchCommand]
    );

    const setMarkerWithUIManager = useCallback(
      (marker: string) => {
        dispatchCommand(COMMAND_SET_MARKER, [marker]);
      },
      [dispatchCommand]
    );

    const setThemeWithUIManager = useCallback(
      (themeId: string) => {
        dispatchCommand(COMMAND_SET_THEME, [themeId]);
      },
      [dispatchCommand]
    );

    const loadAnimationWithUIManager = useCallback(
      (animationId: string) => {
        dispatchCommand(COMMAND_SET_LOAD_ANIMATION, [animationId]);
      },
      [dispatchCommand]
    );

    const resolveHandle = useCallback(() => {
      const handle = findNodeHandle(nativeRef.current);
      if (handle == null) {
        throw new Error('Unable to resolve DotLottie native view handle.');
      }
      return handle;
    }, []);

    const ensureNativeModule = useCallback(() => {
      if (!NativeMetricsModule) {
        warnMissingNativeModule();
        throw new Error(LINKING_ERROR);
      }
      return NativeMetricsModule;
    }, []);

    const getTotalFramesWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getTotalFrames(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getDurationWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getDuration(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getSpeedWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getSpeed(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getCurrentFrameWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getCurrentFrame(handle);
    }, [ensureNativeModule, resolveHandle]);

    const isPausedWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.isPaused(handle);
    }, [ensureNativeModule, resolveHandle]);

    const isPlayingWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.isPlaying(handle);
    }, [ensureNativeModule, resolveHandle]);

    const isStoppedWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.isStopped(handle);
    }, [ensureNativeModule, resolveHandle]);

    const isLoadedWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.isLoaded(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getActiveThemeIdWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getActiveThemeId(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getActiveAnimationIdWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getActiveAnimationId(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getLoopCountWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getLoopCount(handle);
    }, [ensureNativeModule, resolveHandle]);

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
      totalFrames: getTotalFramesWithNativeModule,
      duration: getDurationWithNativeModule,
      speed: getSpeedWithNativeModule,
      currentFrame: getCurrentFrameWithNativeModule,
      isPaused: isPausedWithNativeModule,
      isPlaying: isPlayingWithNativeModule,
      isStopped: isStoppedWithNativeModule,
      isLoaded: isLoadedWithNativeModule,
      activeThemeId: getActiveThemeIdWithNativeModule,
      activeAnimationId: getActiveAnimationIdWithNativeModule,
      loopCount: getLoopCountWithNativeModule,
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
