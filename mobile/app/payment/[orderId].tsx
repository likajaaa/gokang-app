import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  CreditCard,
  Repeat,
  Smartphone,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import apiClient from '../../services/api/client';

type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  adminFee?: number;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'va',
    name: 'Transfer Virtual Account',
    description: 'BCA, Mandiri, BRI, BNI, Permata',
    icon: Repeat,
    iconColor: '#1E2D4F',
    bgColor: '#E5EAF2',
  },
  {
    id: 'ewallet',
    name: 'Dompet Digital',
    description: 'OVO, Gopay, Dana, ShopeePay, QRIS',
    icon: Wallet,
    iconColor: '#1E2D4F',
    bgColor: '#E5EAF2',
  },
  {
    id: 'card',
    name: 'Kartu Kredit atau Debit',
    description: 'Visa, Mastercard, JCB',
    icon: CreditCard,
    iconColor: '#1E2D4F',
    bgColor: '#E5EAF2',
    adminFee: 5264,
  },
  {
    id: 'installment',
    name: 'Cicilan',
    description: 'Kredivo, Indodana, Atome',
    icon: Calendar,
    iconColor: '#1E2D4F',
    bgColor: '#E5EAF2',
  },
  {
    id: 'banking',
    name: 'Internet Banking',
    description: 'Blu BCA, Octo Clicks',
    icon: Smartphone,
    iconColor: '#1E2D4F',
    bgColor: '#E5EAF2',
  },
];

export default function PaymentScreen() {
  const { orderId, orderCode, totalAmount } = useLocalSearchParams<{
    orderId: string;
    orderCode: string;
    totalAmount: string;
  }>();

  // Timer 1 jam (3600 detik)
  const [timeLeft, setTimeLeft] = useState(60 * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      Alert.alert(
        'Waktu Habis',
        'Waktu pembayaran sudah habis. Pesanan akan dibatalkan.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/orders') }],
      );
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectMethod = (method: PaymentMethod) => {
    const NAV_ROUTES: Record<
      string,
      | '/payment/va'
      | '/payment/ewallet'
      | '/payment/card'
      | '/payment/installment'
      | '/payment/internet-banking'
    > = {
      va: '/payment/va',
      ewallet: '/payment/ewallet',
      card: '/payment/card',
      installment: '/payment/installment',
      banking: '/payment/internet-banking',
    };

    const target = NAV_ROUTES[method.id];
    if (target) {
      const expiresAt = Date.now() + timeLeft * 1000;
      router.push({
        pathname: target,
        params: {
          orderId: orderId ?? '',
          orderCode: orderCode ?? '',
          totalAmount: totalAmount ?? '0',
          expiresAt: String(expiresAt),
        },
      });
      return;
    }

    Alert.alert(
      method.name,
      `Lanjutkan pembayaran via ${method.name}?${
        method.adminFee
          ? `\n\nBiaya admin: Rp ${method.adminFee.toLocaleString('id-ID')}`
          : ''
      }`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Bayar', onPress: () => processPayment(method) },
      ],
    );
  };

  const processPayment = async (method: PaymentMethod) => {
    try {
      // Mock payment via backend — internally panggil PaymentService::markAsSuccess
      // yang routes status per order_type:
      //   borongan  → on_survey (Tab Aktif)
      //   daily_*   → paid → searching_tukang (existing flow)
      await apiClient.post(`/orders/${orderId}/simulate-payment`);

      Alert.alert(
        'Pembayaran Berhasil! 🎉',
        `Pesanan ${orderCode} telah dibayar via ${method.name}.\nKonsultan GoKang akan segera menghubungi kamu untuk jadwal survey.`,
        [
          {
            text: 'Lihat Pesanan',
            onPress: () => router.replace('/(tabs)/orders'),
          },
        ],
      );
    } catch (error: any) {
      console.error('[Payment] simulate-payment error:', error?.response?.data ?? error?.message);
      const apiMessage = error?.response?.data?.message ?? 'Gagal memproses pembayaran. Coba lagi.';
      Alert.alert('Error', apiMessage);
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Batalkan Pembayaran?',
      'Pesanan akan tetap tersimpan, kamu bisa lanjut bayar nanti dari halaman Pesanan.',
      [
        { text: 'Lanjut Bayar', style: 'cancel' },
        { text: 'Bayar Nanti', onPress: () => router.replace('/(tabs)/orders') },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: 52,
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity onPress={handleBack} style={{ padding: 4, marginRight: 8 }}>
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
          Pembayaran
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Timer Banner */}
        <View
          style={{
            backgroundColor: '#FEF3E8',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 28 }}>⏰</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 14,
                color: '#111827',
              }}
            >
              Sisa waktu pemesanan
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#374151',
                marginTop: 2,
              }}
            >
              Pilih metode pembayaran dan bayar!
            </Text>
          </View>

          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 22,
              color: '#1E2D4F',
            }}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>

        {/* Payment Methods */}
        <View style={{ backgroundColor: 'white', marginTop: 8 }}>
          {PAYMENT_METHODS.map((method, index) => {
            const IconComponent = method.icon;
            const isLast = index === PAYMENT_METHODS.length - 1;

            return (
              <TouchableOpacity
                key={method.id}
                onPress={() => handleSelectMethod(method)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    backgroundColor: method.bgColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <IconComponent size={26} color={method.iconColor} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_700Bold',
                      fontSize: 15,
                      color: '#111827',
                      marginBottom: 4,
                    }}
                  >
                    {method.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 13,
                      color: '#9CA3AF',
                    }}
                  >
                    {method.description}
                  </Text>

                  {method.adminFee ? (
                    <Text
                      style={{
                        fontFamily: 'Poppins_500Medium',
                        fontSize: 13,
                        color: '#1E2D4F',
                        marginTop: 4,
                      }}
                    >
                      Biaya Admin Rp. {method.adminFee.toLocaleString('id-ID')}
                    </Text>
                  ) : null}
                </View>

                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Info Card */}
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 8,
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
            Kode Pesanan
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
              color: '#111827',
              marginBottom: 12,
            }}
          >
            {orderCode}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#F3F4F6',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 14,
                color: '#6B7280',
              }}
            >
              Total Pembayaran
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_800ExtraBold',
                fontSize: 20,
                color: '#1E2D4F',
              }}
            >
              Rp {parseInt(totalAmount || '0', 10).toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
