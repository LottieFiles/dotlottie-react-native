#ifdef RCT_NEW_ARCH_ENABLED
#import "DotlottieReactNativeViewComponentView.h"

#include <memory>
#include <string>

#import <React/RCTComponentViewProtocol.h>
#import <React/RCTLegacyViewManagerInteropComponentView.h>
#import <react/renderer/componentregistry/ComponentDescriptorProvider.h>

@implementation DotlottieReactNativeViewComponentView

+ (void)initialize
{
  if (self == [DotlottieReactNativeViewComponentView class]) {
    [RCTLegacyViewManagerInteropComponentView supportLegacyViewManagerWithName:@"DotlottieReactNativeView"];
  }
}

+ (facebook::react::ComponentDescriptorProvider)componentDescriptorProvider
{
  auto parentProvider = [super componentDescriptorProvider];
  auto flavor = std::make_shared<const std::string>("DotlottieReactNativeView");
  auto componentName = facebook::react::ComponentName{flavor->c_str()};
  auto componentHandle = reinterpret_cast<facebook::react::ComponentHandle>(componentName);

  return {componentHandle, componentName, flavor, parentProvider.constructor};
}

@end

Class<RCTComponentViewProtocol> DotlottieReactNativeViewCls(void)
{
  return DotlottieReactNativeViewComponentView.class;
}

#endif
