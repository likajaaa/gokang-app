import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2 } from 'lucide-react-native';

type Article = {
  id: number;
  slug: string;
  title: string;
  content: string;
  image: string;
  author_name: string;
  published_at: string;
  related_articles: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
  }>;
};

// MOCK DATA — matches screenshot GoKang "Perbedaan Keramik Cutting dan Biasa".
// For now every slug returns this same article (placeholder until API is wired).
const MOCK_ARTICLE: Article = {
  id: 1,
  slug: 'perbedaan-keramik-cutting-dan-biasa',
  title: 'Jangan Bingung! Ini Perbedaan Keramik Cutting dan Keramik Biasa',
  image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1200',
  author_name: 'GoKang',
  published_at: '2026-03-05T10:00:00Z',
  content: `Keramik masih menjadi material lantai yang paling banyak digunakan pada rumah tinggal. Selain harganya yang relatif terjangkau, keramik juga tersedia dalam berbagai motif, ukuran, dan jenis. Salah satu jenis yang cukup populer adalah **keramik cutting**.

Banyak orang memilih keramik cutting karena tampilannya terlihat lebih rapi dan modern saat dipasang.

Namun sebenarnya apa itu keramik cutting, apa bedanya dengan keramik biasa, dan berapa kisaran harganya?

Simak penjelasan lengkapnya berikut ini.

## Pengertian Keramik Cutting

Keramik cutting awalnya adalah keramik biasa yang telah melalui proses **pemotongan presisi pada bagian tepi setelah proses produksi selesai**.

Proses ini dilakukan menggunakan mesin khusus agar setiap sisi keramik memiliki ukuran yang sangat presisi dan sudut yang lebih rapi.

## Perbedaan Keramik Biasa dan Keramik Cutting

Perbedaan utama keramik biasa dan keramik cutting terletak pada presisi ukuran dan tampilan **hasil pemasangan**.

### 1. Presisi Ukuran

Keramik biasa dibuat melalui proses pencetakan dan pembakaran tanpa pemotongan ulang. Akibatnya ukuran antar keping bisa memiliki sedikit perbedaan.

Sebaliknya, keramik cutting dipotong kembali menggunakan mesin sehingga ukuran setiap kepingnya lebih presisi.

### 2. Lebar Nat

Keramik biasa biasanya dipasang dengan nat yang lebih lebar untuk mengantisipasi perbedaan ukuran.

Sementara keramik cutting bisa dipasang dengan nat yang lebih tipis karena ukuran keramiknya lebih konsisten.

### 3. Tampilan Lantai

Keramik cutting menghasilkan tampilan lantai yang lebih rapi, modern, dan minimalis. Banyak orang memilihnya untuk ruang tamu, ruang keluarga, atau area utama rumah.

Sedangkan keramik biasa masih banyak digunakan untuk kamar tidur, dapur, atau area servis.

### 4. Harga

Keramik cutting umumnya memiliki harga sedikit lebih mahal dibanding keramik biasa karena melalui proses tambahan dalam produksinya.

## Berapa Isi Keramik dalam 1 Dus

Selain harga, penting juga mengetahui isi keramik dalam satu dus untuk menghitung kebutuhan material saat renovasi atau pembangunan rumah.

Standar isi keramik dalam 1 dus umumnya mencakup area 1 m². Berikut adalah isi keramik dari beberapa ukuran:

- 25×25 cm : Isi 16 keping
- 40×40 cm : Isi 6 Keping
- 50×50 cm : Isi 4 Keping
- 60×60 cm : Isi 4 Keping jadi luas areanya adalah 1,44 m²

Namun jumlah ini bisa sedikit berbeda tergantung merek keramik yang digunakan.

## Berapa Harga Keramik Cutting di Pasaran?

Ukuran **keramik cutting 60×60 cm** termasuk yang paling populer untuk rumah modern karena memberikan kesan ruang lebih luas dan elegan.

Harga keramik cutting 60×60 di pasaran cukup bervariasi tergantung merek, motif, dan kualitasnya. Secara umum kisaran harganya adalah:

- Rp120.000 – Rp200.000 per dus, isi 3-4 keramik dengan kualitas yang premium.

Harga tersebut bisa berbeda tergantung toko bangunan, merek keramik, serta lokasi pembelian.

[CTA_BANNER]
Segera panggil konsultan lewat aplikasi GoKang untuk solusi ganti keramik yang presisi dan memuaskan.
[/CTA_BANNER]

Selain memilih material yang tepat, kualitas pemasangan keramik juga sangat menentukan hasil akhir lantai. Kesalahan pemasangan bisa menyebabkan keramik kopong, nat tidak rapi, hingga permukaan lantai tidak rata.

Jika kamu berencana memasang keramik cutting atau mengganti lantai lama di rumah, sebaiknya gunakan jasa tukang yang berpengalaman agar hasilnya lebih rapi dan tahan lama.

Kini kamu bisa memesan jasa konsultan untuk cek detail yang kamu perlukan, estimasi biaya, hingga pemasangan keramik oleh tukang profesional semua lewat aplikasi. Mudah bukan? yuk [Download aplikasi GoKang](download-app) Sekarang!`,
  related_articles: [
    {
      id: 2,
      slug: 'perbandingan-granit-keramik',
      title: 'Perbandingan Granit dan Keramik: Mana yang Lebih Bagus untuk Lantai',
      excerpt:
        'Memilih material lantai tidak bisa dilakukan sembarangan. Dua jenis material yang paling sering dibandingkan adalah granit...',
      image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800',
    },
    {
      id: 3,
      slug: 'tips-cat-tembok',
      title: 'Tips Memilih Cat Tembok yang Tahan Lama dan Ramah Lingkungan',
      excerpt:
        'Cat tembok berkualitas tidak hanya mempercantik rumah, tapi juga melindungi dinding dari cuaca lembap...',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
    },
  ],
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

type InlinePart =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'link'; content: string; url: string };

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)$/);
    const linkMatch = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)(.*)$/);

    if (linkMatch && (!boldMatch || linkMatch[1].length <= boldMatch[1].length)) {
      if (linkMatch[1]) parts.push({ type: 'text', content: linkMatch[1] });
      parts.push({ type: 'link', content: linkMatch[2], url: linkMatch[3] });
      remaining = linkMatch[4];
    } else if (boldMatch) {
      if (boldMatch[1]) parts.push({ type: 'text', content: boldMatch[1] });
      parts.push({ type: 'bold', content: boldMatch[2] });
      remaining = boldMatch[3];
    } else {
      parts.push({ type: 'text', content: remaining });
      remaining = '';
    }
  }

  return parts;
}

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [article, setArticle] = useState<Article>(MOCK_ARTICLE);

  useEffect(() => {
    // TODO: replace with servicesApi.getArticle(slug) once backend is wired.
    setArticle(MOCK_ARTICLE);
  }, [slug]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\nBaca selengkapnya di GoKang app`,
        title: article.title,
      });
    } catch (err) {
      console.error('[ArticleDetail] share error:', err);
    }
  };

  const handleLinkPress = (linkType: string) => {
    if (linkType === 'download-app') {
      Alert.alert('Download App', 'Redirect ke Play Store / App Store');
      // Linking.openURL('https://play.google.com/store/apps/details?id=com.gokang');
    }
  };

  const renderInline = (text: string) =>
    parseInline(text).map((part, i) => {
      if (part.type === 'bold') {
        return (
          <Text key={i} style={{ fontFamily: 'Poppins_700Bold' }}>
            {part.content}
          </Text>
        );
      }
      if (part.type === 'link') {
        return (
          <Text
            key={i}
            style={{
              fontFamily: 'Poppins_700Bold',
              color: '#1E2D4F',
              textDecorationLine: 'underline',
            }}
            onPress={() => handleLinkPress(part.url)}
          >
            {part.content}
          </Text>
        );
      }
      return <Text key={i}>{part.content}</Text>;
    });

  const renderContent = (content: string) => {
    const parts = content.split(/\[CTA_BANNER\]([\s\S]*?)\[\/CTA_BANNER\]/);

    return parts.map((part, partIndex) => {
      if (partIndex % 2 === 1) {
        return (
          <TouchableOpacity
            key={`cta-${partIndex}`}
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)')}
            style={{
              backgroundColor: '#F97316',
              borderRadius: 16,
              padding: 16,
              marginVertical: 20,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 100,
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 14,
                  color: 'white',
                  lineHeight: 20,
                }}
              >
                {part.trim()}
              </Text>
            </View>
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 50 }}>🔨</Text>
            </View>
          </TouchableOpacity>
        );
      }

      const lines = part.split('\n');
      return lines.map((line, lineIndex) => {
        const key = `${partIndex}-${lineIndex}`;

        if (line.startsWith('## ')) {
          return (
            <Text
              key={key}
              style={{
                fontFamily: 'Poppins_800ExtraBold',
                fontSize: 22,
                color: '#111827',
                marginTop: 28,
                marginBottom: 14,
                paddingHorizontal: 20,
              }}
            >
              {line.slice(3)}
            </Text>
          );
        }

        if (line.startsWith('### ')) {
          return (
            <Text
              key={key}
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 18,
                color: '#111827',
                marginTop: 20,
                marginBottom: 10,
                paddingHorizontal: 20,
              }}
            >
              {line.slice(4)}
            </Text>
          );
        }

        if (line.startsWith('- ')) {
          return (
            <View
              key={key}
              style={{
                flexDirection: 'row',
                marginBottom: 8,
                paddingHorizontal: 20,
                paddingLeft: 28,
              }}
            >
              <Text
                style={{
                  color: '#111827',
                  marginRight: 8,
                  fontSize: 15,
                  lineHeight: 26,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 15,
                  color: '#111827',
                  lineHeight: 26,
                  flex: 1,
                }}
              >
                {renderInline(line.slice(2))}
              </Text>
            </View>
          );
        }

        if (line.trim() === '') {
          return <View key={key} style={{ height: 4 }} />;
        }

        return (
          <Text
            key={key}
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 15,
              color: '#111827',
              lineHeight: 26,
              marginBottom: 14,
              paddingHorizontal: 20,
            }}
          >
            {renderInline(line)}
          </Text>
        );
      });
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Sticky simple header */}
      <View
        style={{
          paddingTop: 48,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
              color: '#111827',
            }}
          >
            Bacaan Buat Kamu 😍
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 12,
              color: '#6B7280',
              marginTop: 2,
            }}
          >
            Rekomendasi untuk bacaan kamu
          </Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={{ padding: 4 }}>
          <Share2 size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontFamily: 'Poppins_800ExtraBold',
            fontSize: 24,
            color: '#111827',
            lineHeight: 32,
            paddingHorizontal: 20,
            paddingTop: 20,
            marginBottom: 12,
          }}
        >
          {article.title}
        </Text>

        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
            color: '#6B7280',
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          Oleh{' '}
          <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#111827' }}>
            {article.author_name}
          </Text>
          {' · '}
          {formatDate(article.published_at)}
        </Text>

        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Image
            source={{ uri: article.image }}
            style={{
              width: '100%',
              height: 250,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        </View>

        <View>{renderContent(article.content)}</View>

        <View
          style={{
            marginTop: 32,
            paddingVertical: 24,
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
          }}
        >
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <Text
              style={{
                fontFamily: 'Poppins_800ExtraBold',
                fontSize: 20,
                color: '#111827',
                marginBottom: 4,
              }}
            >
              Inspirasi Untuk Anda 🙌
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#6B7280',
              }}
            >
              Rekomendasi untuk bacaan kamu
            </Text>
          </View>

          <FlatList
            data={article.related_articles}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/article/${item.slug}`)}
                activeOpacity={0.9}
                style={{
                  width: 300,
                  marginRight: 12,
                  backgroundColor: 'white',
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: '#F3F4F6',
                }}
              >
                <View style={{ position: 'relative' }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: 180 }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={handleShare}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Share2 size={18} color="#111827" />
                  </TouchableOpacity>
                </View>

                <View style={{ padding: 16 }}>
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
                      fontSize: 14,
                      color: '#6B7280',
                      lineHeight: 20,
                    }}
                  >
                    {item.excerpt}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}
