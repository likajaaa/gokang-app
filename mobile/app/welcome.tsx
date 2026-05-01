import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function markOnboardingDone() {
  await AsyncStorage.setItem('hasSeenOnboarding', 'true');
}

export default function WelcomeScreen() {
  const goRegister = async () => {
    await markOnboardingDone();
    router.push('/(auth)/register');
  };

  const goLogin = async () => {
    await markOnboardingDone();
    router.push('/(auth)/login');
  };

  const skip = async () => {
    await markOnboardingDone();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" translucent />

      {/* ── Foto area (65-70% layar) ─────────────────────────────── */}
      <View style={{ flex: 2 }}>
        {/* Gradient simulasi foto tukang: langit kebiruan → coklat kulit */}
        <LinearGradient
          colors={['#8B9DAF', '#B8A99A', '#D4C5B2']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1 }}
        >
          <SafeAreaView edges={['top']} className="flex-1">
            {/* Logo — merah, di atas area terang */}
            <View className="items-center" style={{ marginTop: 50 }}>
              {/* Icon hexagon placeholder */}
              <View
                className="h-12 w-12 items-center justify-center rounded-xl bg-orange"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text className="text-2xl font-extrabold text-white">K</Text>
              </View>

              <Text
                className="mt-3 font-extrabold tracking-tight text-primary"
                style={{ fontSize: 28 }}
              >
                GoKang
              </Text>

              <Text className="mt-0.5 text-sm font-medium text-primary-dark">
                Tukang Jagoan
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Fade gradient foto → putih (transisi mulus ke section bawah) */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)', '#FFFFFF']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 150,
          }}
          pointerEvents="none"
        />
      </View>

      {/* ── Content area (30-35% layar) ──────────────────────────── */}
      <SafeAreaView edges={['bottom']} className="bg-white">
        <View className="justify-center bg-white px-6 pb-4 pt-2">
          {/* Heading */}
          <Text
            className="text-center font-bold text-text-primary"
            style={{ fontSize: 22, lineHeight: 28 }}
          >
            Panggil Tukang Jagoan{'\n'}dengan GoKang
          </Text>

          {/* Subheading */}
          <Text
            className="mt-3 text-center text-text-secondary"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            Hemat waktu dan energi dengan memanggil tenaga ahli untuk Anda. GoKang menyediakan
            tukang terpercaya dengan kemampuan yang dibutuhkan.
          </Text>

          {/* Buttons row — pill shape */}
          <View className="mt-6 flex-row" style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={goRegister}
              activeOpacity={0.85}
              className="flex-1 items-center justify-center rounded-full bg-orange"
              style={{ height: 50 }}
            >
              <Text className="text-base font-bold text-white">Daftar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goLogin}
              activeOpacity={0.7}
              className="flex-1 items-center justify-center rounded-full"
              style={{ height: 50, backgroundColor: '#F3F4F6' }}
            >
              <Text className="text-base font-bold text-orange">Masuk</Text>
            </TouchableOpacity>
          </View>

          {/* Lewati link — gelap */}
          <TouchableOpacity onPress={skip} activeOpacity={0.6} className="mt-4 py-2">
            <Text
              className="text-center font-medium"
              style={{ color: '#374151', fontSize: 14 }}
            >
              Lewati
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
