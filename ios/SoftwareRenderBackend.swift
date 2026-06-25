import DotLottie
import SwiftUI
import UIKit

/// Software (CPU) render backend: wraps the existing `DotLottieAnimation` +
/// SwiftUI `DotLottieView` path verbatim, behind the `DotLottieRenderable`
/// protocol. Behavior is intentionally unchanged from the previous inline
/// implementation; only the call sites moved behind the protocol.
final class SoftwareRenderBackend: DotLottieRenderable {
  private let hostingController: UIHostingController<AnyView>
  private let store: SoftwareDatastore

  var platformView: UIView { hostingController.view }

  init(config: RendererConfig, eventTarget: DotLottieEventTarget) {
    let store = SoftwareDatastore(config: config, eventTarget: eventTarget)
    self.store = store
    let root = AnyView(AnimationView().environmentObject(store))
    let controller = UIHostingController(rootView: root)
    controller.view.backgroundColor = .clear
    controller.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    self.hostingController = controller
  }

  func loadSource(_ source: String) {
    store.config.source = source
    store.createAnimation()
  }
  func cleanup() { store.cleanupAnimation() }

  func play() { _ = store.animation?.play() }
  func pause() { _ = store.animation?.pause() }
  func stop() { _ = store.animation?.stop() }
  func setLoop(_ loop: Bool) { store.animation?.setLoop(loop: loop) }
  func setSpeed(_ speed: Float) { store.animation?.setSpeed(speed: speed) }
  func setFrame(_ frame: Float) { store.animation?.setFrame(frame: frame) }
  func setMode(_ mode: Mode) { store.animation?.setMode(mode: mode) }
  func setSegment(start: Float, end: Float) { store.animation?.setSegments(segments: (start, end)) }
  func clearSegment() {
    if let total = store.animation?.totalFrames() { store.animation?.setSegments(segments: (0, total)) }
  }
  func setMarker(_ marker: String) { store.animation?.setMarker(marker: marker) }
  func setTheme(_ themeId: String) { store.animation?.setTheme(themeId) }
  func setUseFrameInterpolation(_ enabled: Bool) { store.animation?.setFrameInterpolation(enabled) }
  func setLayout(_ layout: DotLottie.Layout) {
    // Apply at runtime when a live animation exists; otherwise (re)create it so
    // the layout is baked into the initial config.
    guard let animation = store.animation else { store.createAnimation(); return }
    animation.setLayout(layout: layout)
  }
  func loadAnimation(animationId: String) { try? store.animation?.loadAnimationById(animationId) }
  func resize(width: Int, height: Int) { _ = store.animation?.resize(width: width, height: height) }

  func stateMachineLoad(id: String) { _ = store.animation?.stateMachineLoad(id: id) }
  func stateMachineStart() { _ = store.animation?.stateMachineStart() }
  func stateMachineStop() { _ = store.animation?.stateMachineStop() }
  func stateMachineFire(event: String) { store.animation?.stateMachineFire(event: event) }
  func stateMachineSetNumericInput(key: String, value: Float) { _ = store.animation?.stateMachineSetNumericInput(key: key, value: value) }
  func stateMachineSetStringInput(key: String, value: String) { _ = store.animation?.stateMachineSetStringInput(key: key, value: value) }
  func stateMachineSetBooleanInput(key: String, value: Bool) { _ = store.animation?.stateMachineSetBooleanInput(key: key, value: value) }

  var totalFrames: Float { store.animation?.totalFrames() ?? 0 }
  var duration: Float { store.animation?.duration() ?? 0 }
  var currentFrame: Float { store.animation?.currentFrame() ?? 0 }
  var speed: Float { store.animation?.speed() ?? 0 }
  var isPlaying: Bool { store.animation?.isPlaying() ?? false }
  var isPaused: Bool { store.animation?.isPaused() ?? false }
  var isStopped: Bool { store.animation?.isStopped() ?? false }
  var isLoaded: Bool { store.animation?.isLoaded() ?? false }
  var activeThemeId: String { store.animation?.activeThemeId() ?? "" }
  var activeAnimationId: String { store.animation?.activeAnimationId() ?? "" }
  var loopCount: UInt32 { UInt32(max(0, store.animation?.loopCount() ?? 0)) } // DotLottieAnimation.loopCount() returns Int
}

