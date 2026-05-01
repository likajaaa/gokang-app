import { TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Heart, Search, X } from 'lucide-react-native';
import { router } from 'expo-router';

type Props = {
  notificationCount?: number;
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
};

export default function SearchBar({
  notificationCount = 0,
  value,
  onChangeText,
  onClear,
}: Props) {
  const isControlled = typeof onChangeText === 'function';

  return (
    <LinearGradient
      colors={['#1E2D4F', '#3B4E78', '#FFFFFF']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center gap-3 px-4 pb-4 pt-2">
          {/* Search Input */}
          {isControlled ? (
            <View
              className="flex-1 flex-row items-center rounded-full bg-white px-4"
              style={{
                height: 44,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Search size={20} color="#9CA3AF" />
              <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="Cari layanan atau tukang..."
                placeholderTextColor="#9CA3AF"
                returnKeyType="search"
                className="ml-2 flex-1 text-base text-text-primary"
                style={{ fontFamily: 'Poppins_400Regular', padding: 0 }}
              />
              {value && value.length > 0 ? (
                <TouchableOpacity
                  onPress={onClear}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{ padding: 4 }}
                >
                  <X size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/search')}
              activeOpacity={0.85}
              className="flex-1 flex-row items-center rounded-full bg-white px-4"
              style={{
                height: 44,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Search size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Pasang Keramik, Cat Rumah, dll"
                placeholderTextColor="#9CA3AF"
                editable={false}
                pointerEvents="none"
                className="ml-2 flex-1 text-base text-text-primary"
                style={{ fontFamily: 'Poppins_400Regular' }}
              />
            </TouchableOpacity>
          )}

          {/* Wishlist icon */}
          <TouchableOpacity
            onPress={() => router.push('/wishlist')}
            className="h-10 w-10 items-center justify-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Heart size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Notification icon + badge */}
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            className="h-10 w-10 items-center justify-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bell size={24} color="#FFFFFF" />
            {notificationCount > 0 && (
              <View
                className="absolute -right-0.5 -top-0.5 rounded-full bg-primary-dark"
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
