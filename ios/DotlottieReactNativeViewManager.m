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
RCT_EXPORT_VIEW_PROPERTY(onPlay, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPause, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStop, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoop, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFrame, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRender, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onComplete, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStop, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStateEntered, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStateExit, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineTransition, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineBooleanInputChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineNumericInputChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineStringInputChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineInputFired, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineCustomEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateMachineError, RCTDirectEventBlock)


+ (BOOL)requiresMainQueueSetup
{
  return YES;
}



@end
