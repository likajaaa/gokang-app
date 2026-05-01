import { useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, CreditCard } from 'lucide-react-native';
import apiClient from '../../services/api/client';
import {
  INSTALLMENTS,
  type Installment,
  type InstallmentId,
} from '../../components/features/payment/installments';

const ID_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const formatDeadline = (expiryMs: number): string => {
  if (!expiryMs) return '-';
  const d = new Date(expiryMs);
  const day = d.getDate();
  const month = ID_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${day} ${month} ${year} ${hh}:${mm}:${ss} WIB`;
};

export default function InstallmentConfirmScreen() {
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

  const [submitting, setSubmitting] = useState(false);

  const baseAmount = useMemo(() => parseInt(totalAmount || '0', 10), [totalAmount]);
  const adminFee = installment?.adminFee ?? 0;
  const grandTotal = baseAmount + adminFee;

  const deadline = useMemo(
    () => formatDeadline(parseInt(expiresAt || '0', 10)),
    [expiresAt],
  );

  const handleFinish = async () => {
    if (!installment || submitting) return;
    setSubmitting(true);
    try {
      await apiClient.post(`/orders/${orderId}/simulate-payment`);
      Alert.alert(
        'Pembayaran Berhasil! 🎉',
        `Pesanan ${orderCode} telah dibayar via ${installment.name}.\nKonsultan GoKang akan segera menghubungi kamu untuk jadwal survey.`,
        [
          {
            text: 'Lihat Pesanan',
            onPress: () => router.replace('/(tabs)/orders'),
          },
        ],
      );
    } catch (error: any) {
      console.error(
        '[Installment Confirm] simulate-payment error:',
        error?.response?.data ?? error?.message,
      );
      const apiMessage =
        error?.response?.data?.message ?? 'Gagal memproses pembayaran. Coba lagi.';
      Alert.alert('Error', apiMessage);
    } finally {
      setSubmitting(false);
    }
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Yellow info banner */}
        <View
          style={{
            backgroundColor: '#FEF3E8',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 16,
            marginTop: 0,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#F97316',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              marginTop: 2,
            }}
          >
            <Check size={20} color="white" strokeWidth={3} />
          </View>
          <Text
            style={{
              flex: 1,
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              color: '#111827',
              lineHeight: 20,
            }}
          >
            Kanggo merekomendasikan untuk{' '}
            <Text style={{ fontFamily: 'Poppins_700Bold' }}>menyimpan bukti pembayaran</Text>{' '}
            Anda sebagai bukti yang sah jika terjadi masalah
          </Text>
        </View>

        {/* Order summary card */}
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 12,
            marginTop: 12,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
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

        {/* Red deadline banner */}
        <View
          style={{
            backgroundColor: '#E8272A',
            marginHorizontal: 12,
            marginTop: 12,
            borderRadius: 6,
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: 'white',
              textAlign: 'center',
            }}
          >
            Segera bayar sebelum:{' '}
            <Text style={{ fontFamily: 'Poppins_700Bold' }}>{deadline}</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Bottom: Metode Pembayaran card + Selesaikan button */}
      <View
        style={{
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingTop: 12,
          paddingBottom: 24,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#FEE2E2',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <CreditCard size={18} color="#E8272A" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#6B7280' }}>
              Metode Pembayaran
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Text
                style={{
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 15,
                  color: '#111827',
                  marginRight: 6,
                }}
              >
                {installment.name}
              </Text>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#10B981',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={11} color="white" strokeWidth={4} />
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              borderWidth: 1,
              borderColor: '#E8272A',
              borderRadius: 999,
              paddingVertical: 6,
              paddingHorizontal: 18,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: '#E8272A' }}>
              Ubah
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleFinish}
          disabled={submitting}
          activeOpacity={0.85}
          style={{
            backgroundColor: submitting ? '#F3A1A3' : '#E8272A',
            borderRadius: 999,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: 'white' }}>
            {submitting ? 'Memproses…' : 'Selesaikan Pembayaran'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
