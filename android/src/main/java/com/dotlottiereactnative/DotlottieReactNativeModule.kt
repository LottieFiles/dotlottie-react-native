package com.dotlottiereactnative

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
