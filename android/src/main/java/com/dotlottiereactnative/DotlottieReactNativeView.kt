package com.dotlottiereactnative

import android.widget.FrameLayout
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.ComposeView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.lottiefiles.dotlottie.core.compose.runtime.DotLottieController
import com.lottiefiles.dotlottie.core.compose.ui.DotLottieAnimation
import com.lottiefiles.dotlottie.core.util.DotLottieEventListener
import com.lottiefiles.dotlottie.core.util.DotLottieSource

class DotlottieReactNativeView(context: ThemedReactContext) : FrameLayout(context) {

  private var reactContext: ReactContext = context.reactApplicationContext
  private var animationUrl: String? = null
  private var loop: Boolean = false
  private var autoplay: Boolean = true
  private var speed: Float = 1f
  var dotLottieController: DotLottieController = DotLottieController()

  private val composeView: ComposeView =
          ComposeView(context).apply {
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
          }

  init {
    addView(composeView)
    // Set initial content
    composeView.setContent { DotLottieContent() }
  }

  fun onReceiveNativeEvent(eventName: String, value: String?) {
    val event = Arguments.createMap().apply { putString("message", value) }
    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, eventName, event)
  }

  @Composable
  fun DotLottieContent() {
    dotLottieController = remember { DotLottieController() }

    animationUrl?.let { url ->
      DotLottieAnimation(
              source = DotLottieSource.Url(url),
              autoplay = autoplay,
              loop = loop,
              speed = speed,
              controller = dotLottieController,
              eventListeners =
                      listOf(
                              object : DotLottieEventListener {
                                override fun onLoad() {
                                  onReceiveNativeEvent("onLoad", null)
                                }
                                override fun onComplete() {

                                  onReceiveNativeEvent("onComplete", null)
                                }
                                override fun onLoadError() {

                                  onReceiveNativeEvent("onLoadError", null)
                                }
                                override fun onPlay() {
                                  onReceiveNativeEvent("onPlay", null)
                                }
                                override fun onStop() {
                                  onReceiveNativeEvent("onRender", null)
                                }
                                override fun onPause() {
                                  onReceiveNativeEvent("onPause", null)
                                }
                                override fun onFreeze() {
                                  onReceiveNativeEvent("onFreeze", null)
                                }
                                override fun onUnFreeze() {
                                  onReceiveNativeEvent("onUnFreeze", null)
                                }
                                override fun onDestroy() {
                                  onReceiveNativeEvent("onDestroy", null)
                                }
                              }
                      )
      )
    }
  }

  fun setSource(url: String?) {
    animationUrl = url
    composeView.setContent { DotLottieContent() }
  }

  fun setLoop(value: Boolean) {
    loop = value
    composeView.setContent { DotLottieContent() }
  }

  fun setAutoPlay(value: Boolean) {
    autoplay = value
    composeView.setContent { DotLottieContent() }
  }

  fun setSpeed(value: Double) {
    speed = value.toFloat()
    composeView.setContent { DotLottieContent() }
  }
}
