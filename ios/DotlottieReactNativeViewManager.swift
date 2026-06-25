import DotLottie
import UIKit

@objc(DotlottieReactNativeViewManager)
class DotlottieReactNativeViewManager: RCTViewManager {

  override func view() -> (DotlottieReactNativeView) {
    return DotlottieReactNativeView()
  }

  @objc
  func pause(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.pause()
    }
  }

  @objc
  func stop(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.stop()
    }
  }

  @objc
  func play(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.play()
    }
  }

  @objc
  func setLoop(_ node:NSNumber, loop:Bool) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.setLoop(loop)
    }
  }

  @objc func setSpeed(_ node:NSNumber, speed:NSNumber) {
    DispatchQueue.main.async {
      let convertedSpeed = Float(truncating: speed)
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.setSpeed(convertedSpeed)
    }
  }

  @objc func setFrame(_ node:NSNumber, frame:NSNumber) {
    DispatchQueue.main.async {
      let convertedFrame = Float(truncating: frame)
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.setFrame(convertedFrame)
    }
  }

  @objc func freeze(_ node:NSNumber) {
    // Note: freeze() is not available in the iOS DotLottie SDK
    // This is a no-op to maintain API compatibility with Android
  }

  @objc func unfreeze(_ node:NSNumber) {
    // Note: unfreeze() is not available in the iOS DotLottie SDK
    // This is a no-op to maintain API compatibility with Android
  }

  @objc func stateMachineStart(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.stateMachineStart()
    }
  }

  @objc func stateMachineStop(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.stateMachineStop()
    }
  }

  @objc func stateMachineLoad(_ node:NSNumber, stateMachineId: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.stateMachineLoad(id: String(stateMachineId))
    }
  }

  @objc func stateMachineFire(_ node:NSNumber, event: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.stateMachineFire(event: String(event))
    }
  }

  @objc func stateMachineSetNumericInput(_ node:NSNumber, key: NSString, value: NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.stateMachineSetNumericInput(key: String(key), value: Float(truncating: value))
    }
  }

  @objc func stateMachineSetStringInput(_ node:NSNumber, key: NSString, value: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.stateMachineSetStringInput(key: String(key), value: String(value))
    }
  }

  @objc func stateMachineSetBooleanInput(_ node:NSNumber, key: NSString, value: Bool) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.stateMachineSetBooleanInput(key: String(key), value: value)
    }
  }

  @objc func setSegment(_ node:NSNumber, start:NSNumber, end:NSNumber) {
    DispatchQueue.main.async {
      let start = Float(truncating: start)
      let end = Float(truncating: end)
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.setSegment(start: start, end: end)
    }
  }

  @objc func setTheme(_ node:NSNumber, themeId: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.setTheme(String(themeId))
    }
  }

  @objc func loadAnimation(_ node:NSNumber, animationId: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.loadAnimation(animationId: String(animationId))
    }
  }

  @objc func setFrameInterpolation(_ node:NSNumber, useFrameInterpolation:Bool) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.setUseFrameInterpolation(useFrameInterpolation)
    }
  }

  @objc func setPlayMode(_ node:NSNumber, mode:NSNumber) {
    DispatchQueue.main.async {

      let actualMode: Mode = {
        switch mode {
        case 0: return .forward
        case 1: return .reverse
        case 2: return .bounce
        case 3: return .reverseBounce
        default:
          return .forward
        }
      }()

      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.setMode(actualMode)
    }
  }

  @objc func setMarker(_ node:NSNumber, marker:NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.setMarker(String(marker))
    }
  }

  @objc func resize(_ node:NSNumber, width:NSNumber, height:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView.backend?.resize(width: Int(truncating: width), height: Int(truncating: height))
    }
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }

}

class DotlottieReactNativeView: UIView {
  /// The active render backend. Internal (not private): read cross-file by
  /// `DotlottieReactNativeViewManager` (commands) and `DotlottieReactNativeModule`
  /// (metrics), exactly like the previous `dataStore`.
  var backend: DotLottieRenderable?

  /// Shared, renderer-agnostic config snapshot. Passed by reference to the
  /// backend so prop changes stay visible when the backend rebuilds.
  private let config = RendererConfig()

  /// Requested renderer, locked on first backend creation (mirrors Android).
  private var requestedRenderer = "sw"
  private var rendererLocked = false

