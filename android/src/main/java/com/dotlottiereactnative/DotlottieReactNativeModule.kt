package com.dotlottiereactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.bridge.UiThreadUtil

@ReactModule(name = DotlottieReactNativeModule.NAME)
class DotlottieReactNativeModule(private val reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "DotlottieReactNativeModule"
    private const val ERROR_VIEW_NOT_FOUND = "E_DOTLOTTIE_VIEW_NOT_FOUND"
  }

  override fun getName() = NAME

  @ReactMethod
  fun getTotalFrames(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.getTotalFrames().toDouble())
    }
  }

  @ReactMethod
  fun getDuration(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.getDuration().toDouble())
    }
  }

  @ReactMethod
  fun getSpeed(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.getSpeed().toDouble())
    }
  }

  @ReactMethod
  fun getCurrentFrame(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.getCurrentFrame().toDouble())
    }
  }

  @ReactMethod
  fun isPaused(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.isPaused())
    }
  }

  @ReactMethod
  fun isPlaying(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.isPlaying())
    }
  }

  @ReactMethod
  fun isStopped(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.isStopped())
    }
  }

  @ReactMethod
  fun isLoaded(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.isLoaded())
    }
  }

  @ReactMethod
  fun getActiveThemeId(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.getActiveThemeId())
    }
  }

  @ReactMethod
  fun getActiveAnimationId(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.getActiveAnimationId())
    }
  }

  @ReactMethod
  fun getLoopCount(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.getLoopCount())
    }
  }

  @ReactMethod
  fun getAudioVolume(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.audioVolume.toDouble())
    }
  }

  @ReactMethod
  fun getMarkers(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      val markers = Arguments.createArray()
      view.dotLottieController.markers.forEach { marker ->
        markers.pushMap(
                Arguments.createMap().apply {
                  putString("name", marker.name)
                  putDouble("time", marker.start.toDouble())
                  putDouble("duration", (marker.end - marker.start).toDouble())
                }
        )
      }
      promise.resolve(markers)
    }
  }

  @ReactMethod
  fun getManifest(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      // The player returns a manifest without animations when the source is not a .lottie file.
      val manifest = view.dotLottieController.manifest()?.takeIf { it.animations.isNotEmpty() }
      if (manifest == null) {
        promise.resolve(null)
        return@withDotlottieView
      }

      val animations = Arguments.createArray()
      manifest.animations.forEach { animation ->
        animations.pushMap(
                Arguments.createMap().apply {
                  putString("id", animation.id)
                  animation.name?.let { putString("name", it) }
                  animation.initialTheme?.let { putString("initialTheme", it) }
                  animation.background?.let { putString("background", it) }
                  animation.themes?.let { themes ->
                    putArray("themes", Arguments.createArray().apply { themes.forEach { pushString(it) } })
                  }
                }
        )
      }

      val result = Arguments.createMap().apply {
        manifest.generator?.let { putString("generator", it) }
        manifest.version?.let { putString("version", it) }
        putArray("animations", animations)
        manifest.themes?.let { themes ->
          putArray(
                  "themes",
                  Arguments.createArray().apply {
                    themes.forEach { theme ->
                      pushMap(
                              Arguments.createMap().apply {
                                putString("id", theme.id)
                                theme.name?.let { putString("name", it) }
                              }
                      )
                    }
                  }
          )
        }
        manifest.stateMachines?.let { stateMachines ->
          putArray(
                  "stateMachines",
                  Arguments.createArray().apply {
                    stateMachines.forEach { stateMachine ->
                      pushMap(
                              Arguments.createMap().apply {
                                putString("id", stateMachine.id)
                                stateMachine.name?.let { putString("name", it) }
                              }
                      )
                    }
                  }
          )
        }
        manifest.initial?.let { initial ->
          putMap(
                  "initial",
                  Arguments.createMap().apply {
                    initial.animation?.let { putString("animation", it) }
                    initial.stateMachine?.let { putString("stateMachine", it) }
                  }
          )
        }
      }
      promise.resolve(result)
    }
  }

  @ReactMethod
  fun getSlotIds(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      val slotIds = Arguments.createArray()
      view.dotLottieController.getSlotIds().forEach { slotIds.pushString(it) }
      promise.resolve(slotIds)
    }
  }

  @ReactMethod
  fun getSlotType(viewTag: Int, slotId: String, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.getSlotType(slotId))
    }
  }

  @ReactMethod
  fun getSlot(viewTag: Int, slotId: String, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.getSlot(slotId))
    }
  }

  @ReactMethod
  fun getSlots(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.getSlots())
    }
  }

  @ReactMethod
  fun stateMachineGetNumericInput(viewTag: Int, key: String, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.stateMachineGetNumericInput(key)?.toDouble())
    }
  }

  @ReactMethod
  fun stateMachineGetStringInput(viewTag: Int, key: String, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.stateMachineGetStringInput(key))
    }
  }

  @ReactMethod
  fun stateMachineGetBooleanInput(viewTag: Int, key: String, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.stateMachineGetBooleanInput(key))
    }
  }

  @ReactMethod
  fun stateMachineCurrentState(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.stateMachineCurrentState() ?: "")
    }
  }

  @ReactMethod
  fun stateMachineStatus(viewTag: Int, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.stateMachineStatus() ?: "")
    }
  }

  @ReactMethod
  fun getStateMachine(viewTag: Int, stateMachineId: String, promise: Promise) {
    withDotlottieView(viewTag, promise) { view ->
      promise.resolve(view.dotLottieController.getStateMachine(stateMachineId))
    }
  }

  private fun withDotlottieView(
      viewTag: Int,
      promise: Promise,
      block: (DotlottieReactNativeView) -> Unit
  ) {
    UiThreadUtil.runOnUiThread {
      val uiManager = UIManagerHelper.getUIManagerForReactTag(reactContext, viewTag)
      if (uiManager == null) {
        promise.reject(ERROR_VIEW_NOT_FOUND, "Unable to resolve UIManager for viewTag $viewTag.")
        return@runOnUiThread
      }

      val view = try {
        uiManager.resolveView(viewTag)
      } catch (exception: Exception) {
        promise.reject(ERROR_VIEW_NOT_FOUND, "Failed to resolve view for tag $viewTag.", exception)
        return@runOnUiThread
      }

      if (view !is DotlottieReactNativeView) {
        promise.reject(ERROR_VIEW_NOT_FOUND, "Dotlottie view with tag $viewTag not found.")
        return@runOnUiThread
      }

      block(view)
    }
  }
}
