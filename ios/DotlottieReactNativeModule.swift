import Foundation

@objc(DotlottieReactNativeModule)
class DotlottieReactNativeModule: NSObject, RCTBridgeModule {
  static func moduleName() -> String! {
    return "DotlottieReactNativeModule"
  }

  static func requiresMainQueueSetup() -> Bool {
    // Accessing UI components requires main queue to be safe.
    return true
  }

  @objc var bridge: RCTBridge!

  @objc(getTotalFrames:resolver:rejecter:)
  func getTotalFrames(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let frames = Double(view.backend?.totalFrames ?? 0)
      resolve(frames)
    }
  }

  @objc(getDuration:resolver:rejecter:)
  func getDuration(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let duration = Double(view.backend?.duration ?? 0)
      resolve(duration)
    }
  }

  @objc(getSpeed:resolver:rejecter:)
  func getSpeed(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let speed = Double(view.backend?.speed ?? 0)
      resolve(speed)
    }
  }

  @objc(getCurrentFrame:resolver:rejecter:)
  func getCurrentFrame(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let frame = Double(view.backend?.currentFrame ?? 0)
      resolve(frame)
    }
  }

  @objc(isPaused:resolver:rejecter:)
  func isPaused(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let paused = view.backend?.isPaused ?? false
      resolve(paused)
    }
  }

  @objc(isPlaying:resolver:rejecter:)
  func isPlaying(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let playing = view.backend?.isPlaying ?? false
      resolve(playing)
    }
  }

  @objc(isStopped:resolver:rejecter:)
  func isStopped(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let stopped = view.backend?.isStopped ?? false
      resolve(stopped)
    }
  }

  @objc(isLoaded:resolver:rejecter:)
  func isLoaded(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let loaded = view.backend?.isLoaded ?? false
      resolve(loaded)
    }
  }

  @objc(getActiveThemeId:resolver:rejecter:)
  func getActiveThemeId(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let themeId = view.backend?.activeThemeId ?? ""
      resolve(themeId)
    }
  }

  @objc(getActiveAnimationId:resolver:rejecter:)
  func getActiveAnimationId(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let animationId = view.backend?.activeAnimationId ?? ""
      resolve(animationId)
    }
  }

  @objc(getLoopCount:resolver:rejecter:)
  func getLoopCount(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let loopCount = view.backend?.loopCount ?? 0
      resolve(loopCount)
    }
  }

  private func withDotlottieView(
    _ node: NSNumber,
    rejecter reject: @escaping RCTPromiseRejectBlock,
    block: @escaping (DotlottieReactNativeView) -> Void
  ) {
    DispatchQueue.main.async {
      guard
        let view = self.bridge.uiManager?.view(forReactTag: node) as? DotlottieReactNativeView
      else {
        reject(
          "E_DOTLOTTIE_VIEW_NOT_FOUND",
          "Dotlottie view with tag \(node) not found.",
          nil
        )
        return
      }

      block(view)
    }
  }
}
