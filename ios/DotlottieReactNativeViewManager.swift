import DotLottie
import SwiftUI


 class Datastore: ObservableObject {
   @Published var source: NSString = ""
  @Published var loop: Bool = false
  @Published var autoplay: Bool = true
  @Published var speed: Double = 1
  @Published var onPlay: RCTBubblingEventBlock = {_ in }
  @Published var onLoad: RCTBubblingEventBlock = {_ in }
  @Published var onLoadError: RCTBubblingEventBlock = {_ in }
  @Published var onLoop: RCTBubblingEventBlock = {_ in }
   
  @Published var animation: DotLottieAnimation?
   
   func createAnimation() {
     if(self.source != ""){
       let sourceString = source as String

       if sourceString.hasPrefix("file://") {
         if let url = URL(string: sourceString),
            let data = try? Data(contentsOf: url) {
           self.animation = DotLottieAnimation(
             dotLottieData: data,
             config: AnimationConfig(autoplay: autoplay, loop: loop, speed: Float(speed))
           )
         }
       } else {
         self.animation = DotLottieAnimation(
           webURL: sourceString,
           config: AnimationConfig(autoplay: autoplay, loop: loop, speed: Float(speed))
         )
       }
     }
   }
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
//        dataStore.onLoad(["" : ""])
    }

    func onLoadError() {
//        dataStore.onLoadError(["" : ""])
    }

    func onLoop(loopCount: UInt32) {
      dataStore.onLoop(["loopCount" : loopCount])
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
      if let animation = dataStore.animation {
                  DotLottieView(dotLottie: animation)
                      .onAppear {
                          subscribeToAnimation()
                      }
              } else {
                  Text("Loading animation...")
                      .onAppear {
                          dataStore.createAnimation()
                      }
              }
    }
  

    
  func subscribeToAnimation() {
          guard let animation = dataStore.animation else { return }
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

  
  
  
  
  @objc
  func pause(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.pause()
    }
  }
  
  @objc
  func stop(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.stop()
    }
  }
  
  @objc
  func play(_ node:NSNumber) {
      DispatchQueue.main.async {
        let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
        _ = dotLottieView._animation?.play()
        
      }
    }
  
  @objc
  func setLoop(_ node:NSNumber, loop:Bool) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setLoop(loop: loop)
    }
  }
  
  @objc func setSpeed(_ node:NSNumber, speed:NSNumber) {
    DispatchQueue.main.async {
      let convertedSpeed = Float(truncating: speed)
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setSpeed(speed: convertedSpeed)
    }
  }
  
  @objc func setFrame(_ node:NSNumber, frame:NSNumber) {
    DispatchQueue.main.async {
      let convertedFrame = Float(truncating: frame)
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setFrame(frame: convertedFrame)
    }
  }
  
  @objc func startStateMachine(_ node:NSNumber,stateMachineiId: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      let stateMachine = dotLottieView._animation?.stateMachineLoad(id: String(stateMachineiId))
      if(stateMachine != nil) {
        _ = dotLottieView._animation?.stateMachineStart()
      }
    }
  }
  
  @objc func postEvent(_ node:NSNumber, x:NSNumber, y:NSNumber) {
    DispatchQueue.main.async {
      // let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      // let event = Event.onPointerDown(x: Float(truncating: x), y: Float(truncating: y))
      // _ = dotLottieView._animation?.postEvent(event)
    }
    
  }
  

  
  @objc func setSegments(_ node:NSNumber, start:NSNumber, end:NSNumber) {
    DispatchQueue.main.async {
      let start = Float(truncating: start)
      let end = Float(truncating: end)
      let segments: (Float, Float) = (start, end)
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setSegments(segments: segments)
    }
  }
  
  @objc func setFrameInterpolation(_ node:NSNumber, useFrameInterpolation:Bool) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setFrameInterpolation(useFrameInterpolation)
    }
  }
  
  @objc func setPlayMode(_ node:NSNumber, mode:NSNumber) {
    DispatchQueue.main.async {
      
      let actualMode: Mode = {
        switch mode {
        case 0: return .forward
        case 1: return .reverse
        case 2: return .bounce
        case 3: return .reverseBounce
        default:
          return .forward
        }
      }()
      
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setMode(mode: actualMode)
    }
  }
  
  @objc func setMarker(_ node:NSNumber, marker:NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setMarker(marker: String(marker))
    }
  }
  
  @objc func resize(_ node:NSNumber, width:NSNumber, height:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.resize(width: Int(truncating: width), height: Int(truncating: height))
    }
  }
  
  
  
 
  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }

}

class DotlottieReactNativeView: UIView {
    var view: UIView?
    var dataStore:Datastore  = .init()
    var _animation: DotLottieAnimation? {
         dataStore.animation
     }


    override init(frame: CGRect) {
      super.init(frame: frame)
      self.createAnimation()
    }
  
  func createAnimation() {
    dataStore.createAnimation()
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
          dataStore.createAnimation()
        }
      }

    @objc var loop: Bool = false {
        didSet{
            dataStore.loop = loop
            _animation?.setLoop(loop: loop)
        }
      }

    @objc var autoplay: Bool = true {
      didSet{
        dataStore.autoplay = autoplay
        _animation?.setAutoplay(autoplay: autoplay)
      }
    }
  
  @objc var speed: Double = 1 {
    didSet{
      dataStore.speed = speed
      _animation?.setSpeed(speed: Float(speed))
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


