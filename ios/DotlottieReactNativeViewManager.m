#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(DotlottieReactNativeViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(source, NSString)
RCT_EXPORT_VIEW_PROPERTY(loop, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoplay, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onPlay, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoop, RCTBubblingEventBlock)
// RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadError, RCTBubblingEventBlock)

@end
