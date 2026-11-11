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
import type { Layout } from './layout';

export type { Fit, Align, Layout } from './layout';

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

export type Renderer = 'sw' | 'gl';

/** Path geometry for a bezier path slot. Tangents are relative to the vertex at the same index. */
export type BezierPath = {
  vertices: [number, number][];
  closed?: boolean;
  inTangents?: [number, number][];
  outTangents?: [number, number][];
};

/** A named section of the animation. `time` is the start frame and `duration` the length in frames. */
export type Marker = {
  name: string;
  time: number;
  duration: number;
};

export type Dotlottie = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setLoop: (value: boolean) => void;
  setLoopCount: (count: number) => void;
  setSpeed: (value: number) => void;
  setPlayMode: (mode: Mode) => void;
  setFrame: (frame: number) => void;
  setUseFrameInterpolation: (value: boolean) => void;
  freeze: () => void;
  unfreeze: () => void;
  stateMachineStart: () => void;
  stateMachineStop: () => void;
  stateMachineLoad: (stateMachineId: string) => void;
  stateMachineLoadData: (data: string) => void;
  stateMachineFire: (event: string) => void;
  stateMachineSetNumericInput: (key: string, value: number) => boolean;
  stateMachineSetStringInput: (key: string, value: string) => boolean;
  stateMachineSetBooleanInput: (key: string, value: boolean) => boolean;
  stateMachineSetSeed: (seed: number) => void;
  resize: (width: number, height: number) => void;
  setSegment: (start: number, end: number) => void;
  setMarker: (marker: string) => void;
  setTheme: (themeId: string) => void;
  setThemeData: (themeData: string) => void;
  resetTheme: () => void;
  loadAnimation: (animationId: string) => void;
  setAudioVolume: (volume: number) => void;
  setSlots: (slots: string) => void;
  setSlot: (slotId: string, json: string) => void;
  setColorSlot: (slotId: string, color: [number, number, number]) => void;
  setScalarSlot: (slotId: string, value: number) => void;
  setTextSlot: (slotId: string, text: string) => void;
  setVectorSlot: (slotId: string, vector: [number, number]) => void;
  setPositionSlot: (slotId: string, position: [number, number]) => void;
  setImageSlot: (slotId: string, src: string) => void;
  setBezierPathSlot: (slotId: string, path: BezierPath) => void;
  clearSlot: (slotId: string) => void;
  clearSlots: () => void;
  resetSlot: (slotId: string) => void;
  resetSlots: () => void;
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
  audioVolume: () => Promise<number>;
  markers: () => Promise<Marker[]>;
  manifest: () => Promise<object | undefined>;
  getSlotIds: () => Promise<string[]>;
  getSlotType: (slotId: string) => Promise<string | undefined>;
  getSlot: (slotId: string) => Promise<string | undefined>;
  getSlots: () => Promise<string>;
  stateMachineGetNumericInput: (key: string) => Promise<number | undefined>;
  stateMachineGetStringInput: (key: string) => Promise<string | undefined>;
  stateMachineGetBooleanInput: (key: string) => Promise<boolean | undefined>;
  stateMachineCurrentState: () => Promise<string>;
  stateMachineStatus: () => Promise<string>;
  getStateMachine: (stateMachineId: string) => Promise<string | undefined>;
};

