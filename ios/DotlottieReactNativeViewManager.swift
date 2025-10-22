import DotLottie
import SwiftUI


 class Datastore: ObservableObject {
   @Published var source: NSString = ""
  @Published var loop: Bool = false
  @Published var autoplay: Bool = true
  @Published var speed: Double = 1
  @Published var useFrameInterpolation: Bool = false
  @Published var playMode: Int = 0
  @Published var segment: NSArray? = nil
  @Published var marker: NSString = ""
  @Published var themeId: NSString = ""
  @Published var stateMachineId: NSString = ""
  @Published var onPlay: RCTDirectEventBlock = {_ in }
  @Published var onLoad: RCTDirectEventBlock = {_ in }
  @Published var onLoadError: RCTDirectEventBlock = {_ in }
  @Published var onLoop: RCTDirectEventBlock = {_ in }
  @Published var onFrame: RCTDirectEventBlock = {_ in }
  @Published var onRender: RCTDirectEventBlock = {_ in }
  @Published var onComplete: RCTDirectEventBlock = {_ in }
  @Published var onPause: RCTDirectEventBlock = {_ in }
  @Published var onStop: RCTDirectEventBlock = {_ in }

  // State machine events
  @Published var onStateMachineStart: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineStop: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineStateEntered: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineStateExit: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineTransition: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineBooleanInputChange: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineNumericInputChange: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineStringInputChange: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineInputFired: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineCustomEvent: RCTDirectEventBlock = {_ in }
  @Published var onStateMachineError: RCTDirectEventBlock = {_ in }

  @Published var animation: DotLottieAnimation?
  var observer: DotLottieEventObserver?
  var stateMachineObserver: DotLottieStateMachineObserver?
   
  func createAnimation() {
     // Clean up existing animation
     cleanupAnimation()

     if(self.source != ""){
       let sourceString = source as String

       // Build complete AnimationConfig with all available props
       let config = buildAnimationConfig()

       if sourceString.hasPrefix("file://") {
         if let url = URL(string: sourceString),
            let data = try? Data(contentsOf: url) {
           let animation = DotLottieAnimation(
             dotLottieData: data,
             config: config
           )
           self.animation = animation
           subscribeToAnimation(animation)
         }
       } else {
         let animation = DotLottieAnimation(
           webURL: sourceString,
           config: config
         )
         self.animation = animation
         subscribeToAnimation(animation)
       }
     }
   }
  private func subscribeToAnimation(_ animation: DotLottieAnimation) {
    // Subscribe to regular animation events
    let eventObserver = DotLottieEventObserver(dataStore: self)
    observer = eventObserver
    animation.subscribe(observer: eventObserver)

    // Subscribe to state machine events
    let stateMachineObserver = DotLottieStateMachineObserver(dataStore: self)
    self.stateMachineObserver = stateMachineObserver
    _ = animation.stateMachineSubscribe(stateMachineObserver)
  }

   func buildAnimationConfig() -> AnimationConfig {
     // Convert playMode to Mode enum
     let mode: Mode = {
       switch playMode {
       case 0: return .forward
       case 1: return .reverse
       case 2: return .bounce
       case 3: return .reverseBounce
       default: return .forward
       }
     }()

     // Convert segment array to tuple
     let segments: (Float, Float)? = {
       if let segmentArray = segment as? [NSNumber], segmentArray.count == 2 {
         return (Float(truncating: segmentArray[0]), Float(truncating: segmentArray[1]))
       }
       return nil
     }()

     // Build config with all available properties
     return AnimationConfig(
       autoplay: autoplay,
       loop: loop,
       mode: mode,
       speed: Float(speed),
       useFrameInterpolation: useFrameInterpolation,
       segments: segments,
       backgroundColor: nil,
       width: nil,  // Use default
       height: nil,  // Use default
       layout: nil,  // Use default
       marker: marker != "" ? String(marker) : "",
       themeId: themeId != "" ? String(themeId) : "",
       stateMachineId: stateMachineId != "" ? String(stateMachineId) : ""
     )
   }

  func cleanupAnimation() {
     // Unsubscribe regular observer if it exists
     if let observer = self.observer, let animation = self.animation {
       animation.unsubscribe(observer: observer)
     }

     // Unsubscribe state machine observer if it exists
     if let stateMachineObserver = self.stateMachineObserver, let animation = self.animation {
       _ = animation.stateMachineUnSubscribe(observer: stateMachineObserver)
     }

    self.observer = nil
    self.stateMachineObserver = nil
    self.animation = nil
  }
}










