# Performance Optimization Guide

This guide explains how to optimize the performance of `dotlottie-react-native` on Android, focusing on the `performanceMode`, `cacheId` features, and the deferred remount pattern.

## Understanding Performance Modes

On Android, `dotlottie-react-native` uses a high-performance OpenGL renderer. You can choose between two primary performance modes to balance CPU and memory usage.

### `performanceMode="ram"` (Default)
In this mode, the animation player is destroyed when the component unmounts. Only the current frame index is saved.
- **Pros:** Lowest permanent memory footprint.
- **Cons:** Every remount requires re-parsing the Lottie file (JSON/DotLottie), which can cause CPU spikes and "jank."
- **When to use:** For large, complex animations that are only shown once or rarely remounted.

### `performanceMode="cpu"`
This mode keeps the underlying C++ player instance alive in a static native cache.
- **Pros:** Instant remounting. Zero re-parsing overhead. No CPU spikes when switching views.
- **Cons:** Slightly higher permanent RAM usage.
- **When to use:** For frequently toggled UI elements like **Bottom Navigation Bars**, sidebars, or repeatedly used interactive icons.

---

## Using `cacheId`

The `cacheId` prop is the key to managing persistent players in `cpu` mode.

```tsx
<DotLottie
  source={require('./icon.lottie')}
  performanceMode="cpu"
  cacheId="nav_home_icon" // Unique key for this specific animation role
/>
```

### Best Practices for `cacheId`:
1. **Uniqueness:** Use unique strings for different animation roles (e.g., `tab_home`, `tab_profile`).
2. **Persistence:** If multiple instances share the same `cacheId`, they will share the same underlying player instance and state.
3. **Avoid Randomness:** Never use random strings (like `Math.random()`) for `cacheId`, as this will cause memory leaks in the native layer.

---

## The "Deferred Remount" Pattern (Android)

Android's `TextureView` (used for OpenGL rendering) has a known limitation: when a view is covered (e.g., navigating to another screen) or the app loses focus, the underlying native surface buffer is destroyed by the OS. Sometimes, when returning to the screen, the hardware layer fails to refresh correctly, leading to "invisible" or "black" icons.

The most reliable fix is the **Deferred Remount Pattern**.

### Why 100ms?
1. **Transition Stabilization:** React Navigation transitions usually take ~250ms. Triggering a remount at 0ms can cause race conditions while the layout is still sliding.
2. **OS Surface Provisioning:** 100ms gives the Android Window Manager enough time to stabilize the layout before requesting a fresh hardware surface.
3. **Perception:** 100ms is below the threshold of human perception, making the icons appear "instantly" without flickering.

### Implementation Example

```tsx
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState, useRef } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-react-native';

const MyIcon = ({ isActive }) => {
  const navigation = useNavigation();
  const [lottieKey, setLottieKey] = useState(0);
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      // 1. Hide the view briefly to avoid showing stale buffers
      setIsReady(false);
      
      // 2. Wait for transition to settle (100ms)
      setTimeout(() => {
        // 3. Increment key to force a fresh TextureView instance
        setLottieKey(k => k + 1);
        // 4. Show the new, clean instance
        setIsReady(true);
      }, 100);
    });

    return unsubFocus;
  }, [navigation]);

  return (
    <View style={{ opacity: isReady ? 1 : 0 }}>
      <DotLottie
        key={lottieKey}
        performanceMode="cpu"
        cacheId="my_persistent_icon"
        // ... other props
      />
    </View>
  );
};
```
