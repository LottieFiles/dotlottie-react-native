#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(DotlottieReactNativeViewManager, RCTViewManager)


RCT_EXTERN_METHOD(dummy:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(pause:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(setLoop:(nonnull NSNumber *)node loop:(BOOL *)loop)
RCT_EXTERN_METHOD(stop:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(play:(nonnull NSNumber *)node)
RCT_EXPORT_VIEW_PROPERTY(source, NSString)
RCT_EXPORT_VIEW_PROPERTY(loop, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoplay, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPlay, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoop, RCTBubblingEventBlock)
// RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTBubblingEventBlock)



//RCT_EXPORT_VIEW_PROPERTY(onLoadError, RCTBubblingEventBlock)



@end