class DotLottieEventObserver: Observer {
    var dataStore: Datastore

      init(dataStore: Datastore) {
          self.dataStore = dataStore
      }
    func onComplete() {
        dataStore.onComplete([:])
    }

    func onFrame(frameNo: Float) {
        dataStore.onFrame(["frameNo" : Double(frameNo)])
    }

    func onLoad() {
        dataStore.onLoad([:])
    }

    func onLoadError() {
        dataStore.onLoadError([:])
    }

    func onLoop(loopCount: UInt32) {
      dataStore.onLoop(["loopCount" : loopCount])
    }

    func onPause() {
        dataStore.onPause([:])
    }

    func onPlay() {
        dataStore.onPlay([:])
    }

    func onRender(frameNo: Float) {
        dataStore.onRender(["frameNo" : Double(frameNo)])
    }

    func onStop() {
        dataStore.onStop([:])
    }

}

class DotLottieStateMachineObserver: StateMachineObserver {
    var dataStore: Datastore

    init(dataStore: Datastore) {
        self.dataStore = dataStore
    }

    func onStart() {
        dataStore.onStateMachineStart([:])
    }

    func onStop() {
        dataStore.onStateMachineStop([:])
    }

    func onStateEntered(enteringState: String) {
        dataStore.onStateMachineStateEntered(["enteringState": enteringState])
    }

    func onStateExit(leavingState: String) {
        dataStore.onStateMachineStateExit(["leavingState": leavingState])
    }

    func onTransition(previousState: String, newState: String) {
        dataStore.onStateMachineTransition([
            "previousState": previousState,
            "newState": newState
        ])
    }

    func onBooleanInputValueChange(inputName: String, oldValue: Bool, newValue: Bool) {
        dataStore.onStateMachineBooleanInputChange([
            "inputName": inputName,
            "oldValue": oldValue,
            "newValue": newValue
        ])
    }

    func onNumericInputValueChange(inputName: String, oldValue: Float, newValue: Float) {
        dataStore.onStateMachineNumericInputChange([
            "inputName": inputName,
            "oldValue": Double(oldValue),
            "newValue": Double(newValue)
        ])
    }

    func onStringInputValueChange(inputName: String, oldValue: String, newValue: String) {
        dataStore.onStateMachineStringInputChange([
            "inputName": inputName,
            "oldValue": oldValue,
            "newValue": newValue
        ])
    }

    func onInputFired(inputName: String) {
        dataStore.onStateMachineInputFired(["inputName": inputName])
    }

    func onCustomEvent(message: String) {
        dataStore.onStateMachineCustomEvent(["message": message])
    }

    func onError(message: String) {
        dataStore.onStateMachineError(["message": message])
    }
}



struct AnimationView: View {
    @EnvironmentObject var dataStore: Datastore


    var body: some View {
      if let animation = dataStore.animation {
                  DotLottieView(dotLottie: animation)
                      .onDisappear {
                          cleanupAnimation()
                      }
              } else {
                  Text("Loading animation...")
                      .onAppear {
                          dataStore.createAnimation()
                      }
              }
    }



