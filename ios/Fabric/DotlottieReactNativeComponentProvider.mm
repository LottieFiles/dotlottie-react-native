#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTComponentViewFactory.h>
#import <React/RCTLegacyViewManagerInteropComponentView.h>

#import "DotlottieReactNativeViewComponentView.h"

Class<RCTComponentViewProtocol> DotlottieReactNativeViewCls(void);

@implementation RCTComponentViewFactory (DotlottieReactNativeComponentProvider)

+ (void)load
{
  [RCTLegacyViewManagerInteropComponentView supportLegacyViewManagerWithName:@"DotlottieReactNativeView"];

  RCTComponentViewFactory *factory = [self currentComponentViewFactory];
  if (factory) {
    [factory registerComponentViewClass:DotlottieReactNativeViewCls()];
  }
}

@end
#endif
