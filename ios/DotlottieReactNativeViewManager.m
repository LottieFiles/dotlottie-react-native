#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(DotlottieReactNativeViewManager, RCTViewManager)



RCT_EXTERN_METHOD(play:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(pause:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(stop:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(setLoop:(nonnull NSNumber *)node loop:(BOOL)loop)
RCT_EXTERN_METHOD(setSpeed:(nonnull NSNumber *)node speed:(nonnull NSNumber *)speed)
RCT_EXTERN_METHOD(setPlayMode:(nonnull NSNumber *)node mode:(nonnull NSNumber *)mode)
RCT_EXTERN_METHOD(setFrame:(nonnull NSNumber *)node frame:(nonnull NSNumber *)frame)
RCT_EXTERN_METHOD(freeze:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(unfreeze:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(stateMachineStart:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(stateMachineStop:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(stateMachineLoad:(nonnull NSNumber *)node stateMachineId:(nonnull NSString *)stateMachineId)
RCT_EXTERN_METHOD(stateMachineFire:(nonnull NSNumber *)node event:(nonnull NSString *)event)
RCT_EXTERN_METHOD(stateMachineSetNumericInput:(nonnull NSNumber *)node key:(nonnull NSString *)key value:(nonnull NSNumber *)value)
RCT_EXTERN_METHOD(stateMachineSetStringInput:(nonnull NSNumber *)node key:(nonnull NSString *)key value:(nonnull NSString *)value)
RCT_EXTERN_METHOD(stateMachineSetBooleanInput:(nonnull NSNumber *)node key:(nonnull NSString *)key value:(BOOL)value)
RCT_EXTERN_METHOD(resize:(nonnull NSNumber *)node width:(nonnull NSNumber *)width height:(nonnull NSNumber *)height)
RCT_EXTERN_METHOD(setSegment:(nonnull NSNumber *)node start:(nonnull NSNumber *)start end:(nonnull NSNumber *)end)
RCT_EXTERN_METHOD(setMarker:(nonnull NSNumber *)node marker:(nonnull NSString *)marker)
RCT_EXTERN_METHOD(setTheme:(nonnull NSNumber *)node themeId:(nonnull NSString *)themeId)
RCT_EXTERN_METHOD(loadAnimation:(nonnull NSNumber *)node animationId:(nonnull NSString *)animationId)
RCT_EXPORT_VIEW_PROPERTY(source, NSString)
RCT_EXPORT_VIEW_PROPERTY(loop, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoplay, BOOL)
RCT_EXPORT_VIEW_PROPERTY(speed, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(themeId, NSString)
RCT_EXPORT_VIEW_PROPERTY(marker, NSString)
RCT_EXPORT_VIEW_PROPERTY(segment, NSArray)
RCT_EXPORT_VIEW_PROPERTY(playMode, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(useFrameInterpolation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(stateMachineId, NSString)
RCT_EXPORT_VIEW_PROPERTY(onPlay, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPause, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStop, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoop, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFrame, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRender, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onComplete, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadError, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStop, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStateEntered, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStateExit, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineTransition, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineBooleanInputChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineNumericInputChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStringInputChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineInputFired, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineCustomEvent, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineError, RCTBubblingEventBlock)


+ (BOOL)requiresMainQueueSetup
{
  return YES;
}



@end
