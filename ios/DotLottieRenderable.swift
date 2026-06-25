import DotLottie
import UIKit

/// Shared, mutable, renderer-agnostic holder for the JS-driven configuration.
/// Each backend translates this into its own config object (AnimationConfig vs Config).
///
/// NOTE: this is a reference type on purpose. The RN view and the
/// `SoftwareRenderBackend`'s datastore share the *same* instance, so a prop
/// change on the view is immediately visible to the datastore when it rebuilds
/// the animation (e.g. on a later source change). This preserves the
/// reference-semantics behavior of the previous `Datastore` and avoids the
/// stale-config divergence a value-type snapshot would introduce.
final class RendererConfig {
  var source: String = ""
  var autoplay: Bool = true
  var loop: Bool = false
  var speed: Double = 1
  var playMode: Int = 0
  var useFrameInterpolation: Bool = false
  var segment: [NSNumber]? = nil
  var marker: String = ""
  var themeId: String = ""
  var stateMachineId: String = ""
  var layoutConfig: NSDictionary? = nil

  func toMode() -> Mode {
    switch playMode {
    case 1: return .reverse
    case 2: return .bounce
    case 3: return .reverseBounce
    default: return .forward
    }
  }

  func toLayout() -> DotLottie.Layout {
    let fitString = (layoutConfig?["fit"] as? String) ?? "contain"
    let fit: Fit = {
      switch fitString {
      case "cover": return .cover
      case "fill": return .fill
      case "fit-width": return .fitWidth
      case "fit-height": return .fitHeight
      case "none": return .none
      default: return .contain
      }
    }()
    var alignX: Float = 0.5
    var alignY: Float = 0.5
    if let align = layoutConfig?["align"] as? [NSNumber], align.count == 2 {
      alignX = Float(truncating: align[0])
      alignY = Float(truncating: align[1])
    }
    return DotLottie.Layout(fit: fit, alignX: alignX, alignY: alignY)
  }

  func toSegmentTuple() -> (Float, Float)? {
    guard let segment, segment.count == 2 else { return nil }
    return (Float(truncating: segment[0]), Float(truncating: segment[1]))
  }
}

/// Sink for player events. The RN view conforms to this; observers forward here.
/// Keeping the RCTDirectEventBlocks on the view (their @objc home) avoids
/// duplicating event-block state.
protocol DotLottieEventTarget: AnyObject {
  func emitPlay()
  func emitPause()
  func emitStop()
  func emitLoad()
  func emitLoadError()
  func emitComplete()
  func emitLoop(_ loopCount: UInt32)
  func emitFrame(_ frameNo: Float)
  func emitRender(_ frameNo: Float)
  func emitStateMachineTransition(previousState: String, newState: String)
  func emitStateMachineStateEntered(_ state: String)
  func emitStateMachineStateExit(_ state: String)
  func emitStateMachineCustomEvent(_ message: String) // dormant in v1: no StateMachineInternalObserver is wired (matches current software behavior); kept for when custom events are added
}

/// Renderer-agnostic surface the RN view / manager / metrics module call.
protocol DotLottieRenderable: AnyObject {
  /// The UIView mounted as a subview of DotlottieReactNativeView.
  var platformView: UIView { get }

  func loadSource(_ source: String)
  func cleanup()

  func play()
  func pause()
  func stop()
  func setLoop(_ loop: Bool)
  func setSpeed(_ speed: Float)
  func setFrame(_ frame: Float)
  func setMode(_ mode: Mode)
  func setSegment(start: Float, end: Float)
  func clearSegment()
  func setMarker(_ marker: String)
  func setTheme(_ themeId: String)
  func setUseFrameInterpolation(_ enabled: Bool)
  func setLayout(_ layout: DotLottie.Layout)
  func loadAnimation(animationId: String)
  func resize(width: Int, height: Int)

  func stateMachineLoad(id: String)
  func stateMachineStart()
  func stateMachineStop()
  func stateMachineFire(event: String)
  func stateMachineSetNumericInput(key: String, value: Float)
  func stateMachineSetStringInput(key: String, value: String)
  func stateMachineSetBooleanInput(key: String, value: Bool)

  var totalFrames: Float { get }
  var duration: Float { get }
  var currentFrame: Float { get }
  var speed: Float { get }
  var isPlaying: Bool { get }
  var isPaused: Bool { get }
  var isStopped: Bool { get }
  var isLoaded: Bool { get }
  var activeThemeId: String { get }
  var activeAnimationId: String { get }
  var loopCount: UInt32 { get }
}

/// Forwards SDK animation events to a DotLottieEventTarget.
final class DotLottieEventObserver: Observer {
  weak var target: DotLottieEventTarget?
  init(target: DotLottieEventTarget) { self.target = target }

  func onComplete() { target?.emitComplete() }
  func onFrame(frameNo: Float) { target?.emitFrame(frameNo) }
  func onLoad() { target?.emitLoad() }
  func onLoadError() { target?.emitLoadError() }
  func onLoop(loopCount: UInt32) { target?.emitLoop(loopCount) }
  func onPause() { target?.emitPause() }
  func onPlay() { target?.emitPlay() }
  func onRender(frameNo: Float) { target?.emitRender(frameNo) }
  func onStop() { target?.emitStop() }
}

/// Forwards SDK state-machine events to a DotLottieEventTarget.
/// NOTE: SDK 0.16.1's StateMachineObserver delivers only these three events.
final class DotLottieStateMachineObserver: StateMachineObserver {
  weak var target: DotLottieEventTarget?
  init(target: DotLottieEventTarget) { self.target = target }

  func onTransition(previousState: String, newState: String) {
    target?.emitStateMachineTransition(previousState: previousState, newState: newState)
  }
  func onStateEntered(enteringState: String) {
    target?.emitStateMachineStateEntered(enteringState)
  }
  func onStateExit(leavingState: String) {
    target?.emitStateMachineStateExit(leavingState)
  }
}
