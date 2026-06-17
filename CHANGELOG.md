# Changelog

## 0.10.0
### Minor Changes



- [#65](https://github.com/LottieFiles/dotlottie-react-native/pull/65) [`f8545a0`](https://github.com/LottieFiles/dotlottie-react-native/commit/f8545a001459e0e65b27d564c38987aa8a2f37dc) Thanks [@theashraf](https://github.com/theashraf)! - feat: added layout (fit/align) prop


### Patch Changes



- [#63](https://github.com/LottieFiles/dotlottie-react-native/pull/63) [`6e162e2`](https://github.com/LottieFiles/dotlottie-react-native/commit/6e162e269cb066a954292039cf5808cb9f0c52bd) Thanks [@quoc-upstart](https://github.com/quoc-upstart)! - Fix an Android crash ("Cannot locate windowRecomposer") when a `<DotLottie>` is
  measured before its window is attached under the React Native new architecture
  (Fabric) — e.g. navigating to a screen that renders it via react-native-screens.


- [#69](https://github.com/LottieFiles/dotlottie-react-native/pull/69) [`e625dd9`](https://github.com/LottieFiles/dotlottie-react-native/commit/e625dd9e22b3cc99c0fb7d48ecba533b9e6688ed) Thanks [@theashraf](https://github.com/theashraf)! - fix(ios): revert the `dotlottie-ios` dependency from Swift Package Manager back to
  the `LottieFiles-dotLottie-iOS` CocoaPods pod.
  
  Pulling the player as a SwiftPM product via `spm_dependency` caused
  `DotLottiePlayer.xcframework` to be processed twice during an archive (once by the
  SwiftPM `DotLottie` target and once by the `dotlottie-react-native` pod target).
  On Xcode 26 the archive step collects each embedded xcframework's signature into a
  single flat `Signatures/` folder, so the two identically-named
  `DotLottiePlayer.xcframework-ios.signature` files collide and archiving fails with
  `File exists` (exit 70). Consuming the player through the CocoaPods pod embeds the
  xcframework exactly once, resolving the archive failure ([#66](https://github.com/LottieFiles/dotlottie-react-native/issues/66)).

## 0.9.3
### Patch Changes



- [#61](https://github.com/LottieFiles/dotlottie-react-native/pull/61) [`99e3ea0`](https://github.com/LottieFiles/dotlottie-react-native/commit/99e3ea0ce034a36b61f30aed2a0e68651aaf006c) Thanks [@theashraf](https://github.com/theashraf)! - Fix crash when navigating away on iOS (bump dotlottie-ios to 0.15.6).

## 0.9.1 (2026-05-21)

* fix: [android] pick source loader from URI scheme (#52) ([b3b5dcd](https://github.com/LottieFiles/dotlottie-react-native/commit/b3b5dcd)), closes [#52](https://github.com/LottieFiles/dotlottie-react-native/issues/52) [#50](https://github.com/LottieFiles/dotlottie-react-native/issues/50)
* docs: update README with title and logo (#51) ([8e76dcb](https://github.com/LottieFiles/dotlottie-react-native/commit/8e76dcb)), closes [#51](https://github.com/LottieFiles/dotlottie-react-native/issues/51)

## 0.9.0 (2026-04-21)

* chore(deps): 🔧 bump dotlottie-android to 0.13.6 (#46) ([86ee000](https://github.com/LottieFiles/dotlottie-react-native/commit/86ee000)), closes [#46](https://github.com/LottieFiles/dotlottie-react-native/issues/46) [#45](https://github.com/LottieFiles/dotlottie-react-native/issues/45)
* ci(docs): 🎡 fixed notify-docs (#44) ([03874fa](https://github.com/LottieFiles/dotlottie-react-native/commit/03874fa)), closes [#44](https://github.com/LottieFiles/dotlottie-react-native/issues/44)
* fix: 🐛 ci name ([ea4a026](https://github.com/LottieFiles/dotlottie-react-native/commit/ea4a026))
* feat(ci): 🎸 notify docs update on release ([abcb147](https://github.com/LottieFiles/dotlottie-react-native/commit/abcb147))

## 0.8.0 (2026-03-31)

* feat: add OpenGL ES renderer support for Android (#42) ([08abe4b](https://github.com/LottieFiles/dotlottie-react-native/commit/08abe4b)), closes [#42](https://github.com/LottieFiles/dotlottie-react-native/issues/42)

## <small>0.7.4 (2026-03-17)</small>

* chore(deps): update dotlottie react:0.18.7, android:0.13.2, ios: 0.14 (#41) ([6bf43f7](https://github.com/LottieFiles/dotlottie-react-native/commit/6bf43f7)), closes [#41](https://github.com/LottieFiles/dotlottie-react-native/issues/41)

## <small>0.7.3 (2026-03-14)</small>

* fix: add number to source prop type to support require() assets (#40) ([1d4a40f](https://github.com/LottieFiles/dotlottie-react-native/commit/1d4a40f)), closes [#40](https://github.com/LottieFiles/dotlottie-react-native/issues/40) [#39](https://github.com/LottieFiles/dotlottie-react-native/issues/39)

## <small>0.7.2 (2026-03-13)</small>

* fix: migrate release workflow to OIDC trusted publishing (#38) ([af11e57](https://github.com/LottieFiles/dotlottie-react-native/commit/af11e57)), closes [#38](https://github.com/LottieFiles/dotlottie-react-native/issues/38)
* fix(ios): correct stateMachineUnsubscribe method name and signature (#30) ([cc0a738](https://github.com/LottieFiles/dotlottie-react-native/commit/cc0a738)), closes [#30](https://github.com/LottieFiles/dotlottie-react-native/issues/30)

## <small>0.7.1 (2025-11-12)</small>

* fix: resolve race condition crash when rendering multiple DotLottie components (#31) ([438e868](https://github.com/LottieFiles/dotlottie-react-native/commit/438e868)), closes [#31](https://github.com/LottieFiles/dotlottie-react-native/issues/31)

## 0.7.0 (2025-10-22)

* chore: remove unit tests step from release workflow (#27) ([3b64b6d](https://github.com/LottieFiles/dotlottie-react-native/commit/3b64b6d)), closes [#27](https://github.com/LottieFiles/dotlottie-react-native/issues/27)
* feat: add new architecture support via Legacy Interop (#26) ([ab7506c](https://github.com/LottieFiles/dotlottie-react-native/commit/ab7506c)), closes [#26](https://github.com/LottieFiles/dotlottie-react-native/issues/26)

## <small>0.6.1 (2025-10-21)</small>

* fix: change event handlers to RCTDirectEventBlock(#24) (#25) ([a17226e](https://github.com/LottieFiles/dotlottie-react-native/commit/a17226e)), closes [#24](https://github.com/LottieFiles/dotlottie-react-native/issues/24) [#25](https://github.com/LottieFiles/dotlottie-react-native/issues/25) [#24](https://github.com/LottieFiles/dotlottie-react-native/issues/24)
* fix(android): prevent IllegalStateException in cleanup on destroyed player (#23) ([3648963](https://github.com/LottieFiles/dotlottie-react-native/commit/3648963)), closes [#23](https://github.com/LottieFiles/dotlottie-react-native/issues/23)

## 0.6.0 (2025-10-17)

* feat: add Kotlin 2.0 Compose Compiler plugin support (#22) ([5eb51c0](https://github.com/LottieFiles/dotlottie-react-native/commit/5eb51c0)), closes [#22](https://github.com/LottieFiles/dotlottie-react-native/issues/22) [#15](https://github.com/LottieFiles/dotlottie-react-native/issues/15) [#15](https://github.com/LottieFiles/dotlottie-react-native/issues/15)
* feat: add state machine support and improve reactive prop handling (#21) ([902665e](https://github.com/LottieFiles/dotlottie-react-native/commit/902665e)), closes [#21](https://github.com/LottieFiles/dotlottie-react-native/issues/21)

## 0.5.0 (2025-10-14)

* feat: add web platform support (#18) ([9ee2fbb](https://github.com/LottieFiles/dotlottie-react-native/commit/9ee2fbb)), closes [#18](https://github.com/LottieFiles/dotlottie-react-native/issues/18)

## 0.4.0 (2025-10-14)

* chore: 🤖 fix release (#7) ([a6bd923](https://github.com/LottieFiles/dotlottie-react-native/commit/a6bd923)), closes [#7](https://github.com/LottieFiles/dotlottie-react-native/issues/7)
* chore: add release workflow (#6) ([5eb6291](https://github.com/LottieFiles/dotlottie-react-native/commit/5eb6291)), closes [#6](https://github.com/LottieFiles/dotlottie-react-native/issues/6)
* chore: configure git identity for release workflow ([582ca56](https://github.com/LottieFiles/dotlottie-react-native/commit/582ca56))
* chore: initial setup  (#1) ([0881399](https://github.com/LottieFiles/dotlottie-react-native/commit/0881399)), closes [#1](https://github.com/LottieFiles/dotlottie-react-native/issues/1)
* chore: sync version with npm registry (0.2.0) (#19) ([e9f0d4d](https://github.com/LottieFiles/dotlottie-react-native/commit/e9f0d4d)), closes [#19](https://github.com/LottieFiles/dotlottie-react-native/issues/19)
* chore: update README (#8) ([e227040](https://github.com/LottieFiles/dotlottie-react-native/commit/e227040)), closes [#8](https://github.com/LottieFiles/dotlottie-react-native/issues/8)
* chore: update release-it configuration to allow dirty working directory ([8c9f16f](https://github.com/LottieFiles/dotlottie-react-native/commit/8c9f16f))
* chore: update version to 0.3.0 and change release-it preset to conventionalcommits ([a2ca175](https://github.com/LottieFiles/dotlottie-react-native/commit/a2ca175))
* chore: upgrade Node.js to v20 ([6726d4c](https://github.com/LottieFiles/dotlottie-react-native/commit/6726d4c))
* chore: upgrade release-it to v19 ([48a16cf](https://github.com/LottieFiles/dotlottie-react-native/commit/48a16cf))
* fix(integration): fix Android/iOS integration issues and native SDK compatibility (#17) ([7b4f5c1](https://github.com/LottieFiles/dotlottie-react-native/commit/7b4f5c1)), closes [#17](https://github.com/LottieFiles/dotlottie-react-native/issues/17)
* Initial commit ([ea5c1dc](https://github.com/LottieFiles/dotlottie-react-native/commit/ea5c1dc))
* Update README.md ([9087f79](https://github.com/LottieFiles/dotlottie-react-native/commit/9087f79))
* feat: dotLottie IOS & Android integration  (#3) ([3e24262](https://github.com/LottieFiles/dotlottie-react-native/commit/3e24262)), closes [#3](https://github.com/LottieFiles/dotlottie-react-native/issues/3)
