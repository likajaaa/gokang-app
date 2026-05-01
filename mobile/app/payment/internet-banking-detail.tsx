import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import apiClient from '../../services/api/client';
import {
  INTERNET_BANKING,
  type InternetBankingId,
  type InternetBankingOption,
} from '../../components/features/payment/internetBanking';

const PHONE_PREFIX = '62';
const MIN_PHONE_LENGTH = 10;
const MAX_PHONE_LENGTH = 15;

export default function InternetBankingDetailScreen() {
  const { orderId, orderCode, totalAmount, expiresAt, ibId } = useLocalSearchParams<{
    orderId: string;
    orderCode: string;
    totalAmount: string;
    expiresAt: string;
    ibId: InternetBankingId;
  }>();

  const ib: InternetBankingOption | undefined = ibId ? INTERNET_BANKING[ibId] : undefined;

  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [submitting, setSubmitting] = useState(false);

  // Track expiry deadline silently (no banner UI)
  useEffect(() => {
    const expiryMs = parseInt(expiresAt || '0', 10);
    if (!expiryMs) return;

    const interval = setInterval(() => {
      if (Date.now() >= expiryMs) {
        clearInterval(interval);
        Alert.alert(
          'Waktu Habis',
          'Waktu pembayaran sudah habis. Pesanan akan dibatalkan.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)/orders') }],
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setPhone(digits.slice(0, MAX_PHONE_LENGTH));
  };

  const handleClearPhone = () => {
    setPhone(PHONE_PREFIX);
  };

  const baseAmount = useMemo(() => parseInt(totalAmount || '0', 10), [totalAmount]);
  const adminFee = ib?.adminFee ?? 0;
  const grandTotal = baseAmount + adminFee;

  const isPhoneValid =
    phone.startsWith(PHONE_PREFIX) && phone.length >= MIN_PHONE_LENGTH;
  const canSubmit = isPhoneValid && !submitting;

  const handlePay = async () => {
    if (!ib || !canSubmit) return;
    Keyboard.dismiss();
    setSubmitting(true);
    try {
      await apiClient.post(`/orders/${orderId}/simulate-payment`);
      Alert.alert(
        'Pembayaran Berhasil! 🎉',
        `Pesanan ${orderCode} telah dibayar via ${ib.name}.\nKonsultan GoKang akan segera menghubungi kamu untuk jadwal survey.`,
        [
          {
            text: 'Lihat Pesanan',
            onPress: () => router.replace('/(tabs)/orders'),
          },
        ],
      );
    } catch (error: any) {
      console.error(
        '[InternetBanking Detail] simulate-payment error:',
        error?.response?.data ?? error?.message,
      );
      const apiMessage =
        error?.response?.data?.message ?? 'Gagal memproses pembayaran. Coba lagi.';
      Alert.alert('Error', apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!ib) {
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
          Layanan internet banking tidak ditemukan.
        </Text>
      </View>
    );
  }

  const Logo = ib.Logo;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F3F4F6' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Order summary card (no timer banner) */}
          <View
            style={{
              backgroundColor: 'white',
              marginHorizontal: 12,
              marginTop: 12,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 }}>
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

            <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 }}>
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

          {/* Internet banking input card */}
          <View
            style={{
              backgroundColor: 'white',
              marginHorizontal: 12,
              marginTop: 12,
              borderRadius: 8,
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827' }}>
                {ib.name}
              </Text>
              <Logo />
            </View>

            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 14,
                color: '#374151',
                marginBottom: 8,
              }}
            >
              Nomor HP kamu yang terdaftar
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 999,
                paddingHorizontal: 16,
                paddingVertical: 4,
              }}
            >
              <TextInput
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={MAX_PHONE_LENGTH}
                placeholder="62"
                placeholderTextColor="#9CA3AF"
                style={{
                  flex: 1,
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 15,
                  color: '#111827',
                  paddingVertical: 10,
                }}
              />
              {phone.length > 0 ? (
                <TouchableOpacity
                  onPress={handleClearPhone}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#E8272A',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={14} color="white" strokeWidth={3} />
                </TouchableOpacity>
              ) : null}
            </View>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 12,
                color: '#9CA3AF',
                marginTop: 6,
                marginLeft: 4,
              }}
            >
              Contoh: 62851 5523 2232
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

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
          disabled={!canSubmit}
          activeOpacity={0.85}
          style={{
            backgroundColor: canSubmit ? '#E8272A' : '#F3A1A3',
            borderRadius: 999,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: 'white' }}>
            {submitting ? 'Memproses…' : 'Bayar Sekarang'}
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
    </KeyboardAvoidingView>
  );
}
