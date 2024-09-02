package com.dotlottiereactnative

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.ComposeView
import com.dotlottie.dlplayer.Mode
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
  private var speed: Float = 1f
  private var dotLottieController: DotLottieController = DotLottieController()

  override fun getName() = "DotlottieReactNativeView"

  override fun createViewInstance(reactContext: ThemedReactContext): ComposeView {
    return ComposeView(reactContext).apply { setContent { DotLottieContent() } }
  }

  override fun getCommandsMap(): MutableMap<String, Int> {
    return mutableMapOf(
            COMMAND_PLAY to COMMAND_PLAY_ID,
            COMMAND_PAUSE to COMMAND_PAUSE_ID,
            COMMAND_STOP to COMMAND_STOP_ID,
            COMMAND_SET_SPEED to COMMAND_SET_SPEED_ID,
            COMMAND_FREEZE to COMMAND_FREEZE_ID,
            COMMAND_UNFREEZE to COMMAND_UNFREEZE_ID,
            COMMAND_SET_LOOP to COMMAND_SET_LOOP_ID,
            COMMAND_SET_FRAME to COMMAND_SET_FRAME_ID,
            COMMAND_SET_PLAY_MODE to COMMAND_SET_PLAY_MODE_ID
    )
  }

  override fun receiveCommand(root: ComposeView, commandId: Int, args: ReadableArray?) {

    // play()	Starts or resumes the animation.
    // pause()	Pauses the animation.
    // stop()	Stops the animation and resets to the beginning.
    // setPlayerInstance(player: DotLottiePlayer)	Sets the DotLottiePlayer instance to be
    // controlled.
    // resize(width: UInt, height: UInt)	Resizes the animation view.
    // setFrame(frame: Float)	Sets the current frame of the animation.
    // setUseFrameInterpolation(enable: Boolean)	Enables or disables frame interpolation.
    // setSegments(firstFrame: Float, lastFrame: Float)	Defines the start and end frames for a
    // segment of the animation to play.
    // setLoop(loop: Boolean)	Sets whether the animation should loop.
    // freeze()	Freezes the animation at the current frame.
    // unFreeze()	Unfreezes the animation, allowing it to continue.
    // setSpeed(speed: Float)	Sets the playback speed of the animation.
    // setPlayMode(mode: Mode)	Sets the play mode of the animation.
    // addEventListener(listener: DotLottieEventListener)	Adds an event listener to receive
    // animation events.
    // removeEventListener(listener: DotLottieEventListener)	Removes an event listener.
    // loadStateMachine(stateMachineId: String): Boolean	Loads a specific state machine.
    // startStateMachine(): Boolean	Removes an event listener.
    // stopStateMachine(): Boolean	Stops the state machine.
    // postEvent(event: Event): Boolean	Triggers state machine events.
    // addStateMachineEventListener(listener: StateMachineEventListener)	Listen to state machine
    // transition events.
    // removeStateMachineEventListener(listener: StateMachineEventListener
    if (commandId == COMMAND_PLAY_ID) dotLottieController.play()
    if (commandId == COMMAND_PAUSE_ID) dotLottieController.pause()
    if (commandId == COMMAND_STOP_ID) dotLottieController.stop()
    if (commandId == COMMAND_SET_SPEED_ID) {
      val speed = args?.getDouble(0)?.toFloat() ?: 1f
      dotLottieController.setSpeed(speed)
    }
    if (commandId == COMMAND_FREEZE_ID) {
      dotLottieController.freeze()
    }
    if (commandId == COMMAND_UNFREEZE_ID) {
      dotLottieController.unFreeze()
    }
    if (commandId == COMMAND_SET_LOOP_ID) {
      val loop = args?.getBoolean(0) ?: false
      dotLottieController.setLoop(loop)
    }

    if (commandId == COMMAND_SET_FRAME_ID) {
      val frame = args?.getDouble(0)?.toFloat() ?: 0f
      dotLottieController.setFrame(frame)
    }
    if (commandId == COMMAND_SET_PLAY_MODE_ID) {
      val mode = args?.getInt(0)
      val modeValue = Mode.values()[mode ?: 0]
      dotLottieController.setPlayMode(modeValue)
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
              speed = speed,
              controller = dotLottieController,
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

  @ReactProp(name = "speed")
  fun setSpeed(view: ComposeView, value: Double) {
    speed = value.toFloat()
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

    private const val COMMAND_FREEZE = "freeze"
    private const val COMMAND_FREEZE_ID = 5

    private const val COMMAND_UNFREEZE = "unFreeze"
    private const val COMMAND_UNFREEZE_ID = 6

    private const val COMMAND_SET_LOOP = "setLoop"
    private const val COMMAND_SET_LOOP_ID = 7

    private const val COMMAND_SET_PROGRESS = "setProgress"
    private const val COMMAND_SET_PROGRESS_ID = 8

    private const val COMMAND_SET_FRAME = "setFrame"
    private const val COMMAND_SET_FRAME_ID = 9

    private const val COMMAND_SET_PLAY_MODE = "setPlayMode"
    private const val COMMAND_SET_PLAY_MODE_ID = 10
  }
}
