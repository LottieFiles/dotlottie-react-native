import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type MutableRefObject,
  type CSSProperties,
} from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Mode } from './constants';
import { parseSource } from './utils';
import type { DotLottie as DotLottiePlayer } from '@lottiefiles/dotlottie-web';

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
  segment?: number[];
  playMode?: Mode;
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
  onFrame?: () => void;
  onStop?: () => void;
  onRender?: () => void;
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
          dotLottie.addEventListener('frame', onFrame);
        }

        if (onStop) {
          dotLottie.addEventListener('stop', onStop);
        }

        if (onRender) {
          dotLottie.addEventListener('render', onRender);
        }

        if (onFreeze) {
          dotLottie.addEventListener('freeze', onFreeze);
        }

        if (onUnFreeze) {
          dotLottie.addEventListener('unfreeze', onUnFreeze);
        }

        // Apply initial settings
        if (speed !== undefined) {
          dotLottie.setSpeed(speed);
        }

        if (themeId) {
          dotLottie.setTheme(themeId);
        }

        if (marker) {
          dotLottie.setMarker(marker);
        }

        if (segment && segment.length === 2) {
          dotLottie.setSegment(segment[0]!, segment[1]!);
        }

        if (playMode !== undefined) {
          // Map Mode enum to string values expected by dotLottie-web
          const modeMap: Record<Mode, string> = {
            [0]: 'forward', // FORWARD
            [1]: 'reverse', // REVERSE
            [2]: 'bounce', // BOUNCE
            [3]: 'reverse-bounce', // REVERSE_BOUNCE
          };
          dotLottie.setMode(modeMap[playMode] as any);
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
        speed,
        themeId,
        marker,
        segment,
        playMode,
      ]
    );

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
      startStateMachine: (stateMachineId: string) => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineStart?.(stateMachineId);
        }
      },
      stopStateMachine: () => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineStop?.();
        }
      },
      loadStateMachine: (stateMachineId: string) => {
        if (dotLottieRef.current) {
          (dotLottieRef.current as any).stateMachineLoad?.(stateMachineId);
        }
      },
      postEvent: (_x: number, _y: number) => {
        // TODO: implement postEvent
      },
      addStateMachineEventListener: () => {
        // TODO: implement addStateMachineEventListener
      },
      removeStateMachineEventListener: () => {
        // TODO: implement removeStateMachineEventListener
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

    return (
      <DotLottieReact
        src={src}
        autoplay={autoplay}
        loop={loop}
        speed={speed}
        themeId={themeId}
        marker={marker}
        style={canvasStyle}
        dotLottieRefCallback={dotLottieRefCallback}
      />
    );
  }
);