interface DotlottieNativeProps {
  source: string | { uri: string };
  loop?: boolean;
  loopCount?: number;
  autoplay?: boolean;
  speed?: number;
  themeId?: string;
  marker?: string;
  segment?: [number, number];
  playMode?: Mode;
  useFrameInterpolation?: boolean;
  stateMachineId?: string;
  renderer?: Renderer;
  layout?: Layout;
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
  source: string | number | { uri: string };
  loop?: boolean;
  loopCount?: number;
  autoplay?: boolean;
  speed?: number;
  themeId?: string;
  marker?: string;
  segment?: [number, number];
  playMode?: Mode;
  useFrameInterpolation?: boolean;
  stateMachineId?: string;
  renderer?: Renderer;
  layout?: Layout;
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
const COMMAND_SET_LOOP_COUNT = 'setLoopCount';
const COMMAND_SET_USE_FRAME_INTERPOLATION = 'setUseFrameInterpolation';
const COMMAND_SET_AUDIO_VOLUME = 'setAudioVolume';
const COMMAND_SET_THEME_DATA = 'setThemeData';
const COMMAND_RESET_THEME = 'resetTheme';
const COMMAND_STATE_MACHINE_LOAD_DATA = 'stateMachineLoadData';
const COMMAND_STATE_MACHINE_SET_SEED = 'stateMachineSetSeed';
const COMMAND_SET_SLOTS = 'setSlots';
const COMMAND_SET_SLOT = 'setSlot';
const COMMAND_SET_COLOR_SLOT = 'setColorSlot';
const COMMAND_SET_SCALAR_SLOT = 'setScalarSlot';
const COMMAND_SET_TEXT_SLOT = 'setTextSlot';
const COMMAND_SET_VECTOR_SLOT = 'setVectorSlot';
const COMMAND_SET_POSITION_SLOT = 'setPositionSlot';
const COMMAND_SET_IMAGE_SLOT = 'setImageSlot';
const COMMAND_SET_BEZIER_PATH_SLOT = 'setBezierPathSlot';
const COMMAND_CLEAR_SLOT = 'clearSlot';
const COMMAND_CLEAR_SLOTS = 'clearSlots';
const COMMAND_RESET_SLOT = 'resetSlot';
const COMMAND_RESET_SLOTS = 'resetSlots';

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
  getAudioVolume: (viewTag: number) => Promise<number>;
  getMarkers: (viewTag: number) => Promise<Marker[]>;
  getManifest: (viewTag: number) => Promise<object | null>;
  getSlotIds: (viewTag: number) => Promise<string[]>;
  getSlotType: (viewTag: number, slotId: string) => Promise<string | null>;
  getSlot: (viewTag: number, slotId: string) => Promise<string | null>;
  getSlots: (viewTag: number) => Promise<string>;
  stateMachineGetNumericInput: (
    viewTag: number,
    key: string
  ) => Promise<number | null>;
  stateMachineGetStringInput: (
    viewTag: number,
    key: string
  ) => Promise<string | null>;
  stateMachineGetBooleanInput: (
    viewTag: number,
    key: string
  ) => Promise<boolean | null>;
  stateMachineCurrentState: (viewTag: number) => Promise<string>;
  stateMachineStatus: (viewTag: number) => Promise<string>;
  getStateMachine: (
    viewTag: number,
    stateMachineId: string
  ) => Promise<string | null>;
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

    const setLoopCountWithUIManager = useCallback(
      (count: number) => {
        dispatchCommand(COMMAND_SET_LOOP_COUNT, [count]);
      },
      [dispatchCommand]
    );

    const setUseFrameInterpolationWithUIManager = useCallback(
      (value: boolean) => {
        dispatchCommand(COMMAND_SET_USE_FRAME_INTERPOLATION, [value]);
      },
      [dispatchCommand]
    );

    const setAudioVolumeWithUIManager = useCallback(
      (volume: number) => {
        dispatchCommand(COMMAND_SET_AUDIO_VOLUME, [volume]);
      },
      [dispatchCommand]
    );

    const setThemeDataWithUIManager = useCallback(
      (themeData: string) => {
        dispatchCommand(COMMAND_SET_THEME_DATA, [themeData]);
      },
      [dispatchCommand]
    );

