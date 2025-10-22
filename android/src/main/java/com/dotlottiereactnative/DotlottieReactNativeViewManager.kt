package com.dotlottiereactnative

import com.dotlottie.dlplayer.Mode
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.annotations.internal.InteropLegacyArchitecture
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@InteropLegacyArchitecture
class DotlottieReactNativeViewManager : SimpleViewManager<DotlottieReactNativeView>() {

  override fun getName() = "DotlottieReactNativeView"

  override fun createViewInstance(reactContext: ThemedReactContext): DotlottieReactNativeView {
    return DotlottieReactNativeView(reactContext)
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
            COMMAND_SET_PLAY_MODE to COMMAND_SET_PLAY_MODE_ID,
            COMMAND_STATE_MACHINE_START to COMMAND_STATE_MACHINE_START_ID,
            COMMAND_STATE_MACHINE_STOP to COMMAND_STATE_MACHINE_STOP_ID,
            COMMAND_STATE_MACHINE_LOAD to COMMAND_STATE_MACHINE_LOAD_ID,
            COMMAND_STATE_MACHINE_FIRE to COMMAND_STATE_MACHINE_FIRE_ID,
            COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT to COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT_ID,
            COMMAND_STATE_MACHINE_SET_STRING_INPUT to COMMAND_STATE_MACHINE_SET_STRING_INPUT_ID,
            COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT to COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT_ID,
            COMMAND_SET_PLAYER_INSTANCE to COMMAND_SET_PLAYER_INSTANCE_ID,
            COMMAND_RESIZE to COMMAND_RESIZE_ID,
            COMMAND_SET_USE_FRAME_INTERPOLATION to COMMAND_SET_USE_FRAME_INTERPOLATION_ID,
            COMMAND_SET_SEGMENT to COMMAND_SET_SEGMENT_ID,
            COMMAND_SET_MARKER to COMMAND_SET_MARKER_ID,
            COMMAND_SET_LAYOUT to COMMAND_SET_LAYOUT_ID,
            COMMAND_SET_THEME to COMMAND_SET_THEME_ID,
            COMMAND_LOAD_ANIMATION to COMMAND_LOAD_ANIMATION_ID,
    )
  }

  private val bubblingEvents = arrayOf(
          "onLoad",
          "onComplete",
          "onLoadError",
          "onPlay",
          "onLoop",
          "onDestroy",
          "onUnFreeze",
          "onFreeze",
          "onPause",
          "onFrame",
          "onStop",
          "onRender"
  )

  private val directEvents = arrayOf(
          "onStateMachineStart",
          "onStateMachineStop",
          "onStateMachineStateEntered",
          "onStateMachineStateExit",
          "onStateMachineTransition",
          "onStateMachineBooleanInputChange",
          "onStateMachineNumericInputChange",
          "onStateMachineStringInputChange",
          "onStateMachineInputFired",
          "onStateMachineCustomEvent",
          "onStateMachineError"
  )

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> =
          getBubblingEventTypeConstants(*bubblingEvents)

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
          getDirectEventTypeConstants(*directEvents)

  override fun receiveCommand(
          view: DotlottieReactNativeView,
          commandId: Int,
          args: ReadableArray?
  ) {

    if (commandId == COMMAND_PLAY_ID) view.dotLottieController.play()
    if (commandId == COMMAND_PAUSE_ID) view.dotLottieController.pause()
    if (commandId == COMMAND_STOP_ID) view.dotLottieController.stop()
    if (commandId == COMMAND_SET_SPEED_ID) {
      val speed = args?.getDouble(0)?.toFloat() ?: 1f
      view.dotLottieController.setSpeed(speed)
    }
    if (commandId == COMMAND_FREEZE_ID) {
      view.dotLottieController.freeze()
    }
    if (commandId == COMMAND_UNFREEZE_ID) {
      view.dotLottieController.unFreeze()
    }
    if (commandId == COMMAND_SET_LOOP_ID) {
      val loop = args?.getBoolean(0) ?: false
      view.dotLottieController.setLoop(loop)
    }

    if (commandId == COMMAND_SET_FRAME_ID) {
      val frame = args?.getDouble(0)?.toFloat() ?: 0f
      view.dotLottieController.setFrame(frame)
    }
    if (commandId == COMMAND_SET_PLAY_MODE_ID) {
      val mode = args?.getInt(0)
      val modeValue = Mode.values()[mode ?: 0]
      view.dotLottieController.setPlayMode(modeValue)
    }

    if (commandId == COMMAND_STATE_MACHINE_START_ID) {
      view.dotLottieController.stateMachineStart()
    }

    if (commandId == COMMAND_STATE_MACHINE_STOP_ID) {
      view.dotLottieController.stateMachineStop()
    }

    if (commandId == COMMAND_STATE_MACHINE_LOAD_ID) {
      val stateMachineId = args?.getString(0) ?: ""
      view.dotLottieController.stateMachineLoad(stateMachineId)
    }

    if (commandId == COMMAND_STATE_MACHINE_FIRE_ID) {
      val event = args?.getString(0) ?: ""
      view.stateMachineFire(event)
    }

    if (commandId == COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT_ID) {
      val key = args?.getString(0) ?: ""
      val value = args?.getDouble(1)?.toFloat() ?: 0f
      view.stateMachineSetNumericInput(key, value)
    }

    if (commandId == COMMAND_STATE_MACHINE_SET_STRING_INPUT_ID) {
      val key = args?.getString(0) ?: ""
      val value = args?.getString(1) ?: ""
      view.stateMachineSetStringInput(key, value)
    }

    if (commandId == COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT_ID) {
      val key = args?.getString(0) ?: ""
      val value = args?.getBoolean(1) ?: false
      view.stateMachineSetBooleanInput(key, value)
    }

    if (commandId == COMMAND_RESIZE_ID) {
      val width = args?.getDouble(0)?.toUInt() ?: 0u
      val height = args?.getDouble(1)?.toUInt() ?: 0u
      view.resize(width, height)
    }

    if (commandId == COMMAND_SET_SEGMENT_ID) {
      val start = args?.getDouble(0)?.toFloat() ?: 0f
      val end = args?.getDouble(1)?.toFloat() ?: 0f
      view.dotLottieController.setSegment(start, end)
    }

    if (commandId == COMMAND_SET_MARKER_ID) {
      val marker = args?.getString(0) ?: ""
      view.dotLottieController.setMarker(marker)
    }

    if (commandId == COMMAND_SET_THEME_ID) {
      val themeId = args?.getString(0) ?: ""
      view.dotLottieController.setTheme(themeId)
    }

    if (commandId == COMMAND_LOAD_ANIMATION_ID) {
      val animationId = args?.getString(0) ?: ""
      view.dotLottieController.loadAnimation(animationId)
    }
  }

  @ReactProp(name = "source")
  fun setSource(view: DotlottieReactNativeView, url: String?) {
    view.setSource(url)
  }

  @ReactProp(name = "loop")
  fun setLoop(view: DotlottieReactNativeView, value: Boolean) {
    view.setLoop(value)
  }

  @ReactProp(name = "autoplay")
  fun setAutoPlay(view: DotlottieReactNativeView, value: Boolean) {
    view.setAutoPlay(value)
  }

  @ReactProp(name = "speed")
  fun setSpeed(view: DotlottieReactNativeView, value: Double) {
    view.setSpeed(value)
  }

  @ReactProp(name = "useFrameInterpolation")
  fun setUseFrameInterpolation(view: DotlottieReactNativeView, value: Boolean) {
    view.setUseFrameInterpolation(value)
  }

  @ReactProp(name = "segment")
  fun setSegment(view: DotlottieReactNativeView, value: ReadableArray?) {
    if (value != null && value.size() == 2) {
      val start = value.getDouble(0)
      val end = value.getDouble(1)
      view.setSegment(start, end)
    } else {
      // Reset to full animation range when segment is undefined
      view.resetSegment()
    }
  }

  @ReactProp(name = "themeId")
  fun setThemeId(view: DotlottieReactNativeView, value: String?) {
    view.setThemeId(value)
  }

  @ReactProp(name = "marker")
  fun setMarker(view: DotlottieReactNativeView, value: String?) {
    view.setMarker(value)
  }

  @ReactProp(name = "playMode")
  fun setPlayMode(view: DotlottieReactNativeView, value: Int) {
    view.setPlayMode(value)
  }

  @ReactProp(name = "stateMachineId")
  fun setStateMachineId(view: DotlottieReactNativeView, value: String?) {
    view.setStateMachineId(value)
  }

  override fun onDropViewInstance(view: DotlottieReactNativeView) {
    super.onDropViewInstance(view)
    view.release()
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

    private const val COMMAND_STATE_MACHINE_START = "stateMachineStart"
    private const val COMMAND_STATE_MACHINE_START_ID = 11

    private const val COMMAND_STATE_MACHINE_STOP = "stateMachineStop"
    private const val COMMAND_STATE_MACHINE_STOP_ID = 12

    private const val COMMAND_STATE_MACHINE_LOAD = "stateMachineLoad"
    private const val COMMAND_STATE_MACHINE_LOAD_ID = 13

    private const val COMMAND_STATE_MACHINE_FIRE = "stateMachineFire"
    private const val COMMAND_STATE_MACHINE_FIRE_ID = 14

    private const val COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT = "stateMachineSetNumericInput"
    private const val COMMAND_STATE_MACHINE_SET_NUMERIC_INPUT_ID = 15

    private const val COMMAND_STATE_MACHINE_SET_STRING_INPUT = "stateMachineSetStringInput"
    private const val COMMAND_STATE_MACHINE_SET_STRING_INPUT_ID = 16

    private const val COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT = "stateMachineSetBooleanInput"
    private const val COMMAND_STATE_MACHINE_SET_BOOLEAN_INPUT_ID = 17

    private const val COMMAND_SET_PLAYER_INSTANCE = "setPlayerInstance"
    private const val COMMAND_SET_PLAYER_INSTANCE_ID = 18

    private const val COMMAND_RESIZE = "resize"
    private const val COMMAND_RESIZE_ID = 19

    private const val COMMAND_SET_USE_FRAME_INTERPOLATION = "setUseFrameInterpolation"
    private const val COMMAND_SET_USE_FRAME_INTERPOLATION_ID = 20

    private const val COMMAND_SET_SEGMENT = "setSegment"
    private const val COMMAND_SET_SEGMENT_ID = 21

    private const val COMMAND_SET_MARKER = "setMarker"
    private const val COMMAND_SET_MARKER_ID = 22

    private const val COMMAND_SET_LAYOUT = "setLayout"
    private const val COMMAND_SET_LAYOUT_ID = 23

    private const val COMMAND_SET_THEME = "setTheme"
    private const val COMMAND_SET_THEME_ID = 24

    private const val COMMAND_LOAD_ANIMATION = "loadAnimation"
    private const val COMMAND_LOAD_ANIMATION_ID = 25
  }
}
