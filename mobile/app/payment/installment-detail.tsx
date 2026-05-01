import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import {
  INSTALLMENTS,
  type Installment,
  type InstallmentId,
} from '../../components/features/payment/installments';

export default function InstallmentDetailScreen() {
  const { orderId, orderCode, totalAmount, expiresAt, installmentId } = useLocalSearchParams<{
    orderId: string;
    orderCode: string;
    totalAmount: string;
    expiresAt: string;
    installmentId: InstallmentId;
  }>();

  const installment: Installment | undefined = installmentId
    ? INSTALLMENTS[installmentId]
    : undefined;

  const computeTimeLeft = () => {
    const expiryMs = parseInt(expiresAt || '0', 10);
    if (!expiryMs) {
      return 60 * 60;
    }
    return Math.max(0, Math.floor((expiryMs - Date.now()) / 1000));
  };

  const [timeLeft, setTimeLeft] = useState(computeTimeLeft);

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
      setTimeLeft(computeTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const baseAmount = useMemo(() => parseInt(totalAmount || '0', 10), [totalAmount]);
  const adminFee = installment?.adminFee ?? 0;
  const grandTotal = baseAmount + adminFee;

  const handlePay = () => {
    if (!installment) return;
    router.push({
      pathname: '/payment/installment-confirm',
      params: {
        orderId: orderId ?? '',
        orderCode: orderCode ?? '',
        totalAmount: totalAmount ?? '0',
        expiresAt: expiresAt ?? '',
        installmentId: installment.id,
      },
    });
  };

  if (!installment) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: 'Poppins_500Medium', color: '#6B7280' }}>
          Cicilan tidak ditemukan.
        </Text>
      </View>
    );
  }

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
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 8 }}>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Timer + Order summary card */}
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 12,
            marginTop: 12,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              backgroundColor: '#FEE2E2',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>⏰</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, color: '#111827' }}>
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

            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: '#1E2D4F' }}>
              {formatTime(timeLeft)}
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, color: '#111827' }}>
                Total Harga
              </Text>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: '#E8272A' }}>
                Rp{grandTotal.toLocaleString('id-ID')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 4,
              }}
            >
              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#9CA3AF' }}>
                Termasuk biaya admin bank
              </Text>
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: '#9CA3AF' }}>
                Rp{adminFee.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 16 }} />

          <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: '#374151' }}>
                Invoice
              </Text>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, color: '#111827' }}>
                {orderCode}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 24,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        }}
      >
        <TouchableOpacity
          onPress={handlePay}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#E8272A',
            borderRadius: 999,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: 'white' }}>
            Bayar Sekarang
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 12,
            color: '#374151',
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          Dengan melakukan pembayaran Anda menyetujui seluruh{' '}
          <Text style={{ color: '#E8272A', fontFamily: 'Poppins_500Medium' }}>
            Syarat & Ketentuan
          </Text>{' '}
          Kanggo
        </Text>
      </View>
    </View>
  );
}
