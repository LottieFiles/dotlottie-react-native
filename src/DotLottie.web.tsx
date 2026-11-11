import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type MutableRefObject,
  type CSSProperties,
} from 'react';
import {
  DotLottieReact,
  type DotLottie as DotLottiePlayer,
} from '@lottiefiles/dotlottie-react';
import { parseSource } from './utils';
import type { BezierPath, Marker, Mode } from './DotLottie';
import { toWebLayout, type Layout } from './layout';

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

const parseJson = (json: string): unknown => {
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
};

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
  renderer?: 'sw' | 'gl';
  layout?: Layout;
  style?: any;
  ref?: MutableRefObject<any>;
  onLoad?: () => void;
  onComplete?: () => void;
  onLoadError?: () => void;
  onPlay?: () => void;
  onLoop?: (loopCount: number) => void;
  onUnFreeze?: () => void;
  onDestroy?: () => void;
  onFreeze?: () => void;
  onPause?: () => void;
  onFrame?: (frame: number) => void;
  onStop?: () => void;
  onRender?: (frame: number) => void;
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

export const DotLottie = forwardRef(
  (
    {
      source,
      loop = false,
      loopCount,
      autoplay = false,
      speed,
      themeId,
      marker,
      segment,
      playMode,
      useFrameInterpolation,
      stateMachineId,
      layout,
      style,
      onLoad,
      onComplete,
      onLoadError,
      onPlay,
      onLoop,
      onUnFreeze,
      onFreeze,
      onPause,
      onFrame,
      onStop,
      onRender,
      onStateMachineStart,
      onStateMachineStop,
      onStateMachineStateEntered,
      onStateMachineStateExit,
      onStateMachineTransition,
      onStateMachineBooleanInputChange,
      onStateMachineNumericInputChange,
      onStateMachineStringInputChange,
      onStateMachineInputFired,
      onStateMachineCustomEvent,
      onStateMachineError,
    }: DotlottieReactNativeProps,
    ref
  ) => {
    const dotLottieRef = useRef<DotLottiePlayer | null>(null);

    const dotLottieRefCallback = useCallback(
      (dotLottie: DotLottiePlayer | null) => {
        dotLottieRef.current = dotLottie;

        if (!dotLottie) return;

        if (onLoad) {
          dotLottie.addEventListener('load', onLoad);
        }

        if (onComplete) {
          dotLottie.addEventListener('complete', onComplete);
        }

        if (onLoadError) {
          dotLottie.addEventListener('loadError', onLoadError);
        }

        if (onPlay) {
          dotLottie.addEventListener('play', onPlay);
        }

        if (onLoop) {
          dotLottie.addEventListener('loop', (event) => {
            onLoop(event.loopCount);
          });
        }

        if (onPause) {
          dotLottie.addEventListener('pause', onPause);
        }

        if (onFrame) {
          dotLottie.addEventListener('frame', ({ currentFrame }) => {
            onFrame(currentFrame);
          });
        }

        if (onStop) {
          dotLottie.addEventListener('stop', onStop);
        }

        if (onRender) {
          dotLottie.addEventListener('render', ({ currentFrame }) => {
            onRender(currentFrame);
          });
        }

        if (onFreeze) {
          dotLottie.addEventListener('freeze', onFreeze);
        }

        if (onUnFreeze) {
          dotLottie.addEventListener('unfreeze', onUnFreeze);
        }

        if (onStateMachineStart) {
          dotLottie.addEventListener('stateMachineStart', onStateMachineStart);
        }

        if (onStateMachineStop) {
          dotLottie.addEventListener('stateMachineStop', onStateMachineStop);
        }

        if (onStateMachineStateEntered) {
          dotLottie.addEventListener(
            'stateMachineStateEntered',
            ({ state }) => {
              onStateMachineStateEntered(state);
            }
          );
        }

        if (onStateMachineStateExit) {
          dotLottie.addEventListener('stateMachineStateExit', ({ state }) => {
            onStateMachineStateExit(state);
          });
        }

        if (onStateMachineTransition) {
          dotLottie.addEventListener(
            'stateMachineTransition',
            ({ fromState, toState }) => {
              onStateMachineTransition(fromState, toState);
            }
          );
        }

        if (onStateMachineBooleanInputChange) {
          dotLottie.addEventListener(
            'stateMachineBooleanInputValueChange',
            ({ inputName, oldValue, newValue }) => {
              onStateMachineBooleanInputChange(inputName, oldValue, newValue);
            }
          );
        }

        if (onStateMachineNumericInputChange) {
          dotLottie.addEventListener(
            'stateMachineNumericInputValueChange',
            ({ inputName, oldValue, newValue }) => {
              onStateMachineNumericInputChange(inputName, oldValue, newValue);
            }
          );
        }

        if (onStateMachineStringInputChange) {
          dotLottie.addEventListener(
            'stateMachineStringInputValueChange',
            ({ inputName, oldValue, newValue }) => {
              onStateMachineStringInputChange(inputName, oldValue, newValue);
            }
          );
        }

        if (onStateMachineInputFired) {
          dotLottie.addEventListener(
            'stateMachineInputFired',
            ({ inputName }) => {
              onStateMachineInputFired(inputName);
            }
          );
        }

        if (onStateMachineCustomEvent) {
          dotLottie.addEventListener(
            'stateMachineCustomEvent',
            ({ eventName }) => {
              onStateMachineCustomEvent(eventName);
            }
          );
        }

        if (onStateMachineError) {
          dotLottie.addEventListener('stateMachineError', ({ error }) => {
            onStateMachineError(error);
          });
        }
      },
      [
        onLoad,
        onComplete,
        onLoadError,
        onPlay,
        onLoop,
        onPause,
        onFrame,
        onStop,
        onRender,
        onFreeze,
        onUnFreeze,
        onStateMachineStart,
        onStateMachineStop,
        onStateMachineStateEntered,
        onStateMachineStateExit,
        onStateMachineTransition,
        onStateMachineBooleanInputChange,
        onStateMachineNumericInputChange,
        onStateMachineStringInputChange,
        onStateMachineInputFired,
        onStateMachineCustomEvent,
        onStateMachineError,
      ]
    );

    // Make autoplay reactive: control play/pause state
    useEffect(() => {
      if (autoplay) {
        dotLottieRef.current?.play();
      } else {
        dotLottieRef.current?.pause();
      }
    }, [autoplay]);

    useImperativeHandle(ref, () => ({
      play: () => {
        dotLottieRef.current?.play();
      },
      pause: () => {
        dotLottieRef.current?.pause();
      },
      stop: () => {
        dotLottieRef.current?.stop();
      },
      setLoop: (value: boolean) => {
        dotLottieRef.current?.setLoop(value);
      },
      setLoopCount: (count: number) => {
        dotLottieRef.current?.setLoopCount(count);
      },
      setSpeed: (value: number) => {
        dotLottieRef.current?.setSpeed(value);
      },
      setPlayMode: (mode: Mode) => {
        const modeMap: Record<Mode, string> = {
          [0]: 'forward',
          [1]: 'reverse',
          [2]: 'bounce',
          [3]: 'reverse-bounce',
        };
        dotLottieRef.current?.setMode(modeMap[mode] as any);
      },
      setFrame: (frame: number) => {
        dotLottieRef.current?.setFrame(frame);
      },
      setUseFrameInterpolation: (value: boolean) => {
        dotLottieRef.current?.setUseFrameInterpolation(value);
      },
      freeze: () => {
        dotLottieRef.current?.freeze();
      },
      unfreeze: () => {
        dotLottieRef.current?.unfreeze();
      },
      stateMachineStart: () => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineStart?.();
        }
      },
      stateMachineStop: () => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineStop?.();
        }
      },
      stateMachineLoad: (givenStateMachineId: string) => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineLoad?.(givenStateMachineId);
        }
      },
      stateMachineLoadData: (data: string) => {
        dotLottieRef.current?.stateMachineLoadData(data);
      },
      stateMachineFire: (event: string) => {
        dotLottieRef.current?.stateMachineFireEvent(event);
      },
      stateMachineSetNumericInput: (key: string, value: number) => {
        return (
          dotLottieRef.current?.stateMachineSetNumericInput(key, value) ?? false
        );
      },
      stateMachineSetStringInput: (key: string, value: string) => {
        return (
          dotLottieRef.current?.stateMachineSetStringInput(key, value) ?? false
        );
      },
      stateMachineSetBooleanInput: (key: string, value: boolean) => {
        return (
          dotLottieRef.current?.stateMachineSetBooleanInput(key, value) ?? false
        );
      },
      stateMachineSetSeed: (seed: number) => {
        dotLottieRef.current?.stateMachineSetSeed(seed);
      },
      resize: (_width: number, _height: number) => {
        dotLottieRef.current?.resize();
      },
      setSegment: (start: number, end: number) => {
        dotLottieRef.current?.setSegment(start, end);
      },
      setMarker: (markerName: string) => {
        dotLottieRef.current?.setMarker(markerName);
      },
      setTheme: (themeIdValue: string) => {
        dotLottieRef.current?.setTheme(themeIdValue);
      },
      setThemeData: (themeData: string) => {
        dotLottieRef.current?.setThemeData(themeData);
      },
      resetTheme: () => {
        dotLottieRef.current?.resetTheme();
      },
      loadAnimation: (animationId: string) => {
        dotLottieRef.current?.loadAnimation(animationId);
      },
      setAudioVolume: (volume: number) => {
        dotLottieRef.current?.setVolume(volume);
      },
      setSlots: (slots: string) => {
        const parsed = parseJson(slots);
        if (parsed && typeof parsed === 'object') {
          dotLottieRef.current?.setSlots(parsed as Record<string, unknown>);
        }
      },
      setSlot: (slotId: string, json: string) => {
        const parsed = parseJson(json);
        if (parsed !== undefined) {
          dotLottieRef.current?.setSlots({ [slotId]: parsed });
        }
      },
      setColorSlot: (slotId: string, color: [number, number, number]) => {
        dotLottieRef.current?.setColorSlot(slotId, color);
      },
      setScalarSlot: (slotId: string, value: number) => {
        dotLottieRef.current?.setScalarSlot(slotId, value);
      },
      setTextSlot: (slotId: string, text: string) => {
        dotLottieRef.current?.setTextSlot(slotId, { t: text });
      },
      setVectorSlot: (slotId: string, vector: [number, number]) => {
        dotLottieRef.current?.setVectorSlot(slotId, vector);
      },
      // The web player sets both "vector" and "position" slots with setVectorSlot.
      setPositionSlot: (slotId: string, position: [number, number]) => {
        dotLottieRef.current?.setVectorSlot(slotId, position);
      },
      setImageSlot: (slotId: string, src: string) => {
        dotLottieRef.current?.setImageSlot(slotId, src).catch(() => {});
      },
      setBezierPathSlot: (slotId: string, path: BezierPath) => {
        dotLottieRef.current?.setBezierPathSlot(slotId, {
          v: path.vertices,
          c: path.closed ?? false,
          i: path.inTangents,
          o: path.outTangents,
        });
      },
      clearSlot: (slotId: string) => {
        dotLottieRef.current?.clearSlot(slotId);
      },
      clearSlots: () => {
        dotLottieRef.current?.clearSlots();
      },
      resetSlot: (slotId: string) => {
        dotLottieRef.current?.resetSlot(slotId);
      },
      resetSlots: () => {
        dotLottieRef.current?.resetSlots();
      },
      totalFrames: async () => {
        return dotLottieRef.current?.totalFrames ?? 0;
      },
      duration: async () => {
        return dotLottieRef.current?.duration ?? 0;
      },
      speed: async () => {
        return dotLottieRef.current?.speed ?? 0;
      },
      currentFrame: async () => {
        return dotLottieRef.current?.currentFrame ?? 0;
      },
      isPaused: async () => {
        return dotLottieRef.current?.isPaused ?? false;
      },
      isPlaying: async () => {
        return dotLottieRef.current?.isPlaying ?? false;
      },
      isStopped: async () => {
        return dotLottieRef.current?.isStopped ?? false;
      },
      isLoaded: async () => {
        return dotLottieRef.current?.isLoaded ?? false;
      },
      activeThemeId: async () => {
        return dotLottieRef.current?.activeThemeId ?? '';
      },
      activeAnimationId: async () => {
        return dotLottieRef.current?.activeAnimationId ?? '';
      },
      loopCount: async () => {
        return dotLottieRef.current?.loopCount ?? 0;
      },
      audioVolume: async () => {
        return dotLottieRef.current?.volume ?? 1;
      },
      markers: async () => {
        return (dotLottieRef.current?.markers() ?? []).map(
          ({ name, start, end }) => ({
            name,
            time: start,
            duration: end - start,
          })
        );
      },
      manifest: async () => {
        return dotLottieRef.current?.manifest ?? undefined;
      },
      getSlotIds: async () => {
        return dotLottieRef.current?.getSlotIds() ?? [];
      },
      getSlotType: async (slotId: string) => {
        return dotLottieRef.current?.getSlotType(slotId);
      },
      getSlot: async (slotId: string) => {
        const slot = dotLottieRef.current?.getSlot(slotId);
        return slot === undefined ? undefined : JSON.stringify(slot);
      },
      getSlots: async () => {
        return JSON.stringify(dotLottieRef.current?.getSlots() ?? {});
      },
      stateMachineGetNumericInput: async (key: string) => {
        return dotLottieRef.current?.stateMachineGetNumericInput(key);
      },
      stateMachineGetStringInput: async (key: string) => {
        return dotLottieRef.current?.stateMachineGetStringInput(key);
      },
      stateMachineGetBooleanInput: async (key: string) => {
        return dotLottieRef.current?.stateMachineGetBooleanInput(key);
      },
      stateMachineCurrentState: async () => {
        return dotLottieRef.current?.stateMachineGetCurrentState() ?? '';
      },
      stateMachineStatus: async () => {
        return dotLottieRef.current?.stateMachineGetStatus() ?? '';
      },
      getStateMachine: async (givenStateMachineId: string) => {
        return (
          dotLottieRef.current?.stateMachineGet(givenStateMachineId) ||
          undefined
        );
      },
    }));

    // Parse source to get the URL
    const parsedSource = parseSource(source);
    const src = parsedSource || (typeof source === 'string' ? source : '');

    // Convert React Native style to CSS properties
    const canvasStyle: CSSProperties = {
      width: style?.width || '100%',
      height: style?.height || '100%',
      ...style,
    };

    // Convert playMode enum to mode string
    const mode =
      playMode !== undefined
        ? (['forward', 'reverse', 'bounce', 'reverse-bounce'] as const)[
            playMode
          ]
        : undefined;

    return (
      <DotLottieReact
        src={src}
        autoplay={autoplay}
        loop={loop}
        loopCount={loopCount}
        speed={speed}
        themeId={themeId}
        marker={marker}
        segment={segment}
        mode={mode}
        useFrameInterpolation={useFrameInterpolation}
        stateMachineId={stateMachineId}
        layout={toWebLayout(layout)}
        style={canvasStyle}
        dotLottieRefCallback={dotLottieRefCallback}
      />
    );
  }
);
