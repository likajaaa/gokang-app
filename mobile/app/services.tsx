import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function ServicesScreen() {
  const params = useLocalSearchParams<{
    type?: string;
    category?: string;
    materials?: string;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center border-b border-border px-2 py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="ml-2 text-base font-semibold text-text-primary">Layanan</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-text-secondary">Coming soon...</Text>
        <View className="mt-6 rounded-xl bg-gray-50 px-4 py-3">
          <Text className="text-xs text-text-secondary">Route params:</Text>
          <Text className="mt-1 font-mono text-xs text-text-primary">
            type={params.type ?? '-'}{'\n'}
            category={params.category ?? '-'}{'\n'}
            materials={params.materials ?? '-'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
