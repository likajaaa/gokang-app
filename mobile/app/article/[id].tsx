import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';

// Mock lookup — nanti fetch dari API by id
const MOCK = {
  title: 'Bapak di Rumah Wajib Punya 9+ Alat Pertukangan',
  image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=1200',
  content:
    'Memiliki perkakas dasar di rumah sangat penting untuk menangani berbagai perbaikan kecil. Berikut adalah alat-alat yang wajib dimiliki:\n\n1. Palu\n2. Obeng set\n3. Tang\n4. Meteran\n5. Bor listrik\n6. Gergaji\n7. Kunci inggris\n8. Level air\n9. Cutter\n\nDengan alat-alat ini, Anda bisa menangani perbaikan ringan tanpa harus memanggil tukang.',
};

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" translucent />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: MOCK.image }} style={{ width: '100%', height: 260 }} resizeMode="cover" />

          {/* Back button overlay */}
          <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="m-3 h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View className="px-4 py-5">
          <Text className="text-xs text-text-secondary" style={{ fontFamily: 'Poppins_500Medium' }}>
            Article #{id}
          </Text>
          <Text
            className="mt-1 text-2xl text-text-primary"
            style={{ fontFamily: 'Poppins_700Bold', lineHeight: 32 }}
          >
            {MOCK.title}
          </Text>
          <Text
            className="mt-4 text-base text-text-primary"
            style={{ fontFamily: 'Poppins_400Regular', lineHeight: 26 }}
          >
            {MOCK.content}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
