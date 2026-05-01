import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

const TERMS_SECTIONS = [
  {
    title: 'Syarat & Ketentuan Penggunaan',
    content: `Dengan menggunakan aplikasi GoKang, kamu menyetujui syarat dan ketentuan berikut:

1. GoKang adalah platform yang menghubungkan pengguna dengan tukang profesional.

2. Pengguna bertanggung jawab atas informasi yang diberikan saat melakukan pemesanan.

3. GoKang tidak bertanggung jawab atas transaksi yang dilakukan di luar aplikasi.`,
  },
  {
    title: 'Kebijakan Privasi',
    content: `GoKang berkomitmen menjaga privasi pengguna:

1. Data pribadi yang dikumpulkan: nama, email, nomor HP, dan alamat.

2. Data digunakan hanya untuk keperluan operasional layanan GoKang.

3. GoKang tidak menjual data pengguna kepada pihak ketiga.`,
  },
  {
    title: 'Kebijakan Refund',
    content: `Kebijakan pengembalian dana:

1. Refund dapat dilakukan jika order dibatalkan sebelum tukang ditugaskan.

2. Refund diproses dalam 3-7 hari kerja ke rekening yang terdaftar.

3. Biaya survey tidak dapat dikembalikan setelah survey dilakukan.`,
  },
];

export default function TermsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#111827',
            flex: 1,
            textAlign: 'center',
            marginRight: 36,
          }}
        >
          Ketentuan & Privasi
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {TERMS_SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 28 }}>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 17,
                color: '#111827',
                marginBottom: 12,
              }}
            >
              {section.title}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: '#374151',
                lineHeight: 22,
              }}
            >
              {section.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
