import DotLottie
import UIKit

#if (os(iOS) && !targetEnvironment(macCatalyst))

/// GPU (Metal/WebGPU) render backend: wraps `DotLottieWebGPUView`, which renders
/// directly to a `CAMetalLayer` via wgpu-native + ThorVG. Exposes the same
/// `DotLottieRenderable` surface as the software backend, routing commands to
/// `view.player` and forwarding events through the shared observers.
///
/// The whole file is Catalyst-guarded because WgpuNative ships no Mac Catalyst
/// slice; on Catalyst (and any non-iOS target) `makeBackend()` falls back to the
/// software backend instead of referencing this type.
final class WebGPURenderBackend: DotLottieRenderable {
  private let view: DotLottieWebGPUView
  private weak var eventTarget: DotLottieEventTarget?
  private let eventObserver: DotLottieEventObserver
  private let smObserver: DotLottieStateMachineObserver

  var platformView: UIView { view }

  init(config: RendererConfig, eventTarget: DotLottieEventTarget) {
    self.eventTarget = eventTarget
    let cfg = Config(
      autoplay: config.autoplay,
      loopAnimation: config.loop,
      mode: config.toMode(),
      speed: Float(config.speed),
      useFrameInterpolation: config.useFrameInterpolation,
      segment: config.toSegmentTuple().map { [$0.0, $0.1] } ?? [],
      layout: config.toLayout(),
      marker: config.marker,
      themeId: config.themeId,
      stateMachineId: config.stateMachineId
    )
    view = DotLottieWebGPUView(config: cfg)
    eventObserver = DotLottieEventObserver(target: eventTarget)
    smObserver = DotLottieStateMachineObserver(target: eventTarget)
    view.subscribe(observer: eventObserver)
    _ = view.stateMachineSubscribe(observer: smObserver)
  }

  func loadSource(_ source: String) {
    guard !source.isEmpty else { return }
    if source.hasPrefix("file://"), let url = URL(string: source),
       let data = try? Data(contentsOf: url) {
      // Content-sniff (spec §6) as the primary decision: inspect the first
      // non-whitespace byte rather than the URL suffix, which is unreliable for
      // file:// URLs with query strings or hashed/extensionless names. A leading
      // `{` or `[` means raw Lottie JSON; anything else is a binary `.lottie`
      // archive. The `.json` suffix is only a secondary hint when the bytes are
      // inconclusive (e.g. an empty / whitespace-only payload).
      if (dataLooksLikeJSON(data) || source.hasSuffix(".json")),
         let json = String(data: data, encoding: .utf8) {
        _ = view.loadAnimationData(json)
      } else {
        _ = view.loadDotlottie(data: data)
      }
      return
    }
    // Remote http(s) — including Metro-served require() assets in Debug — loads
    // natively via the SDK (dotlottie-ios 0.16.2+). The SDK fetches asynchronously
    // and infers .lottie vs JSON from the URL; `loadAnimation(webURL:)` returns
    // false only for a syntactically invalid URL, which is the one failure we can
    // surface synchronously (a later network/parse error arrives via the observer).
    if !view.loadAnimation(webURL: source) {
      print("[DotLottie] wg renderer received an invalid source URL: \(source)")
      eventTarget?.emitLoadError()
    }
  }

  /// True if the first non-whitespace byte looks like JSON (`{` or `[`). Used to
  /// distinguish raw Lottie JSON from a binary `.lottie` archive by content.
  private func dataLooksLikeJSON(_ data: Data) -> Bool {
    for byte in data {
      switch byte {
      case 0x20, 0x09, 0x0A, 0x0D: continue // space, tab, LF, CR
      case 0x7B, 0x5B: return true          // '{' or '['
      default: return false
      }
    }
    return false
  }

  func cleanup() {
    // Partial mitigation: the SDK view self-retains via its CADisplayLink(target: self),
    // so deinit may not run on unmount. pause() halts per-frame GPU work. Full teardown
    // fix is tracked upstream in dotlottie-ios (display-link invalidation on removeFromSuperview).
    _ = view.pause()
    view.unsubscribe(observer: eventObserver)
    _ = view.stateMachineUnsubscribe(observer: smObserver)
  }

  func play() { _ = view.player.play() }
  func pause() { _ = view.player.pause() }
  func stop() { _ = view.player.stop() }
  func setLoop(_ loop: Bool) { _ = view.player.setLoop(loop) }
  func setSpeed(_ speed: Float) { _ = view.player.setSpeed(speed) }
  func setFrame(_ frame: Float) { _ = view.player.setFrame(no: frame) }
  func setMode(_ mode: Mode) { _ = view.player.setMode(mode) }
  func setSegment(start: Float, end: Float) { _ = view.player.setSegment(start: start, end: end) }
  func clearSegment() { _ = view.player.clearSegment() }
  func setMarker(_ marker: String) { _ = view.player.setMarker(marker) }
  func setTheme(_ themeId: String) { _ = view.player.setTheme(themeId: themeId) }
  func setUseFrameInterpolation(_ enabled: Bool) { _ = view.player.setUseFrameInterpolation(enabled) }
  // No recreate-fallback (unlike the software backend): the wgpu player/bridge exists
  // from init — there's no "animation == nil" state — so the initial layout is baked into
  // Config and runtime changes just call setLayout directly. The asymmetry is intentional.
  func setLayout(_ layout: DotLottie.Layout) { _ = view.player.setLayout(layout) }
  func loadAnimation(animationId: String) { _ = view.player.loadAnimation(animationId: animationId) }
  func resize(width: Int, height: Int) { /* no-op: wgpu auto-reconfigures in layoutSubviews */ }

  func stateMachineLoad(id: String) { _ = view.stateMachineLoad(id: id) }
  func stateMachineStart() { _ = view.stateMachineStart() }
  func stateMachineStop() { _ = view.stateMachineStop() }
  func stateMachineFire(event: String) { _ = view.player.stateMachineFireEvent(event: event) }
  func stateMachineSetNumericInput(key: String, value: Float) { _ = view.player.stateMachineSetNumericInput(key: key, value: value) }
  func stateMachineSetStringInput(key: String, value: String) { _ = view.player.stateMachineSetStringInput(key: key, value: value) }
  func stateMachineSetBooleanInput(key: String, value: Bool) { _ = view.player.stateMachineSetBooleanInput(key: key, value: value) }

  var totalFrames: Float { view.player.totalFrames() }
  var duration: Float { view.player.duration() }
  var currentFrame: Float { view.player.currentFrame() }
  var speed: Float { view.player.getSpeed() }
  var isPlaying: Bool { view.player.isPlaying() }
  var isPaused: Bool { view.player.isPaused() }
  var isStopped: Bool { view.player.isStopped() }
  var isLoaded: Bool { view.player.isLoaded() }
  var activeThemeId: String { view.player.activeThemeId() }
  var activeAnimationId: String { view.player.activeAnimationId() }
  var loopCount: UInt32 { view.player.currentLoopCount() }
}

#endif
