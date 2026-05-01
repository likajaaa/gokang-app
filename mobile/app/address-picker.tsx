// ──────────────────────────────────────────────────────────────────────
// Placeholder — map picker dimatikan karena react-native-maps butuh native
// build (tidak tersedia di Expo Go).
//
// Untuk sekarang, alamat di-input via Modal di form booking itu sendiri.
// Restore map UI kalau sudah pakai EAS dev build.
// ──────────────────────────────────────────────────────────────────────

import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function AddressPickerScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center border-b border-border px-2 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          className="ml-2 text-base text-text-primary"
          style={{ fontFamily: 'Poppins_600SemiBold' }}
        >
          Pilih Alamat
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Text style={{ fontSize: 40 }}>🗺️</Text>
        <Text
          className="mt-3 text-center text-text-primary"
          style={{ fontFamily: 'Poppins_700Bold', fontSize: 16 }}
        >
          Map picker butuh dev build
        </Text>
        <Text
          className="mt-2 text-center text-text-secondary"
          style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 20 }}
        >
          Untuk sekarang, input alamat via form langsung di halaman booking.
        </Text>
      </View>
    </SafeAreaView>
  );
}