/// The renamed, event-block-free `Datastore`. Owns the `DotLottieAnimation` and
/// drives the SwiftUI `AnimationView`. Config lives in the shared
/// `RendererConfig`; events are forwarded to the `DotLottieEventTarget`.
final class SoftwareDatastore: ObservableObject {
  let config: RendererConfig
  weak var eventTarget: DotLottieEventTarget?

  @Published var animation: DotLottieAnimation?
  var observer: DotLottieEventObserver?
  var stateMachineObserver: DotLottieStateMachineObserver?

  init(config: RendererConfig, eventTarget: DotLottieEventTarget) {
    self.config = config
    self.eventTarget = eventTarget
  }

  func createAnimation() {
    // Clean up existing animation
    cleanupAnimation()

    let sourceString = config.source
    if !sourceString.isEmpty {
      // Build complete AnimationConfig with all available props
      let animationConfig = buildAnimationConfig()

      if sourceString.hasPrefix("file://") {
        if let url = URL(string: sourceString),
           let data = try? Data(contentsOf: url) {
          let animation = DotLottieAnimation(
            dotLottieData: data,
            config: animationConfig
          )
          self.animation = animation
          subscribeToAnimation(animation)
        }
      } else {
        let animation = DotLottieAnimation(
          webURL: sourceString,
          config: animationConfig
        )
        self.animation = animation
        subscribeToAnimation(animation)
      }
    }
  }

  private func subscribeToAnimation(_ animation: DotLottieAnimation) {
    guard let eventTarget = eventTarget else { return }

    // Subscribe to regular animation events
    let eventObserver = DotLottieEventObserver(target: eventTarget)
    observer = eventObserver
    animation.subscribe(observer: eventObserver)

    // Subscribe to state machine events
    let stateMachineObserver = DotLottieStateMachineObserver(target: eventTarget)
    self.stateMachineObserver = stateMachineObserver
    _ = animation.stateMachineSubscribe(stateMachineObserver)
  }

  func buildAnimationConfig() -> AnimationConfig {
    // Build config with all available properties, read from the shared config.
    return AnimationConfig(
      autoplay: config.autoplay,
      loop: config.loop,
      mode: config.toMode(),
      speed: Float(config.speed),
      useFrameInterpolation: config.useFrameInterpolation,
      segments: config.toSegmentTuple(),
      backgroundColor: nil,
      width: nil,  // Use default
      height: nil,  // Use default
      layout: config.toLayout(),
      marker: config.marker,
      themeId: config.themeId,
      stateMachineId: config.stateMachineId
    )
  }

  func cleanupAnimation() {
    // Unsubscribe regular observer if it exists
    if let observer = self.observer, let animation = self.animation {
      animation.unsubscribe(observer: observer)
    }

    // Unsubscribe state machine observer if it exists
    if let stateMachineObserver = self.stateMachineObserver, let animation = self.animation {
      _ = animation.stateMachineUnsubscribe(stateMachineObserver)
    }

    self.observer = nil
    self.stateMachineObserver = nil
    self.animation = nil
  }
}

struct AnimationView: View {
  @EnvironmentObject var dataStore: SoftwareDatastore

  var body: some View {
    if let animation = dataStore.animation {
      DotLottieView(dotLottie: animation)
        .onDisappear {
          cleanupAnimation()
        }
    } else {
      Text("Loading animation...")
        .onAppear {
          dataStore.createAnimation()
        }
    }
  }

  func cleanupAnimation() {
    dataStore.cleanupAnimation()
  }
}
