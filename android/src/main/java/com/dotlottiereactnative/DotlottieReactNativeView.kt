package com.dotlottiereactnative

import android.widget.FrameLayout
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.ComposeView
import com.dotlottie.dlplayer.Event
import com.dotlottie.dlplayer.Mode
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.lottiefiles.dotlottie.core.compose.runtime.DotLottieController
import com.lottiefiles.dotlottie.core.compose.ui.DotLottieAnimation
import com.lottiefiles.dotlottie.core.util.DotLottieEventListener
import com.lottiefiles.dotlottie.core.util.DotLottieSource
import com.lottiefiles.dotlottie.core.util.StateMachineEventListener

class DotlottieReactNativeView(context: ThemedReactContext) : FrameLayout(context) {

  private var reactContext: ReactContext = context.reactApplicationContext
  private var animationUrl: String? = null
  private var loop: Boolean = false
  private var autoplay: Boolean = true
  private var speed: Float = 1f
  private var useFrameInterpolation: Boolean = false
  private var themeId: String? = null
  private var marker: String? = null
  private var segment: Pair<Float, Float>? = null
  private var playMode: Mode = Mode.FORWARD
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

  fun onReceiveNativeEvent(eventName: String, value: WritableMap?) {

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, eventName, value)
  }

  @Composable
  fun DotLottieContent() {
    dotLottieController = remember { DotLottieController() }

    val stateListener = remember {
      object : StateMachineEventListener {
        override fun onTransition(previousState: String, newState: String) {
          val value =
                  Arguments.createMap().apply {
                    putString("previousState", previousState)
                    putString("newState", newState)
                  }

          onReceiveNativeEvent("onTransition", value)
        }

        override fun onStateExit(leavingState: String) {
          val value = Arguments.createMap().apply { putString("leavingState", leavingState) }
          onReceiveNativeEvent("onStateExit", value)
        }

        override fun onStateEntered(enteringState: String) {
          val value = Arguments.createMap().apply { putString("enteringState", enteringState) }
          println("enteringState")
          onReceiveNativeEvent("onStateEntered", value)
        }
      }
    }

    LaunchedEffect(UInt) { dotLottieController.stateMachineAddEventListener(stateListener) }

    animationUrl?.let { url ->
      DotLottieAnimation(
              source = DotLottieSource.Url(url),
              autoplay = autoplay,
              loop = loop,
              speed = speed,
              controller = dotLottieController,
              useFrameInterpolation = useFrameInterpolation,
              themeId = themeId,
              marker = marker,
              segment = segment,
              playMode = playMode,
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

  fun setUseFrameInterpolation(value: Boolean) {
    useFrameInterpolation = value
    composeView.setContent { DotLottieContent() }
  }

  fun setThemeId(value: String?) {
    themeId = value
    composeView.setContent { DotLottieContent() }
  }

  fun setMarker(value: String?) {
    marker = value
    composeView.setContent { DotLottieContent() }
  }

  fun setSegment(start: Double, end: Double) {
    segment = Pair(start.toFloat(), end.toFloat())
    composeView.setContent { DotLottieContent() }
  }

  fun postEvent(event: String) {
    // dotLottieController.stateMachinePostEvent(Event.String(event))
  }

  fun resize(width: UInt, height: UInt) {
    dotLottieController.resize(width, height)
  }
}
