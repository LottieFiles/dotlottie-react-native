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
import type { Mode } from './DotLottie';

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
  startStateMachine: (stateMachineId: string) => void;
  stopStateMachine: () => void;
  loadStateMachine: (stateMachineId: string) => void;
  postEvent: (x: number, y: number) => void;
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
  segment?: [number, number];
  playMode?: Mode;
  useFrameInterpolation?: boolean;
  stateMachineId?: string;
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
  onTransition?: (state: { previousState: string; newState: string }) => void;
  onStateExit?: (state: { leavingState: string }) => void;
  onStateEntered?: (state: { enteringState: string }) => void;
}

export const DotLottie = forwardRef(
  (
    {
      source,
      loop = false,
      autoplay = false,
      speed,
      themeId,
      marker,
      segment,
      playMode,
      useFrameInterpolation,
      stateMachineId,
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
      onTransition: _onTransition,
      onStateExit: _onStateExit,
      onStateEntered: _onStateEntered,
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
          dotLottie.addEventListener('loop', ({ loopCount }) => {
            onLoop(loopCount);
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
      freeze: () => {
        dotLottieRef.current?.freeze();
      },
      unfreeze: () => {
        dotLottieRef.current?.unfreeze();
      },
      startStateMachine: () => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineStart?.();
        }
      },
      stopStateMachine: () => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineStop?.();
        }
      },
      loadStateMachine: (givenStateMachineId: string) => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineLoad?.(givenStateMachineId);
        }
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
      loadTheme: (themeIdValue: string) => {
        dotLottieRef.current?.setTheme(themeIdValue);
      },
      loadAnimation: (animationId: string) => {
        dotLottieRef.current?.loadAnimation(animationId);
      },
      setManifest: () => {
        // FIXME: Not needed!!
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
        speed={speed}
        themeId={themeId}
        marker={marker}
        segment={segment}
        mode={mode}
        useFrameInterpolation={useFrameInterpolation}
        stateMachineId={stateMachineId}
        style={canvasStyle}
        dotLottieRefCallback={dotLottieRefCallback}
      />
    );
  }
);
