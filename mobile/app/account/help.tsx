import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { openCSWhatsApp } from '../../utils/whatsapp';

const FAQ_DATA = [
  {
    category: 'Tentang Pesanan',
    items: [
      {
        q: 'Bagaimana cara memesan tukang?',
        a: 'Pilih kategori layanan di halaman utama, kemudian isi form pemesanan dengan detail pekerjaan yang dibutuhkan.',
      },
      {
        q: 'Berapa lama tukang datang?',
        a: 'Tukang akan datang sesuai jadwal yang kamu pilih saat pemesanan. Pastikan memilih jadwal minimal H+1.',
      },
    ],
  },
  {
    category: 'Tentang Pembayaran',
    items: [
      {
        q: 'Metode pembayaran apa saja yang tersedia?',
        a: 'GoKang menerima pembayaran via transfer bank, e-wallet (GoPay, OVO, Dana), dan virtual account.',
      },
      {
        q: 'Bagaimana proses refund?',
        a: 'Refund diproses dalam 3-7 hari kerja setelah pengajuan disetujui.',
      },
    ],
  },
];

export default function HelpScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
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
          Pusat Bantuan
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {FAQ_DATA.map((cat) => (
          <View key={cat.category} style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 16,
                color: '#111827',
                marginBottom: 12,
              }}
            >
              {cat.category}
            </Text>
            <View style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' }}>
              {cat.items.map((item, i) => {
                const key = `${cat.category}-${i}`;
                const isOpen = expanded === key;
                return (
                  <View key={key}>
                    <TouchableOpacity
                      onPress={() => setExpanded(isOpen ? null : key)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: isOpen ? 1 : 0,
                        borderBottomColor: '#F3F4F6',
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: 'Poppins_500Medium',
                          fontSize: 14,
                          color: '#111827',
                        }}
                      >
                        {item.q}
                      </Text>
                      {isOpen ? (
                        <ChevronUp size={18} color="#9CA3AF" />
                      ) : (
                        <ChevronDown size={18} color="#9CA3AF" />
                      )}
                    </TouchableOpacity>
                    {isOpen ? (
                      <View style={{ padding: 16, backgroundColor: '#F9FAFB' }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 14,
                            color: '#374151',
                            lineHeight: 22,
                          }}
                        >
                          {item.a}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={openCSWhatsApp}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#F97316',
            borderRadius: 28,
            padding: 16,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: 'white' }}>
            Chat dengan CS GoKang
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
