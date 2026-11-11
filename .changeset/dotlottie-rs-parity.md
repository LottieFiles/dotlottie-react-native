---
'@lottiefiles/dotlottie-react-native': minor
---

feat: match the dotLottie core API for audio, slots, theming, state machines and playback

New ref methods on Android, iOS and web:

- Audio: `setAudioVolume`, `audioVolume`
- Slots: `setSlots`, `setSlot`, `setColorSlot`, `setScalarSlot`, `setTextSlot`, `setVectorSlot`, `setPositionSlot`, `setImageSlot`, `setBezierPathSlot`, `clearSlot`, `clearSlots`, `resetSlot`, `resetSlots`, `getSlotIds`, `getSlotType`, `getSlot`, `getSlots`
- Theming: `setThemeData`, `resetTheme`
- State machine: `stateMachineLoadData`, `stateMachineSetSeed`, `stateMachineGetNumericInput`, `stateMachineGetStringInput`, `stateMachineGetBooleanInput`, `stateMachineCurrentState`, `stateMachineStatus`, `getStateMachine`
- Playback: `setLoopCount`, `setUseFrameInterpolation`, `markers`, `manifest`, and a new `loopCount` prop

Fixes:

- Android: `unfreeze()` did nothing.
- Web: the ref now has `stateMachineLoad`, `setTheme`, `stateMachineFire` and the `stateMachineSet*Input` methods, like on native (`loadStateMachine` and `loadTheme` are removed). The `onStateMachine*` event props now work on web.

Native players: dotlottie-android `0.15.0` → `0.18.0`, dotlottie-ios `0.16.6` → `0.17.0`, `@lottiefiles/dotlottie-react` `^0.19.4` → `^0.21.2`.
