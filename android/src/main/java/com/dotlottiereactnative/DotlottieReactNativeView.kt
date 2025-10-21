package com.dotlottiereactnative

import android.graphics.Color
import android.widget.FrameLayout
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.ComposeView
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
  private var stateMachineId: String? = null
  var dotLottieController: DotLottieController = DotLottieController()
  private val stateMachineEventListener: StateMachineEventListener = createStateMachineEventListener()

  private val composeView: ComposeView =
          ComposeView(context).apply {
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
          }

  init {
    addView(composeView)
    dotLottieController.stateMachineAddEventListener(stateMachineEventListener)
    composeView.setContent { DotLottieContent() }
  }

  fun onReceiveNativeEvent(eventName: String, value: WritableMap?) {

    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, eventName, value)
  }

  @Composable
  fun DotLottieContent() {
    animationUrl?.let { url ->
      DotLottieAnimation(
              source = DotLottieSource.Url(url),
              autoplay = autoplay,
              loop = loop,
              speed = speed,
              controller = dotLottieController,
              useFrameInterpolation = useFrameInterpolation,
              themeId = themeId,
              stateMachineId = stateMachineId,
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
                                  onReceiveNativeEvent("onStop", null)
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
                                override fun onFrame(frame: Float) {
                                  val value =
                                    Arguments.createMap().apply {
                                      putDouble("frameNo", frame.toDouble())
                                    }
                                  onReceiveNativeEvent("onFrame", value)
                                }
                                override fun onLoop(loopCount: Int) {
                                  val value =
                                    Arguments.createMap().apply {
                                      putInt("loopCount", loopCount)
                                    }
                                  onReceiveNativeEvent("onLoop", value)
                                }
                                override fun onRender(frameNo: Float) {
                                  val value =
                                    Arguments.createMap().apply {
                                      putDouble("frameNo", frameNo.toDouble())
                                    }
                                  onReceiveNativeEvent("onRender", value)
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
    dotLottieController.setLoop(value)
  }

  fun setAutoPlay(value: Boolean) {
    autoplay = value
    if (value) {
      dotLottieController.play()
    } else {
      dotLottieController.pause()
    }
  }

  fun setSpeed(value: Double) {
    speed = value.toFloat()
    dotLottieController.setSpeed(speed)
  }

  fun setUseFrameInterpolation(value: Boolean) {
    useFrameInterpolation = value
    dotLottieController.setUseFrameInterpolation(value)
  }

  fun setThemeId(value: String?) {
    themeId = value
    value?.let { dotLottieController.setTheme(it) }
  }

  fun setMarker(value: String?) {
    marker = value
    value?.let { dotLottieController.setMarker(it) }
  }

  fun setSegment(start: Double, end: Double) {
    segment = Pair(start.toFloat(), end.toFloat())
    dotLottieController.setSegment(start.toFloat(), end.toFloat())
  }

  fun resetSegment() {
    segment = null
    // Reset to full animation range when segment is undefined
    val totalFrames = dotLottieController.totalFrames
    dotLottieController.setSegment(0f, totalFrames)
  }

  fun setPlayMode(value: Int) {
    playMode = Mode.values().getOrNull(value) ?: Mode.FORWARD
    dotLottieController.setPlayMode(playMode)
  }

  fun setStateMachineId(value: String?) {
    stateMachineId = value
    if (value != null && value.isNotEmpty()) {
      val result = dotLottieController.stateMachineLoad(value)
      if (result) {
        dotLottieController.stateMachineStart()
      }
    } else {
      dotLottieController.stateMachineStop()
    }
  }

  fun stateMachineFire(event: String) {
    dotLottieController.stateMachineFire(event)
  }

  fun stateMachineSetNumericInput(key: String, value: Float): Boolean {
    return dotLottieController.stateMachineSetNumericInput(key, value)
  }

  fun stateMachineSetStringInput(key: String, value: String): Boolean {
    return dotLottieController.stateMachineSetStringInput(key, value)
  }

  fun stateMachineSetBooleanInput(key: String, value: Boolean): Boolean {
    return dotLottieController.stateMachineSetBooleanInput(key, value)
  }

  fun resize(width: UInt, height: UInt) {
    dotLottieController.resize(width, height)
  }

  private fun createStateMachineEventListener(): StateMachineEventListener {
    return object : StateMachineEventListener {
      override fun onStart() {
        onReceiveNativeEvent("onStateMachineStart", null)
      }

      override fun onStop() {
        onReceiveNativeEvent("onStateMachineStop", null)
      }

      override fun onStateEntered(enteringState: String) {
        val value = Arguments.createMap().apply {
          putString("enteringState", enteringState)
        }
        onReceiveNativeEvent("onStateMachineStateEntered", value)
      }

      override fun onStateExit(leavingState: String) {
        val value = Arguments.createMap().apply {
          putString("leavingState", leavingState)
        }
        onReceiveNativeEvent("onStateMachineStateExit", value)
      }

      override fun onTransition(previousState: String, newState: String) {
        val value = Arguments.createMap().apply {
          putString("previousState", previousState)
          putString("newState", newState)
        }
        onReceiveNativeEvent("onStateMachineTransition", value)
      }

      override fun onBooleanInputValueChange(inputName: String, oldValue: Boolean, newValue: Boolean) {
        val value = Arguments.createMap().apply {
          putString("inputName", inputName)
          putBoolean("oldValue", oldValue)
          putBoolean("newValue", newValue)
        }
        onReceiveNativeEvent("onStateMachineBooleanInputChange", value)
      }

      override fun onNumericInputValueChange(inputName: String, oldValue: Float, newValue: Float) {
        val value = Arguments.createMap().apply {
          putString("inputName", inputName)
          putDouble("oldValue", oldValue.toDouble())
          putDouble("newValue", newValue.toDouble())
        }
        onReceiveNativeEvent("onStateMachineNumericInputChange", value)
      }

      override fun onStringInputValueChange(inputName: String, oldValue: String, newValue: String) {
        val value = Arguments.createMap().apply {
          putString("inputName", inputName)
          putString("oldValue", oldValue)
          putString("newValue", newValue)
        }
        onReceiveNativeEvent("onStateMachineStringInputChange", value)
      }

      override fun onInputFired(inputName: String) {
        val value = Arguments.createMap().apply {
          putString("inputName", inputName)
        }
        onReceiveNativeEvent("onStateMachineInputFired", value)
      }

      override fun onCustomEvent(message: String) {
        val value = Arguments.createMap().apply {
          putString("message", message)
        }
        onReceiveNativeEvent("onStateMachineCustomEvent", value)
      }

      override fun onError(message: String) {
        val value = Arguments.createMap().apply {
          putString("message", message)
        }
        onReceiveNativeEvent("onStateMachineError", value)
      }
    }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    cleanup()
  }

  private fun cleanup() {
    try {
      dotLottieController.stop()

      if (dotLottieController.stateMachineIsActive) {
        dotLottieController.stateMachineStop()
      }

      dotLottieController.stateMachineRemoveEventListener(stateMachineEventListener)
      dotLottieController.clearEventListeners()
    } catch (e: IllegalStateException) {
      android.util.Log.w("DotLottie", "cleanup called on already destroyed player: ${e.message}")
    } catch (e: Exception) {
      android.util.Log.e("DotLottie", "Error during cleanup: ${e.message}")
    } finally {
      composeView.disposeComposition()
    }
  }
}