    const resetThemeWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_RESET_THEME);
    }, [dispatchCommand]);

    const stateMachineLoadDataWithUIManager = useCallback(
      (data: string) => {
        dispatchCommand(COMMAND_STATE_MACHINE_LOAD_DATA, [data]);
      },
      [dispatchCommand]
    );

    const stateMachineSetSeedWithUIManager = useCallback(
      (seed: number) => {
        dispatchCommand(COMMAND_STATE_MACHINE_SET_SEED, [seed]);
      },
      [dispatchCommand]
    );

    const setSlotsWithUIManager = useCallback(
      (slots: string) => {
        dispatchCommand(COMMAND_SET_SLOTS, [slots]);
      },
      [dispatchCommand]
    );

    const setSlotWithUIManager = useCallback(
      (slotId: string, json: string) => {
        dispatchCommand(COMMAND_SET_SLOT, [slotId, json]);
      },
      [dispatchCommand]
    );

    const setColorSlotWithUIManager = useCallback(
      (slotId: string, color: [number, number, number]) => {
        dispatchCommand(COMMAND_SET_COLOR_SLOT, [slotId, color]);
      },
      [dispatchCommand]
    );

    const setScalarSlotWithUIManager = useCallback(
      (slotId: string, value: number) => {
        dispatchCommand(COMMAND_SET_SCALAR_SLOT, [slotId, value]);
      },
      [dispatchCommand]
    );

    const setTextSlotWithUIManager = useCallback(
      (slotId: string, text: string) => {
        dispatchCommand(COMMAND_SET_TEXT_SLOT, [slotId, text]);
      },
      [dispatchCommand]
    );

    const setVectorSlotWithUIManager = useCallback(
      (slotId: string, vector: [number, number]) => {
        dispatchCommand(COMMAND_SET_VECTOR_SLOT, [slotId, vector]);
      },
      [dispatchCommand]
    );

    const setPositionSlotWithUIManager = useCallback(
      (slotId: string, position: [number, number]) => {
        dispatchCommand(COMMAND_SET_POSITION_SLOT, [slotId, position]);
      },
      [dispatchCommand]
    );

    const setImageSlotWithUIManager = useCallback(
      (slotId: string, src: string) => {
        dispatchCommand(COMMAND_SET_IMAGE_SLOT, [slotId, src]);
      },
      [dispatchCommand]
    );

    const setBezierPathSlotWithUIManager = useCallback(
      (slotId: string, path: BezierPath) => {
        dispatchCommand(COMMAND_SET_BEZIER_PATH_SLOT, [
          slotId,
          {
            vertices: path.vertices,
            closed: path.closed ?? false,
            ...(path.inTangents && { inTangents: path.inTangents }),
            ...(path.outTangents && { outTangents: path.outTangents }),
          },
        ]);
      },
      [dispatchCommand]
    );

    const clearSlotWithUIManager = useCallback(
      (slotId: string) => {
        dispatchCommand(COMMAND_CLEAR_SLOT, [slotId]);
      },
      [dispatchCommand]
    );

    const clearSlotsWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_CLEAR_SLOTS);
    }, [dispatchCommand]);

    const resetSlotWithUIManager = useCallback(
      (slotId: string) => {
        dispatchCommand(COMMAND_RESET_SLOT, [slotId]);
      },
      [dispatchCommand]
    );

    const resetSlotsWithUIManager = useCallback(() => {
      dispatchCommand(COMMAND_RESET_SLOTS);
    }, [dispatchCommand]);

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

    const getAudioVolumeWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getAudioVolume(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getMarkersWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getMarkers(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getManifestWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return (await module.getManifest(handle)) ?? undefined;
    }, [ensureNativeModule, resolveHandle]);

    const getSlotIdsWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getSlotIds(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getSlotTypeWithNativeModule = useCallback(
      async (slotId: string) => {
        const module = ensureNativeModule();
        const handle = resolveHandle();
        return (await module.getSlotType(handle, slotId)) ?? undefined;
      },
      [ensureNativeModule, resolveHandle]
    );

    const getSlotWithNativeModule = useCallback(
      async (slotId: string) => {
        const module = ensureNativeModule();
        const handle = resolveHandle();
        return (await module.getSlot(handle, slotId)) ?? undefined;
      },
      [ensureNativeModule, resolveHandle]
    );

    const getSlotsWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.getSlots(handle);
    }, [ensureNativeModule, resolveHandle]);

    const stateMachineGetNumericInputWithNativeModule = useCallback(
      async (key: string) => {
        const module = ensureNativeModule();
        const handle = resolveHandle();
        return (
          (await module.stateMachineGetNumericInput(handle, key)) ?? undefined
        );
      },
      [ensureNativeModule, resolveHandle]
    );

    const stateMachineGetStringInputWithNativeModule = useCallback(
      async (key: string) => {
        const module = ensureNativeModule();
        const handle = resolveHandle();
        return (
          (await module.stateMachineGetStringInput(handle, key)) ?? undefined
        );
      },
      [ensureNativeModule, resolveHandle]
    );

    const stateMachineGetBooleanInputWithNativeModule = useCallback(
      async (key: string) => {
        const module = ensureNativeModule();
        const handle = resolveHandle();
        return (
          (await module.stateMachineGetBooleanInput(handle, key)) ?? undefined
        );
      },
      [ensureNativeModule, resolveHandle]
    );

    const stateMachineCurrentStateWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.stateMachineCurrentState(handle);
    }, [ensureNativeModule, resolveHandle]);

    const stateMachineStatusWithNativeModule = useCallback(async () => {
      const module = ensureNativeModule();
      const handle = resolveHandle();
      return module.stateMachineStatus(handle);
    }, [ensureNativeModule, resolveHandle]);

    const getStateMachineWithNativeModule = useCallback(
      async (stateMachineId: string) => {
        const module = ensureNativeModule();
        const handle = resolveHandle();
        return (
          (await module.getStateMachine(handle, stateMachineId)) ?? undefined
        );
      },
      [ensureNativeModule, resolveHandle]
    );

    useImperativeHandle(ref, () => ({
      play: playWithUIManager,
      pause: pauseWithUIManager,
      stop: stopWithUIManager,
      setLoop: setLoopWithUIManager,
      setLoopCount: setLoopCountWithUIManager,
      setSpeed: setSpeedWithUIManager,
      setPlayMode: setPlayModeWithUIManager,
      setFrame: setFrameWithUIManager,
      setUseFrameInterpolation: setUseFrameInterpolationWithUIManager,
      freeze: freezeWithUIManager,
      unfreeze: unfreezeWithUIManager,
      stateMachineStart: stateMachineStartWithUIManager,
      stateMachineStop: stateMachineStopWithUIManager,
      stateMachineLoad: stateMachineLoadWithUIManager,
      stateMachineLoadData: stateMachineLoadDataWithUIManager,
      stateMachineFire: stateMachineFireWithUIManager,
      stateMachineSetNumericInput: stateMachineSetNumericInputWithUIManager,
      stateMachineSetStringInput: stateMachineSetStringInputWithUIManager,
      stateMachineSetBooleanInput: stateMachineSetBooleanInputWithUIManager,
      stateMachineSetSeed: stateMachineSetSeedWithUIManager,
      resize: resizeWithUIManager,
      setSegment: setSegmentWithUIManager,
      setMarker: setMarkerWithUIManager,
      setTheme: setThemeWithUIManager,
      setThemeData: setThemeDataWithUIManager,
      resetTheme: resetThemeWithUIManager,
      loadAnimation: loadAnimationWithUIManager,
      setAudioVolume: setAudioVolumeWithUIManager,
      setSlots: setSlotsWithUIManager,
      setSlot: setSlotWithUIManager,
      setColorSlot: setColorSlotWithUIManager,
      setScalarSlot: setScalarSlotWithUIManager,
      setTextSlot: setTextSlotWithUIManager,
      setVectorSlot: setVectorSlotWithUIManager,
      setPositionSlot: setPositionSlotWithUIManager,
      setImageSlot: setImageSlotWithUIManager,
      setBezierPathSlot: setBezierPathSlotWithUIManager,
      clearSlot: clearSlotWithUIManager,
      clearSlots: clearSlotsWithUIManager,
      resetSlot: resetSlotWithUIManager,
      resetSlots: resetSlotsWithUIManager,
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
      audioVolume: getAudioVolumeWithNativeModule,
      markers: getMarkersWithNativeModule,
      manifest: getManifestWithNativeModule,
      getSlotIds: getSlotIdsWithNativeModule,
      getSlotType: getSlotTypeWithNativeModule,
      getSlot: getSlotWithNativeModule,
      getSlots: getSlotsWithNativeModule,
      stateMachineGetNumericInput: stateMachineGetNumericInputWithNativeModule,
      stateMachineGetStringInput: stateMachineGetStringInputWithNativeModule,
      stateMachineGetBooleanInput: stateMachineGetBooleanInputWithNativeModule,
      stateMachineCurrentState: stateMachineCurrentStateWithNativeModule,
      stateMachineStatus: stateMachineStatusWithNativeModule,
      getStateMachine: getStateMachineWithNativeModule,
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
