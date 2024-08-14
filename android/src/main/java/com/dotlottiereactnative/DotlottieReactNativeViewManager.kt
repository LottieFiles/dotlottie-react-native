package com.dotlottiereactnative

import android.view.View
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.ComposeView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.lottiefiles.dotlottie.core.compose.ui.DotLottieAnimation
import com.lottiefiles.dotlottie.core.util.DotLottieSource

class DotlottieReactNativeViewManager : SimpleViewManager<View>() {

  private var animationUrl: String? = null
  private var loop: Boolean = false
  private var autoplay: Boolean = true

  override fun getName() = "DotlottieReactNativeView"

  override fun createViewInstance(reactContext: ThemedReactContext): ComposeView {
    return ComposeView(reactContext).apply { setContent { DotLottieContent() } }
  }

  @Composable
  fun DotLottieContent() {
    // Use the URL to load the animation
    animationUrl?.let { url ->
      DotLottieAnimation(source = DotLottieSource.Url(url), autoplay = autoplay, loop = loop)
    }
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
}