  func cleanupAnimation() {
          dataStore.cleanupAnimation()
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
      if let animation = dotLottieView._animation {
        let _ = animation.pause()
      }
    }
  }

  @objc
  func stop(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      if let animation = dotLottieView._animation {
        let _ = animation.stop()
      }
    }
  }
  
  @objc
  func play(_ node:NSNumber) {
      DispatchQueue.main.async {
        let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
        guard let animation = dotLottieView._animation else {
          return
        }

        let _ = animation.play()
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

  @objc func freeze(_ node:NSNumber) {
    // Note: freeze() is not available in the iOS DotLottie SDK
    // This is a no-op to maintain API compatibility with Android
  }

  @objc func unfreeze(_ node:NSNumber) {
    // Note: unfreeze() is not available in the iOS DotLottie SDK
    // This is a no-op to maintain API compatibility with Android
  }

  @objc func stateMachineStart(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.stateMachineStart()
    }
  }

  @objc func stateMachineStop(_ node:NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.stateMachineStop()
    }
  }

  @objc func stateMachineLoad(_ node:NSNumber, stateMachineId: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.stateMachineLoad(id: String(stateMachineId))
    }
  }

  @objc func stateMachineFire(_ node:NSNumber, event: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      dotLottieView._animation?.stateMachineFire(event: String(event))
    }
  }

  @objc func stateMachineSetNumericInput(_ node:NSNumber, key: NSString, value: NSNumber) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.stateMachineSetNumericInput(key: String(key), value: Float(truncating: value))
    }
  }

  @objc func stateMachineSetStringInput(_ node:NSNumber, key: NSString, value: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.stateMachineSetStringInput(key: String(key), value: String(value))
    }
  }

  @objc func stateMachineSetBooleanInput(_ node:NSNumber, key: NSString, value: Bool) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.stateMachineSetBooleanInput(key: String(key), value: value)
    }
  }

  @objc func setSegment(_ node:NSNumber, start:NSNumber, end:NSNumber) {
    DispatchQueue.main.async {
      let start = Float(truncating: start)
      let end = Float(truncating: end)
      let segments: (Float, Float) = (start, end)
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setSegments(segments: segments)
    }
  }

  @objc func setTheme(_ node:NSNumber, themeId: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      _ = dotLottieView._animation?.setTheme(String(themeId))
    }
  }

  @objc func loadAnimation(_ node:NSNumber, animationId: NSString) {
    DispatchQueue.main.async {
      let dotLottieView = self.bridge.uiManager.view(forReactTag: node) as! DotlottieReactNativeView
      try? dotLottieView._animation?.loadAnimationById(String(animationId))
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
  private var hostingController: UIHostingController<AnyView>?
  private var isMountedToWindow: Bool = false
  private var isReleased: Bool = false
  private var pendingAnimationUpdate: Bool = false
  let dataStore: Datastore = .init()
  var _animation: DotLottieAnimation? {
    dataStore.animation
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    setupHostingControllerIfNeeded()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  deinit {
    releaseResources()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    guard !isReleased else {
      return
    }

    let currentlyMounted = window != nil
    if currentlyMounted == isMountedToWindow {
      return
    }

    isMountedToWindow = currentlyMounted

    if currentlyMounted {
      setupHostingControllerIfNeeded()
      scheduleAnimationUpdate()
    } else {
      dataStore.cleanupAnimation()
      tearDownHostingController()
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }

  func releaseResources() {
    guard !isReleased else {
      return
    }

    isReleased = true
    isMountedToWindow = false
    pendingAnimationUpdate = false
    dataStore.cleanupAnimation()
    tearDownHostingController()
    resetEventHandlers()
  }

  private func setupHostingControllerIfNeeded() {
    guard hostingController == nil, !isReleased else {
      return
    }

    let rootView = AnyView(AnimationView().environmentObject(dataStore))
    let controller = UIHostingController(rootView: rootView)
    controller.view.backgroundColor = .clear
    controller.view.frame = bounds
    controller.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    addSubview(controller.view)
    hostingController = controller
    setNeedsLayout()
  }

  private func tearDownHostingController() {
    guard let controller = hostingController else {
      return
    }

    controller.view.removeFromSuperview()
    hostingController = nil
  }

  private func performIfActive(_ action: () -> Void) {
    if !isReleased {
      action()
    }
  }

  private func resetEventHandlers() {
    dataStore.onPlay = { _ in }
    dataStore.onLoad = { _ in }
    dataStore.onLoadError = { _ in }
    dataStore.onLoop = { _ in }
    dataStore.onFrame = { _ in }
    dataStore.onRender = { _ in }
    dataStore.onComplete = { _ in }
    dataStore.onPause = { _ in }
    dataStore.onStop = { _ in }
    dataStore.onStateMachineStart = { _ in }
    dataStore.onStateMachineStop = { _ in }
    dataStore.onStateMachineStateEntered = { _ in }
    dataStore.onStateMachineStateExit = { _ in }
    dataStore.onStateMachineTransition = { _ in }
    dataStore.onStateMachineBooleanInputChange = { _ in }
    dataStore.onStateMachineNumericInputChange = { _ in }
    dataStore.onStateMachineStringInputChange = { _ in }
    dataStore.onStateMachineInputFired = { _ in }
    dataStore.onStateMachineCustomEvent = { _ in }
    dataStore.onStateMachineError = { _ in }
  }

  private func scheduleAnimationUpdate() {
    if isReleased {
      return
    }

    if pendingAnimationUpdate {
      return
    }

    pendingAnimationUpdate = true
    DispatchQueue.main.async { [weak self] in
      guard let self = self else {
        return
      }

      if self.isReleased {
        self.pendingAnimationUpdate = false
        return
      }

      self.pendingAnimationUpdate = false
      self.dataStore.createAnimation()
    }
  }

  @objc var source: NSString = "" {
    didSet {
      performIfActive {
        dataStore.source = source
        scheduleAnimationUpdate()
      }
    }
  }

  @objc var loop: Bool = false {
    didSet {
      performIfActive {
        dataStore.loop = loop
        _animation?.setLoop(loop: loop)
      }
    }
  }

  @objc var autoplay: Bool = true {
    didSet {
      performIfActive {
        dataStore.autoplay = autoplay
        if autoplay {
          _ = _animation?.play()
        } else {
          _ = _animation?.pause()
        }
      }
    }
  }
  
  @objc var speed: NSNumber = 1 {
    didSet {
      performIfActive {
        let speedValue = speed.doubleValue
        dataStore.speed = speedValue
        _animation?.setSpeed(speed: Float(speedValue))
      }
    }
  }

  @objc var themeId: NSString = "" {
    didSet {
      performIfActive {
        dataStore.themeId = themeId
        if themeId != "" {
          _animation?.setTheme(String(themeId))
        }
      }
    }
  }

  @objc var marker: NSString = "" {
    didSet {
      performIfActive {
        dataStore.marker = marker
        if marker != "" {
          _animation?.setMarker(marker: String(marker))
        }
      }
    }
  }

  @objc var segment: NSArray? {
    didSet {
      performIfActive {
        dataStore.segment = segment
        if let segmentArray = segment as? [NSNumber], segmentArray.count == 2 {
          let start = Float(truncating: segmentArray[0])
          let end = Float(truncating: segmentArray[1])
          _animation?.setSegments(segments: (start, end))
        } else if segment == nil, let animation = _animation {
          // Reset to full animation range when segment is undefined
          let totalFrames = animation.totalFrames()
          _animation?.setSegments(segments: (0, totalFrames))
        }
      }
    }
  }

  @objc var playMode: NSNumber = 0 {
    didSet {
      performIfActive {
        dataStore.playMode = playMode.intValue
        let mode: Mode = {
          switch playMode.intValue {
          case 0: return .forward
          case 1: return .reverse
          case 2: return .bounce
          case 3: return .reverseBounce
          default: return .forward
          }
        }()
        _animation?.setMode(mode: mode)
      }
    }
  }

  @objc var useFrameInterpolation: Bool = false {
    didSet {
      performIfActive {
        dataStore.useFrameInterpolation = useFrameInterpolation
        _animation?.setFrameInterpolation(useFrameInterpolation)
      }
    }
  }

  @objc var stateMachineId: NSString = "" {
    didSet {
      performIfActive {
        dataStore.stateMachineId = stateMachineId
        if stateMachineId != "" {
          // Load and start the state machine
          let result = _animation?.stateMachineLoad(id: String(stateMachineId))
          if result != nil {
            _ = _animation?.stateMachineStart()
          }
        } else {
          // Stop the state machine when stateMachineId is empty/undefined
          _ = _animation?.stateMachineStop()
        }
      }
    }
  }

    @objc var onPlay: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onPlay = onPlay
        }
      }
    
    @objc var onLoop: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onLoop = onLoop
        }
      }

    
    @objc var onLoadError: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onLoadError = onLoadError
        }
      }
    
    @objc var onLoad: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onLoad = onLoad
        }
      }

    @objc var onFrame: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onFrame = onFrame
        }
      }

    @objc var onRender: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onRender = onRender
        }
      }

    @objc var onComplete: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onComplete = onComplete
        }
      }

    @objc var onPause: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onPause = onPause
        }
      }

    @objc var onStop: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStop = onStop
        }
      }

    // State machine events
    @objc var onStateMachineStart: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineStart = onStateMachineStart
        }
      }

    @objc var onStateMachineStop: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineStop = onStateMachineStop
        }
      }

    @objc var onStateMachineStateEntered: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineStateEntered = onStateMachineStateEntered
        }
      }

    @objc var onStateMachineStateExit: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineStateExit = onStateMachineStateExit
        }
      }

    @objc var onStateMachineTransition: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineTransition = onStateMachineTransition
        }
      }

    @objc var onStateMachineBooleanInputChange: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineBooleanInputChange = onStateMachineBooleanInputChange
        }
      }

    @objc var onStateMachineNumericInputChange: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineNumericInputChange = onStateMachineNumericInputChange
        }
      }

    @objc var onStateMachineStringInputChange: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineStringInputChange = onStateMachineStringInputChange
        }
      }

    @objc var onStateMachineInputFired: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineInputFired = onStateMachineInputFired
        }
      }

    @objc var onStateMachineCustomEvent: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineCustomEvent = onStateMachineCustomEvent
        }
      }

    @objc var onStateMachineError: RCTDirectEventBlock = {_ in} {
        didSet{
          dataStore.onStateMachineError = onStateMachineError
        }
      }

}
