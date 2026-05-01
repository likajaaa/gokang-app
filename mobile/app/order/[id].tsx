import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { AlertCircle, ArrowLeft, MoreVertical } from 'lucide-react-native';
import apiClient from '../../services/api/client';

type OrderDetail = {
  id: number;
  order_code: string;
  order_type: string;
  status: string;
  status_label: string;
  service: { id: number; name: string; slug: string; category: string | null } | null;
  survey_address: string | null;
  survey_address_detail: string | null;
  survey_scheduled_at: string | null;
  work_scheduled_at: string | null;
  duration_hours: number | null;
  material_included: boolean;
  problem_description: string | null;
  pricing: {
    subtotal: number;
    material_cost: number;
    extra_fee_parking: number;
    extra_fee_others: number;
    discount_amount: number;
    total: number;
  };
  created_at: string | null;
};

const formatDate = (iso: string | null): string => {
  if (!iso) return '-';
  const d = new Date(iso);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} - ${hh}:${mm}`;
};

const getOrderTitle = (orderType: string, serviceName?: string): string => {
  switch (orderType) {
    case 'borongan_home':
      return 'Borongan - Untuk Rumah';
    case 'borongan_business':
      return 'Borongan - Untuk Bisnis';
    case 'daily_tukang':
      return serviceName ? `Tukang Harian - ${serviceName}` : 'Tukang Harian';
    case 'daily_with_material':
      return serviceName ? `Perbaikan - ${serviceName}` : 'Perbaikan + Material';
    default:
      return serviceName ?? 'Pesanan';
  }
};

const getOrderIcon = (orderType: string): string => {
  switch (orderType) {
    case 'borongan_home':
      return '🏡';
    case 'borongan_business':
      return '🏢';
    case 'daily_tukang':
      return '👷';
    case 'daily_with_material':
      return '🔧';
    default:
      return '🔨';
  }
};

const isBorongan = (orderType: string): boolean =>
  orderType === 'borongan_home' || orderType === 'borongan_business';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiClient.get(`/orders/${id}`);
        if (!cancelled && res.data?.success) {
          setOrder(res.data.data);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('[OrderDetail] fetch error:', err?.message);
          Alert.alert('Error', 'Gagal memuat detail pesanan');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handlePayNow = () => {
    if (!order) return;
    router.push({
      pathname: '/payment/[orderId]',
      params: {
        orderId: order.id.toString(),
        orderCode: order.order_code,
        totalAmount: order.pricing.total.toString(),
      },
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Text style={{ fontFamily: 'Poppins_400Regular', color: '#9CA3AF' }}>
          Memuat detail pesanan...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Text style={{ fontFamily: 'Poppins_500Medium', color: '#6B7280' }}>
          Pesanan tidak ditemukan
        </Text>
      </View>
    );
  }

  const isPendingPayment = order.status === 'pending_payment';
  const orderTitle = getOrderTitle(order.order_type, order.service?.name);
  const orderIcon = getOrderIcon(order.order_type);
  const orderIsBorongan = isBorongan(order.order_type);
  const dateLabel = orderIsBorongan ? 'Tanggal Survey' : 'Jadwal Pekerjaan';
  const dateValue = formatDate(
    orderIsBorongan ? order.survey_scheduled_at : order.work_scheduled_at,
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#E5EAF2" />

      {/* Header */}
      <View
        style={{
          backgroundColor: '#E5EAF2',
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#111827',
          }}
        >
          Detail Pesanan
        </Text>
        <TouchableOpacity style={{ padding: 4 }}>
          <MoreVertical size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Banner Selesaikan Pembayaran */}
        {isPendingPayment ? (
          <View style={{ backgroundColor: '#E5EAF2', paddingHorizontal: 16, paddingBottom: 16 }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_800ExtraBold',
                    fontSize: 18,
                    color: '#111827',
                    marginBottom: 4,
                  }}
                >
                  Selesaikan Pembayaran Kamu 🙏
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 13,
                    color: '#374151',
                    lineHeight: 18,
                  }}
                >
                  Segera lakukan pembayaran dan mulai pencarian Konsultan
                </Text>
              </View>
              <Text style={{ fontSize: 60 }}>💳</Text>
            </View>

            {/* Order Type Chip */}
            <View
              style={{
                backgroundColor: '#D1D9E8',
                borderRadius: 12,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 18 }}>{orderIcon}</Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 15,
                    color: '#111827',
                  }}
                >
                  {orderTitle}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 12,
                    color: '#9CA3AF',
                  }}
                >
                  {orderIsBorongan ? 'Survey' : 'Pekerjaan'}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Tanggal Survey / Jadwal */}
        <View style={{ backgroundColor: 'white', marginTop: 8, padding: 16 }}>
          <View
            style={{
              backgroundColor: '#E5EAF2',
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 14,
                color: '#374151',
              }}
            >
              {dateLabel}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 14,
                color: '#1E2D4F',
              }}
            >
              {dateValue}
            </Text>
          </View>
        </View>

        {/* Warning Banner */}
        <View style={{ backgroundColor: 'white', marginTop: 8, padding: 16 }}>
          <View style={{ backgroundColor: '#EFF6FF', borderRadius: 12, padding: 16 }}>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 15,
                color: '#111827',
                marginBottom: 4,
              }}
            >
              Mohon tidak bertransaksi di luar aplikasi.
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#6B7280',
                lineHeight: 18,
              }}
            >
              GoKang tidak bertanggung jawab atas transaksi yang terjadi di luar aplikasi
            </Text>
          </View>
        </View>

        {/* Detail Perbaikan */}
        <View style={{ backgroundColor: 'white', marginTop: 8, padding: 16 }}>
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 18,
              color: '#111827',
              marginBottom: 12,
            }}
          >
            Detail Perbaikan
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 13,
                color: '#9CA3AF',
                marginBottom: 4,
              }}
            >
              Deskripsi Masalah
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 15,
                color: '#111827',
                marginBottom: 12,
              }}
            >
              {order.problem_description ?? '-'}
            </Text>

            {/* Dashed separator */}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
                borderStyle: 'dashed',
                marginVertical: 12,
              }}
            />

            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 15,
                color: '#111827',
                marginBottom: 6,
              }}
            >
              Alamat Pengerjaan
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: '#374151',
                lineHeight: 20,
              }}
            >
              {order.survey_address ?? '-'}
            </Text>
            {order.survey_address_detail ? (
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 13,
                  color: '#6B7280',
                  marginTop: 4,
                  lineHeight: 18,
                }}
              >
                {order.survey_address_detail}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Rincian Total Harga */}
        <View style={{ backgroundColor: 'white', marginTop: 8, padding: 16 }}>
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 18,
              color: '#111827',
              marginBottom: 12,
            }}
          >
            Rincian Total Harga
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: '#E5EAF2',
              borderRadius: 12,
              padding: 16,
              backgroundColor: '#F2F4F8',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 14,
                  color: '#374151',
                }}
              >
                Total Pembayaran
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 16,
                  color: '#1E2D4F',
                }}
              >
                Rp{order.pricing.total.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>

        {/* Kebijakan Pemesanan Banner */}
        <View
          style={{
            backgroundColor: '#E5EAF2',
            marginTop: 8,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 16,
                  color: '#111827',
                  marginRight: 6,
                }}
              >
                Kebijakan Pemesanan
              </Text>
              <AlertCircle size={18} color="#1E2D4F" />
            </View>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 12,
                color: '#374151',
                lineHeight: 18,
                marginBottom: 8,
              }}
            >
              Pastikan kamu membaca seluruh kebijakan pemesanan pengerjaan proyek
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 13,
                  color: '#1E2D4F',
                }}
              >
                Selengkapnya →
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 70 }}>👷‍♂️</Text>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 24,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        }}
      >
        <Text
          style={{
            fontFamily: 'Poppins_500Medium',
            fontSize: 13,
            color: '#6B7280',
          }}
        >
          Total Pembayaran
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins_800ExtraBold',
            fontSize: 22,
            color: '#1E2D4F',
            marginBottom: 12,
          }}
        >
          Rp{order.pricing.total.toLocaleString('id-ID')}
        </Text>

        {isPendingPayment ? (
          <TouchableOpacity
            onPress={handlePayNow}
            style={{
              backgroundColor: '#F97316',
              borderRadius: 28,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 16,
                color: 'white',
              }}
            >
              Selesaikan Pembayaran
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              backgroundColor: '#F3F4F6',
              borderRadius: 28,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 14,
                color: '#9CA3AF',
              }}
            >
              Pesanan Sedang Diproses
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