  private var isMountedToWindow: Bool = false
  private var isReleased: Bool = false
  private var pendingAnimationUpdate: Bool = false

  override init(frame: CGRect) {
    super.init(frame: frame)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  deinit {
    releaseResources()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    guard !isReleased else {
      return
    }

    let currentlyMounted = window != nil
    if currentlyMounted == isMountedToWindow {
      return
    }

    isMountedToWindow = currentlyMounted

    if currentlyMounted {
      scheduleAnimationUpdate()
    } else {
      teardownBackend()
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    backend?.platformView.frame = bounds
  }

  func releaseResources() {
    guard !isReleased else {
      return
    }

    isReleased = true
    isMountedToWindow = false
    pendingAnimationUpdate = false
    teardownBackend()
  }

  /// Creates the selected backend on first activation. The renderer choice is
  /// locked here so a late `renderer` prop change is ignored (matches Android).
  private func makeBackend() -> DotLottieRenderable {
    rendererLocked = true
    #if (os(iOS) && !targetEnvironment(macCatalyst))
    if requestedRenderer == "wg" {
      return WebGPURenderBackend(config: config, eventTarget: self)
    }
    #else
    if requestedRenderer == "wg" {
      print("[DotLottie] wg is unavailable on this platform; falling back to software renderer")
    }
    #endif
    return SoftwareRenderBackend(config: config, eventTarget: self)
  }

  /// Lazily creates and mounts the backend. Called from `didMoveToWindow` on first
  /// window attach — deliberately NOT from a prop `didSet`. `makeBackend()` locks the
  /// renderer on first creation, and RN does not guarantee `renderer` is applied
  /// before `source`, so we wait until the full initial prop batch is in before
  /// choosing (and locking) the backend.
  private func ensureBackend() {
    guard backend == nil, !isReleased else { return }
    let b = makeBackend()
    addSubview(b.platformView)
    b.platformView.frame = bounds
    backend = b
    setNeedsLayout()
  }

  private func teardownBackend() {
    backend?.cleanup()
    backend?.platformView.removeFromSuperview()
    backend = nil
  }

  private func performIfActive(_ action: () -> Void) {
    if !isReleased {
      action()
    }
  }

  private func scheduleAnimationUpdate() {
    if isReleased {
      return
    }

    if pendingAnimationUpdate {
      return
    }

    pendingAnimationUpdate = true
    ensureBackend()
    backend?.loadSource(config.source)
    pendingAnimationUpdate = false
  }

  @objc var renderer: NSString = "sw" {
    didSet {
      guard !rendererLocked else {
        #if DEBUG
        if requestedRenderer != (renderer as String) {
          print("[DotLottie] renderer is locked after first set; ignoring change to \(renderer)")
        }
        #endif
        return
      }
      requestedRenderer = renderer as String
    }
  }

  @objc var source: NSString = "" {
    didSet {
      performIfActive {
        config.source = source as String
        // Backend creation (which locks the renderer) is deferred to the first
        // window attach (`didMoveToWindow`), by which point RN has applied the
        // entire initial prop batch — including `renderer`. Creating the backend
        // here, before `renderer` is guaranteed to have been set, would wrongly
        // latch a `renderer="wg"` view to software. If the backend already
        // exists (a later source change while mounted), reload immediately.
        if backend != nil {
          scheduleAnimationUpdate()
        }
      }
    }
  }

  @objc var loop: Bool = false {
    didSet {
      performIfActive {
        config.loop = loop
        backend?.setLoop(loop)
      }
    }
  }

  @objc var autoplay: Bool = true {
    didSet {
      performIfActive {
        config.autoplay = autoplay
        if autoplay {
          backend?.play()
        } else {
          backend?.pause()
        }
      }
    }
  }

  @objc var speed: NSNumber = 1 {
    didSet {
      performIfActive {
        let speedValue = speed.doubleValue
        config.speed = speedValue
        backend?.setSpeed(Float(speedValue))
      }
    }
  }

  @objc var themeId: NSString = "" {
    didSet {
      performIfActive {
        config.themeId = themeId as String
        if themeId != "" {
          backend?.setTheme(themeId as String)
        }
      }
    }
  }

  @objc var marker: NSString = "" {
    didSet {
      performIfActive {
        config.marker = marker as String
        if marker != "" {
          backend?.setMarker(marker as String)
        }
      }
    }
  }

  @objc var segment: NSArray? {
    didSet {
      performIfActive {
        config.segment = segment as? [NSNumber]
        if let segmentArray = segment as? [NSNumber], segmentArray.count == 2 {
          let start = Float(truncating: segmentArray[0])
          let end = Float(truncating: segmentArray[1])
          backend?.setSegment(start: start, end: end)
        } else if segment == nil {
          // Reset to full animation range when segment is undefined
          backend?.clearSegment()
        }
      }
    }
  }

  @objc var playMode: NSNumber = 0 {
    didSet {
      performIfActive {
        config.playMode = playMode.intValue
        backend?.setMode(config.toMode())
      }
    }
  }

  @objc var useFrameInterpolation: Bool = false {
    didSet {
      performIfActive {
        config.useFrameInterpolation = useFrameInterpolation
        backend?.setUseFrameInterpolation(useFrameInterpolation)
      }
    }
  }

  @objc var layout: NSDictionary? {
    didSet {
      performIfActive {
        config.layoutConfig = layout
        // Prefer the SDK's runtime setLayout (no reload) so the fit/align change
        // applies to the existing, already-sized render surface. The backend
        // falls back to (re)creating the animation when one doesn't exist yet,
        // so the layout is baked into its initial config.
        backend?.setLayout(config.toLayout())
      }
    }
  }

  @objc var stateMachineId: NSString = "" {
    didSet {
      performIfActive {
        config.stateMachineId = stateMachineId as String
        if stateMachineId != "" {
          // Load and start the state machine
          backend?.stateMachineLoad(id: stateMachineId as String)
          backend?.stateMachineStart()
        } else {
          // Stop the state machine when stateMachineId is empty/undefined
          backend?.stateMachineStop()
        }
      }
    }
  }

  // MARK: - Event blocks
  // These stay on the view (registered in the .m) as the single source of truth.
  // SDK events reach them through `DotLottieEventTarget` (see extension below).

  @objc var onPlay: RCTDirectEventBlock = { _ in }
  @objc var onLoop: RCTDirectEventBlock = { _ in }
  @objc var onLoadError: RCTDirectEventBlock = { _ in }
  @objc var onLoad: RCTDirectEventBlock = { _ in }
  @objc var onFrame: RCTDirectEventBlock = { _ in }
  @objc var onRender: RCTDirectEventBlock = { _ in }
  @objc var onComplete: RCTDirectEventBlock = { _ in }
  @objc var onPause: RCTDirectEventBlock = { _ in }
  @objc var onStop: RCTDirectEventBlock = { _ in }

  // State machine events
  @objc var onStateMachineStart: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineStop: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineStateEntered: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineStateExit: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineTransition: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineBooleanInputChange: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineNumericInputChange: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineStringInputChange: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineInputFired: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineCustomEvent: RCTDirectEventBlock = { _ in }
  @objc var onStateMachineError: RCTDirectEventBlock = { _ in }
}

// MARK: - DotLottieEventTarget
// Each emit* forwards the SDK event to the matching @objc RCTDirectEventBlock.
extension DotlottieReactNativeView: DotLottieEventTarget {
  func emitPlay() { onPlay([:]) }
  func emitPause() { onPause([:]) }
  func emitStop() { onStop([:]) }
  func emitLoad() { onLoad([:]) }
  func emitLoadError() { onLoadError([:]) }
  func emitComplete() { onComplete([:]) }
  func emitLoop(_ loopCount: UInt32) { onLoop(["loopCount": loopCount]) }
  func emitFrame(_ frameNo: Float) { onFrame(["frameNo": Double(frameNo)]) }
  func emitRender(_ frameNo: Float) { onRender(["frameNo": Double(frameNo)]) }
  func emitStateMachineTransition(previousState: String, newState: String) {
    onStateMachineTransition(["previousState": previousState, "newState": newState])
  }
  func emitStateMachineStateEntered(_ state: String) { onStateMachineStateEntered(["enteringState": state]) }
  func emitStateMachineStateExit(_ state: String) { onStateMachineStateExit(["leavingState": state]) }
  func emitStateMachineCustomEvent(_ message: String) { onStateMachineCustomEvent(["message": message]) }
}
