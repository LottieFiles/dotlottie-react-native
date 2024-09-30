import dotLottie
import SwiftUI


 class Datastore: ObservableObject {
  @Published var source: NSString = ""
  @Published var loop: Bool = false
  @Published var autoplay: Bool = true
  @Published var onPlay: RCTBubblingEventBlock = {_ in }
  @Published var onLoad: RCTBubblingEventBlock = {_ in }
  @Published var onLoadError: RCTBubblingEventBlock = {_ in }
  @Published var onLoop: RCTBubblingEventBlock = {_ in }
}


class YourDotLottieObserver: Observer {
    var dataStore: Datastore
      
      init(dataStore: Datastore) {
          self.dataStore = dataStore
      }
    func onComplete() {
        // do something
    }

    func onFrame(frameNo: Float) {
        // do something
    }

    func onLoad() {
        dataStore.onLoad(["" : ""])
    }

    func onLoadError() {
//        dataStore.onLoadError(["" : ""])
    }

    func onLoop(loopCount: UInt32) {
//        dataStore.onLoop(["loopCount" : loopCount])
    }

    func onPause() {
        // do something
    }

    func onPlay() {
        dataStore.onPlay(["" : ""])
    }

    func onRender(frameNo: Float) {
        // do something
    }

    func onStop() {
        // do something
    }
}



struct AnimationView: View {
    @EnvironmentObject var dataStore: Datastore

    var body: some View {
        DotLottieView(dotLottie: createAnimation())
                    .onAppear {
                        subscribeToAnimation()
    }
    }
    
    func createAnimation() -> DotLottieAnimation {
          let animation = DotLottieAnimation(
              webURL: "\(dataStore.source)",
              config: AnimationConfig(autoplay: dataStore.autoplay, loop: dataStore.loop, speed: 2)
          )
          return animation
      }

      func subscribeToAnimation() {
          let animation = createAnimation()
          let animationView = DotLottieView(dotLottie: animation)
          let myObserver = YourDotLottieObserver(dataStore: dataStore)
          animationView.subscribe(observer: myObserver)
      }
}


@objc(DotlottieReactNativeViewManager)
class DotlottieReactNativeViewManager: RCTViewManager {

  override func view() -> (DotlottieReactNativeView) {
    return DotlottieReactNativeView()
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

class DotlottieReactNativeView: UIView {
    var view: UIView?
    var dataStore:Datastore  = .init()


    override init(frame: CGRect) {
      super.init(frame: frame)
        let vc = UIHostingController(rootView: AnimationView().environmentObject(dataStore))
      vc.view.frame = bounds
      self.addSubview(vc.view)
      self.view = vc.view
    
    }

    required init?(coder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
    }



    @objc var source: NSString = "" {
        didSet{
            dataStore.source = source
        }
      }

    @objc var loop: Bool = false {
        didSet{
            dataStore.loop = loop
        }
      }

    @objc var autoplay: Bool = true {
      didSet{
          dataStore.loop = loop
      }
    }
    
    @objc var onPlay: RCTBubblingEventBlock = {_ in} {
        didSet{
          dataStore.onPlay = onPlay
        }
      }
    
    @objc var onLoop: RCTBubblingEventBlock = {_ in} {
        didSet{
          dataStore.onLoop = onLoop
        }
      }

    
    @objc var onLoadError: RCTBubblingEventBlock = {_ in} {
        didSet{
          dataStore.onLoadError = onLoadError
        }
      }
    
    @objc var onLoad: RCTBubblingEventBlock = {_ in} {
        didSet{
          dataStore.onLoad = onLoad
        }
      }


     override func layoutSubviews() {
       super.layoutSubviews()
        self.view?.frame = bounds
     }

}


