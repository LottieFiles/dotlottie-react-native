import DotLottie


class AnimationViewController: UIViewController {
    var simpleVM = DotLottieAnimation(webURL: "https://lottie.host/link.lottie", config: AnimationConfig(autoplay: true, loop: false))

    override func viewWillAppear(_ animated: Bool) {
        let dotLottieView = simpleVM.createDotLottieView()
        view.addSubview(dotLottieView)
    }
}

@objc(DotlottieReactNativeViewManager)
class DotlottieReactNativeViewManager: RCTViewManager {

  override func view() -> (DotlottieReactNativeView) {
    return DotlottieReactNativeView()
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

class DotlottieReactNativeView: UIView {

  private var animationViewController: AnimationViewController?

  override init(frame: CGRect) {
    super.init(frame: frame)
    setupAnimationViewController()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupAnimationViewController()
  }

  private func setupAnimationViewController() {
    // Initialize AnimationViewController
    animationViewController = AnimationViewController()

    // Ensure the view controller is not nil
    guard let animationVC = animationViewController else { return }

    // Add the AnimationViewController's view to the current view
    addSubview(animationVC.view)

    // Set up the frame and autoresizing mask to handle resizing
    animationVC.view.frame = self.bounds
    animationVC.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]

    // Add the view controller to the current view's hierarchy
    if let parentViewController = self.parentViewController {
      parentViewController.addChild(animationVC)
      animationVC.didMove(toParent: parentViewController)
    }
  }
}


extension UIView {
    var parentViewController: UIViewController? {
        var parentResponder: UIResponder? = self
        while parentResponder != nil {
            parentResponder = parentResponder?.next
            if let viewController = parentResponder as? UIViewController {
                return viewController
            }
        }
        return nil
    }
}
