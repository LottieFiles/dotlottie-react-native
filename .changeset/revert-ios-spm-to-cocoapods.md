---
"@lottiefiles/dotlottie-react-native": patch
---

fix(ios): revert the `dotlottie-ios` dependency from Swift Package Manager back to
the `LottieFiles-dotLottie-iOS` CocoaPods pod.

Pulling the player as a SwiftPM product via `spm_dependency` caused
`DotLottiePlayer.xcframework` to be processed twice during an archive (once by the
SwiftPM `DotLottie` target and once by the `dotlottie-react-native` pod target).
On Xcode 26 the archive step collects each embedded xcframework's signature into a
single flat `Signatures/` folder, so the two identically-named
`DotLottiePlayer.xcframework-ios.signature` files collide and archiving fails with
`File exists` (exit 70). Consuming the player through the CocoaPods pod embeds the
xcframework exactly once, resolving the archive failure (#66).
