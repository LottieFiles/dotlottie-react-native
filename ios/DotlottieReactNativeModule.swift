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
      let frames = Double(view._animation?.totalFrames() ?? 0)
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
      let duration = Double(view._animation?.duration() ?? 0)
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
      let speed = Double(view._animation?.speed() ?? 0)
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
      let frame = Double(view._animation?.currentFrame() ?? 0)
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
      let paused = view._animation?.isPaused() ?? false
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
      let playing = view._animation?.isPlaying() ?? false
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
      let stopped = view._animation?.isStopped() ?? false
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
      let loaded = view._animation?.isLoaded() ?? false
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
      let themeId = view._animation?.activeThemeId() ?? ""
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
      let animationId = view._animation?.activeAnimationId() ?? ""
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
      let loopCount = view._animation?.loopCount() ?? 0
      resolve(loopCount)
    }
  }

  @objc(getAudioVolume:resolver:rejecter:)
  func getAudioVolume(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let volume = Double(view._animation?.audioVolume() ?? 1)
      resolve(volume)
    }
  }

  @objc(getMarkers:resolver:rejecter:)
  func getMarkers(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      // The iOS player reports the marker's end frame in `duration`.
      let markers = (view._animation?.markers() ?? []).map { marker -> [String: Any] in
        [
          "name": marker.name,
          "time": Double(marker.time),
          "duration": Double(marker.duration - marker.time)
        ]
      }
      resolve(markers)
    }
  }

  @objc(getManifest:resolver:rejecter:)
  func getManifest(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      guard let manifest = view._animation?.manifest() else {
        resolve(nil)
        return
      }

      var result: [String: Any] = [
        "animations": manifest.animations.map { animation -> [String: Any] in
          let values: [String: Any?] = [
            "id": animation.id,
            "name": animation.name,
            "initialTheme": animation.initialTheme,
            "background": animation.background,
            "themes": animation.themes
          ]
          return values.compactMapValues { $0 }
        }
      ]
      if let generator = manifest.generator {
        result["generator"] = generator
      }
      if let version = manifest.version {
        result["version"] = version
      }
      if let themes = manifest.themes {
        result["themes"] = themes.map { theme -> [String: Any] in
          let values: [String: Any?] = ["id": theme.id, "name": theme.name]
          return values.compactMapValues { $0 }
        }
      }
      if let stateMachines = manifest.stateMachines {
        result["stateMachines"] = stateMachines.map { stateMachine -> [String: Any] in
          let values: [String: Any?] = ["id": stateMachine.id, "name": stateMachine.name]
          return values.compactMapValues { $0 }
        }
      }
      if let initial = manifest.initial {
        let values: [String: Any?] = [
          "animation": initial.animation,
          "stateMachine": initial.stateMachine
        ]
        result["initial"] = values.compactMapValues { $0 }
      }
      resolve(result)
    }
  }

  @objc(getSlotIds:resolver:rejecter:)
  func getSlotIds(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let slotIds = view._animation?.getSlotIds() ?? []
      resolve(slotIds)
    }
  }

  @objc(getSlotType:slotId:resolver:rejecter:)
  func getSlotType(
    _ node: NSNumber,
    slotId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let slotType = view._animation?.getSlotType(slotId: slotId)
      resolve(slotType)
    }
  }

  @objc(getSlot:slotId:resolver:rejecter:)
  func getSlot(
    _ node: NSNumber,
    slotId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let slot = view._animation?.getSlot(slotId: slotId)
      resolve(slot)
    }
  }

  @objc(getSlots:resolver:rejecter:)
  func getSlots(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let slots = view._animation?.getSlots() ?? "{}"
      resolve(slots)
    }
  }

  @objc(stateMachineGetNumericInput:key:resolver:rejecter:)
  func stateMachineGetNumericInput(
    _ node: NSNumber,
    key: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let value = view._animation.map { Double($0.stateMachineGetNumericInput(key: key)) }
      resolve(value)
    }
  }

  @objc(stateMachineGetStringInput:key:resolver:rejecter:)
  func stateMachineGetStringInput(
    _ node: NSNumber,
    key: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let value = view._animation?.stateMachineGetStringInput(key: key)
      resolve(value)
    }
  }

  @objc(stateMachineGetBooleanInput:key:resolver:rejecter:)
  func stateMachineGetBooleanInput(
    _ node: NSNumber,
    key: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let value = view._animation?.stateMachineGetBooleanInput(key: key)
      resolve(value)
    }
  }

  @objc(stateMachineCurrentState:resolver:rejecter:)
  func stateMachineCurrentState(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let state = view._animation?.stateMachineCurrentState() ?? ""
      resolve(state)
    }
  }

  @objc(stateMachineStatus:resolver:rejecter:)
  func stateMachineStatus(
    _ node: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let status = view._animation?.stateMachineStatus() ?? ""
      resolve(status)
    }
  }

  @objc(getStateMachine:stateMachineId:resolver:rejecter:)
  func getStateMachine(
    _ node: NSNumber,
    stateMachineId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    withDotlottieView(node, rejecter: reject) { view in
      let definition = view._animation?.getStateMachine(stateMachineId) ?? ""
      resolve(definition.isEmpty ? nil : definition)
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
