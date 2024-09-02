package com.dotlottiereactnative

import com.dotlottie.dlplayer.Mode
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

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
            COMMAND_SET_PLAY_MODE to COMMAND_SET_PLAY_MODE_ID
    )
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> {
    return getEventTypeConstants(
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
            "onRender",
            "onLoop"
    )
  }

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
