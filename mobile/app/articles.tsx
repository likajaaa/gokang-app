import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function ArticlesListScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center border-b border-border px-2 py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          className="ml-2 text-base text-text-primary"
          style={{ fontFamily: 'Poppins_600SemiBold' }}
        >
          Semua Artikel
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text
          className="text-text-secondary"
          style={{ fontFamily: 'Poppins_500Medium' }}
        >
          Coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}
