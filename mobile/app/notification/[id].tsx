import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import type { AppNotification } from '../../services/api/notifications';

const getTypeIcon = (type: string): string => {
  const t = type.toLowerCase();
  if (t.includes('payment')) return '💳';
  if (t.includes('order')) return '📦';
  if (t.includes('chat') || t.includes('message')) return '💬';
  if (t.includes('promo') || t.includes('voucher')) return '🎟️';
  if (t.includes('survey')) return '📋';
  if (t.includes('tukang')) return '👷';
  return '🔔';
};

const formatDateTimeLong = (iso: string | null): string => {
  if (!iso) return '-';
  const d = new Date(iso);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} • ${hh}:${mm} WIB`;
};

const parsePayload = (raw: string | undefined): AppNotification | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppNotification;
  } catch {
    return null;
  }
};

export default function NotificationDetailScreen() {
  const { payload } = useLocalSearchParams<{ id: string; payload?: string }>();
  const notif = parsePayload(payload);

  if (!notif) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={{ fontFamily: 'Poppins_500Medium', color: '#6B7280' }}>
          Notifikasi tidak ditemukan
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            backgroundColor: '#F97316',
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 22,
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}>
            Kembali
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const icon = getTypeIcon(notif.type);
  const orderId = (notif.data?.order_id as number | string | undefined) ?? null;

  const handleOpenOrder = () => {
    if (orderId == null) return;
    router.push(`/order/${orderId}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 8 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            marginLeft: 4,
            fontFamily: 'Poppins_700Bold',
            fontSize: 17,
            color: '#111827',
          }}
        >
          Detail Notifikasi
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Icon + Title */}
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#E5EAF2',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 36 }}>{icon}</Text>
          </View>
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 18,
              color: '#111827',
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            {notif.title}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_500Medium',
              fontSize: 12,
              color: '#9CA3AF',
            }}
          >
            {formatDateTimeLong(notif.created_at)}
          </Text>
        </View>

        {/* Message */}
        <View style={{ backgroundColor: 'white', padding: 20, marginTop: 8 }}>
          <Text
            style={{
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 13,
              color: '#9CA3AF',
              marginBottom: 8,
            }}
          >
            Pesan
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 15,
              color: '#374151',
              lineHeight: 22,
            }}
          >
            {notif.message}
          </Text>
        </View>

        {/* Related action */}
        {orderId != null ? (
          <TouchableOpacity
            onPress={handleOpenOrder}
            activeOpacity={0.7}
            style={{
              backgroundColor: 'white',
              marginTop: 8,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 15,
                  color: '#111827',
                  marginBottom: 2,
                }}
              >
                Lihat Pesanan
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 13,
                  color: '#6B7280',
                }}
              >
                Buka detail order #{orderId}
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}

        {/* Raw type tag */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <Text
            style={{
              fontFamily: 'Poppins_500Medium',
              fontSize: 11,
              color: '#9CA3AF',
            }}
          >
            Tipe: {notif.type}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
