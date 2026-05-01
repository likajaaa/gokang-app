import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import type { ViewToken } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 16;
const BANNER_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const ITEM_STRIDE = BANNER_WIDTH + H_PADDING * 2; // item width + margins both sides

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  colors: [string, string, ...string[]];
};

const MOCK_BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Beli Material',
    subtitle: 'Tukang Kami Bantu Belanja',
    cta: 'Pesan Sekarang',
    colors: ['#10B981', '#14B8A6', '#0EA5E9'],
  },
  {
    id: 2,
    title: 'Bingung Mau Pesan Tukang?',
    subtitle: 'Kami Rekomendasiin Jagoannya',
    cta: 'Cek Jagoan',
    colors: ['#1E2D4F', '#FF6B6B', '#FFA500'],
  },
  {
    id: 3,
    title: 'Cuci Toren 100 Ribuan!',
    subtitle: 'Promo Terbatas',
    cta: 'Pesan Cuci Toren',
    colors: ['#F97316', '#FBBF24', '#FDE047'],
  },
  {
    id: 4,
    title: 'Layanan Borongan Full Service',
    subtitle: 'Survey + Jasa + Material',
    cta: 'Pesan Sekarang',
    colors: ['#7C3AED', '#3B82F6', '#06B6D4'],
  },
  {
    id: 5,
    title: 'Tersedia di Jabodetabek',
    subtitle: 'Jakarta · Bogor · Depok · Tangerang · Bekasi',
    cta: 'Cek Area',
    colors: ['#059669', '#10B981', '#84CC16'],
  },
  {
    id: 6,
    title: 'Daftar Sekarang Diskon 150rb',
    subtitle: 'Untuk Pengguna Baru',
    cta: 'Daftar Sekarang',
    colors: ['#EC4899', '#1E2D4F', '#F59E0B'],
  },
];

export default function PromoBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Banner>>(null);

  // Auto-play: slide tiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % MOCK_BANNERS.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  return (
    <View className="mt-6">
      <FlatList
        ref={flatListRef}
        data={MOCK_BANNERS}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ITEM_STRIDE}
        snapToAlignment="start"
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: ITEM_STRIDE,
          offset: ITEM_STRIDE * index,
          index,
        })}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              /* TODO: navigate by banner type */
            }}
            style={{ width: BANNER_WIDTH, marginHorizontal: H_PADDING }}
          >
            <LinearGradient
              colors={item.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 180,
                borderRadius: 16,
                padding: 20,
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circle */}
              <View
                style={{
                  position: 'absolute',
                  bottom: -40,
                  right: -40,
                  width: 220,
                  height: 220,
                  borderRadius: 110,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                }}
              />

              {/* Badge NEW UPDATE */}
              <View className="self-start rounded-full bg-white px-3 py-1">
                <Text
                  className="text-xs text-primary"
                  style={{ fontFamily: 'Poppins_700Bold' }}
                >
                  🔔 NEW UPDATE
                </Text>
              </View>

              {/* Content bottom */}
              <View>
                <Text
                  className="mb-2 text-2xl text-white"
                  style={{ fontFamily: 'Poppins_800ExtraBold', lineHeight: 30 }}
                >
                  {item.title}
                </Text>
                <View className="self-start rounded-lg bg-yellow-400 px-3 py-1.5">
                  <Text
                    className="text-xs text-text-primary"
                    style={{ fontFamily: 'Poppins_700Bold' }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <Text
                  className="mt-3 text-sm text-white"
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  👉 {item.cta}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />

      {/* Dot indicator */}
      <View className="mt-3 flex-row items-center justify-center" style={{ gap: 6 }}>
        {MOCK_BANNERS.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === activeIndex ? '#1E2D4F' : '#D1D5DB',
            }}
          />
        ))}
      </View>
    </View>
  );
}
