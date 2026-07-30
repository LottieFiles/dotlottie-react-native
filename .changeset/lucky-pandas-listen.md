---
'@lottiefiles/dotlottie-react-native': patch
---

fix: don't reload the animation when a view scrolls out of view and back

Leaving the window was treated as a teardown, so list recycling and screen
transitions destroyed the player and rebuilt it on the way back, re-reading the
source and restarting from frame 0. Playback now freezes at the current frame
and resumes on return; the player is released only on unmount.
