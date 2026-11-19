---
"@lottiefiles/dotlottie-react-native": patch
---

chore(ios): bump dotlottie-ios to `0.18.0`, which no longer bundles the WebGPU renderer. iOS apps stop embedding `WgpuNative.framework`, about 6.6 MB smaller. This package never used that renderer, so nothing else changes.
