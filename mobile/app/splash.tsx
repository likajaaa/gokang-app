import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { DEV_CONFIG } from '../constants/dev';
import { useAuthStore } from '../store/authStore';

const TRANSITION_DELAY = 200;
const TRANSITION_DURATION = 1100;
const HOLD_DARK_MS = 900; // tampil dark sebelum routing
const SPLASH_DURATION_MS = TRANSITION_DELAY + TRANSITION_DURATION + HOLD_DARK_MS;

const COLOR_LIGHT = '#FFFFFF';
const COLOR_DARK = '#0F1F47';

const LOGO_SIZE = 240;

export default function SplashScreen() {
  const transition = useSharedValue(0); // 0 = light state, 1 = dark state
  const logoScale = useSharedValue(0.85);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    // Logo subtle scale-in on mount
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    // Cross-fade light → dark setelah delay singkat (matches native splash hand-off)
    transition.value = withDelay(
      TRANSITION_DELAY,
      withTiming(1, {
        duration: TRANSITION_DURATION,
        easing: Easing.inOut(Easing.cubic),
      }),
    );

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route after splash duration
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (DEV_CONFIG.SKIP_AUTH) {
        console.log('[DEV MODE] Skipping auth, going to home');
        router.replace('/(tabs)');
        return;
      }

      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const token = await SecureStore.getItemAsync('auth_token');

      console.log('[Splash] hasSeenOnboarding:', hasSeenOnboarding);
      console.log('[Splash] token exists:', !!token);

      if (hasSeenOnboarding !== 'true') {
        router.replace('/welcome');
      } else if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  // progress 0 = light bg + gokang-light.png (dark G content) visible — start
  // progress 1 = dark bg + gokang-dark.png (light G content) visible — end
  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      transition.value,
      [0, 1],
      [COLOR_LIGHT, COLOR_DARK],
    ),
  }));

  // gokang-light.png (dark-G logo) — "kesedot keluar":
  //   shrink ke titik kecil sambil fade out di paruh awal transition (0 → 0.5)
  const logoLightStyle = useAnimatedStyle(() => {
    const transitionScale = interpolate(
      transition.value,
      [0, 0.5],
      [1, 0.2],
      Extrapolation.CLAMP,
    );
    const fadeOpacity = interpolate(
      transition.value,
      [0, 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: fadeOpacity,
      transform: [{ scale: logoScale.value * transitionScale }],
    };
  });

  // gokang-dark.png (white-G logo) — "muncul dari titik":
  //   grow dari kecil sambil fade in di paruh akhir transition (0.5 → 1)
  const logoDarkStyle = useAnimatedStyle(() => {
    const transitionScale = interpolate(
      transition.value,
      [0.5, 1],
      [0.2, 1],
      Extrapolation.CLAMP,
    );
    const fadeOpacity = interpolate(
      transition.value,
      [0.5, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: fadeOpacity,
      transform: [{ scale: transitionScale }],
    };
  });

  // StatusBar style: light on dark bg, dark on light bg — switch midway
  const statusBarStyle = useAnimatedStyle(() => ({
    opacity: 1, // dummy, just to evaluate transition
  }));

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        containerStyle,
      ]}
    >
      <Animated.View style={statusBarStyle}>
        <StatusBar style="auto" translucent />
      </Animated.View>

      <View
        style={{
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.Image
          source={require('../assets/gokang-light.png')}
          resizeMode="contain"
          style={[
            {
              position: 'absolute',
              width: LOGO_SIZE,
              height: LOGO_SIZE,
            },
            logoLightStyle,
          ]}
        />
        <Animated.Image
          source={require('../assets/gokang-dark.png')}
          resizeMode="contain"
          style={[
            {
              position: 'absolute',
              width: LOGO_SIZE,
              height: LOGO_SIZE,
            },
            logoDarkStyle,
          ]}
        />
      </View>
    </Animated.View>
  );
}
