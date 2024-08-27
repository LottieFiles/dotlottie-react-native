package com.dotlottiereactnative

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.ComposeView
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.lottiefiles.dotlottie.core.compose.runtime.DotLottieController
import com.lottiefiles.dotlottie.core.compose.ui.DotLottieAnimation
import com.lottiefiles.dotlottie.core.util.DotLottieSource

class DotlottieReactNativeViewManager : SimpleViewManager<ComposeView>() {

  private var animationUrl: String? = null
  private var loop: Boolean = false
  private var autoplay: Boolean = true
  private var dotLottieController: DotLottieController = DotLottieController()

  override fun getName() = "DotlottieReactNativeView"

  override fun createViewInstance(reactContext: ThemedReactContext): ComposeView {
    return ComposeView(reactContext).apply { setContent { DotLottieContent() } }
  }

  override fun getCommandsMap(): MutableMap<String, Int> {
    return mutableMapOf(COMMAND_PLAY to COMMAND_PLAY_ID)
  }

  override fun receiveCommand(root: ComposeView, commandId: Int, args: ReadableArray?) {
    if (commandId == COMMAND_PLAY_ID) dotLottieController.play()
    if (commandId == COMMAND_PAUSE_ID) dotLottieController.pause()
    if (commandId == COMMAND_STOP_ID) dotLottieController.stop()
    if (commandId == COMMAND_SET_SPEED_ID) {
      val speed = args?.getDouble(0)?.toFloat() ?: 1f
      dotLottieController.setSpeed(speed)
    }
  }

  @Composable
  fun DotLottieContent() {
    dotLottieController = remember { DotLottieController() }

    animationUrl?.let { url ->
      DotLottieAnimation(
              source = DotLottieSource.Url(url),
              autoplay = autoplay,
              loop = loop,
              controller = dotLottieController
      )
    }
  }

  @ReactMethod
  fun setProgress(value: Boolean) {

    dotLottieController.setLoop(value)
  }

  @ReactProp(name = "source")
  fun setSource(view: ComposeView, url: String?) {
    // Update the URL and re-compose the view
    animationUrl = url
    view.setContent { DotLottieContent() }
  }

  @ReactProp(name = "loop")
  fun setLoop(view: ComposeView, value: Boolean) {
    loop = value
    view.setContent { DotLottieContent() }
  }

  @ReactProp(name = "autoplay")
  fun setAutoPlay(view: ComposeView, value: Boolean) {
    autoplay = value
    view.setContent { DotLottieContent() }
  }

  companion object {
    const val TAG = "DotlottieReactNativeViewManager"

    private const val COMMAND_PLAY = "play"
    private const val COMMAND_PLAY_ID = 1

    private const val COMMAND_PAUSE = "pause"
    private const val COMMAND_PAUSE_ID = 2

    private const val COMMAND_STOP = "stop"
    private const val COMMAND_STOP_ID = 3

    private const val COMMAND_SET_SPEED = "setSpeed"
    private const val COMMAND_SET_SPEED_ID = 4

    const val EVENT_ON_TEXT_CHANGED = "onTextChanged"
  }
}
