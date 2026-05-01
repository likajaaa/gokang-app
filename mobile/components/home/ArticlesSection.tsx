import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = 400;
const ITEM_STRIDE = CARD_WIDTH + 32;

type Article = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
};

const ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'perbandingan-granit-keramik',
    title:
      'Perbandingan Granit dan Keramik: Mana yang Lebih Bagus untuk Lantai Rumah?',
    description:
      'Memilih material lantai tidak bisa dilakukan sembarangan. Dua jenis material yang paling...',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800',
  },
  {
    id: '2',
    slug: 'tips-cat-tembok',
    title: 'Tips Memilih Cat Tembok yang Tahan Lama dan Ramah Lingkungan',
    description:
      'Cat tembok berkualitas tidak hanya mempercantik rumah, tapi juga melindungi dinding dari...',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
  },
  {
    id: '3',
    slug: 'mencegah-kebocoran-atap',
    title: 'Cara Mencegah Kebocoran Atap di Musim Hujan',
    description:
      'Musim hujan sering kali membawa masalah kebocoran atap. Berikut cara mengatasinya...',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  },
  {
    id: '4',
    slug: 'instalasi-listrik-pemula',
    title: 'Panduan Lengkap Instalasi Listrik Rumah untuk Pemula',
    description:
      'Memahami dasar-dasar instalasi listrik rumah penting untuk keselamatan keluarga...',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
  },
  {
    id: '5',
    slug: 'renovasi-kamar-mandi-minimalis',
    title: 'Renovasi Kamar Mandi Minimalis dengan Budget Terbatas',
    description:
      'Kamar mandi minimalis bisa diwujudkan dengan budget hemat. Simak tips-tipsnya...',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
  },
];

export default function ArticlesSection() {
  const flatListRef = useRef<FlatList<Article>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / ITEM_STRIDE);
    if (idx !== currentIndex && idx >= 0 && idx < ARTICLES.length) {
      setCurrentIndex(idx);
    }
  };

  const openDetail = (slug: string) => router.push(`/article/${slug}`);

  const renderArticleCard = ({ item }: { item: Article }) => (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => openDetail(item.slug)}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#E5E7EB',
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />

      <View
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 16,
            color: '#111827',
            lineHeight: 22,
            marginBottom: 8,
          }}
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 13,
            color: '#6B7280',
            lineHeight: 18,
            marginBottom: 16,
          }}
        >
          {item.description}
        </Text>

        <TouchableOpacity
          onPress={() => openDetail(item.slug)}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#F97316',
            borderRadius: 28,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 14,
              color: 'white',
            }}
          >
            Baca Selengkapnya
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginTop: 24 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            style={{
              fontFamily: 'Poppins_800ExtraBold',
              fontSize: 22,
              color: '#111827',
              lineHeight: 28,
            }}
          >
            Bacaan Buat Kamu 🤩
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: '#6B7280',
              marginTop: 2,
            }}
          >
            Rekomendasi untuk bacaan kamu
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/articles')} style={{ paddingTop: 4 }}>
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 14,
              color: '#1E2D4F',
            }}
          >
            Lihat semua
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={ARTICLES}
        keyExtractor={(item) => item.id}
        renderItem={renderArticleCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ITEM_STRIDE}
        snapToAlignment="start"
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: ITEM_STRIDE,
          offset: ITEM_STRIDE * index,
          index,
        })}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 16,
          gap: 6,
        }}
      >
        {ARTICLES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === currentIndex ? '#1E2D4F' : '#D1D5DB',
            }}
          />
        ))}
      </View>
    </View>
  );
}
