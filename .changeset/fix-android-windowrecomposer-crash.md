---
"@lottiefiles/dotlottie-react-native": patch
---

Fix an Android crash ("Cannot locate windowRecomposer") when a `<DotLottie>` is
measured before its window is attached under the React Native new architecture
(Fabric) — e.g. navigating to a screen that renders it via react-native-screens.
