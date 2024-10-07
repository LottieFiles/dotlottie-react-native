#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(DotlottieReactNativeViewManager, RCTViewManager)



RCT_EXTERN_METHOD(dummy:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(pause:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(setLoop:(nonnull NSNumber *)node loop:(BOOL)loop)
RCT_EXTERN_METHOD(stop:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(play:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(setSpeed:(nonnull NSNumber *)node speed:(nonnull NSNumber *)speed)
RCT_EXTERN_METHOD(setFrame:(nonnull NSNumber *)node frame:(nonnull NSNumber *)frame)
RCT_EXTERN_METHOD(setPlayMode:(nonnull NSNumber *)node mode:(nonnull NSNumber *)mode)
RCT_EXTERN_METHOD(setMarker:(nonnull NSNumber *)node marker:(nonnull NSString *)marker)
RCT_EXTERN_METHOD(setFrameInterpolation:(nonnull NSNumber *)node useFrameInterpolation:(BOOL)useFrameInterpolation)
RCT_EXTERN_METHOD(startStateMachine:(nonnull NSNumber *)node stateMachineiId:(nonnull NSString *)stateMachineiId)
RCT_EXTERN_METHOD(postEvent:(nonnull NSNumber *)node x:(nonnull NSNumber *)x y:(nonnull NSNumber *)y)
RCT_EXTERN_METHOD(setSegments:(nonnull NSNumber *)node start:(nonnull NSNumber *)start end:(nonnull NSNumber *)end)
RCT_EXTERN_METHOD(resize:(nonnull NSNumber *)node width:(nonnull NSNumber *)width height:(nonnull NSNumber *)height)
RCT_EXPORT_VIEW_PROPERTY(source, NSString)
RCT_EXPORT_VIEW_PROPERTY(loop, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoplay, BOOL)
RCT_EXPORT_VIEW_PROPERTY(speed, Double)
RCT_EXPORT_VIEW_PROPERTY(onPlay, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoop, RCTBubblingEventBlock)
// RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTBubblingEventBlock)
// RCT_EXPORT_VIEW_PROPERTY(onLoadError, RCTBubblingEventBlock)


+ (BOOL)requiresMainQueueSetup
{
  return YES;
}



@end
