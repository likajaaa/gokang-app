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
import { ArrowLeft } from 'lucide-react-native';
import apiClient from '../../services/api/client';

const ADMIN_FEE = 5264;

const MastercardLogo: React.FC = () => (
  <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
    <View style={{ flexDirection: 'row', height: 18, alignItems: 'center' }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: '#EB001B',
        }}
      />
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: '#F79E1B',
          marginLeft: -7,
          opacity: 0.9,
        }}
      />
    </View>
    <Text
      style={{
        fontFamily: 'Poppins_500Medium',
        fontSize: 7,
        color: '#374151',
        marginTop: 1,
      }}
    >
      mastercard
    </Text>
  </View>
);

const VisaLogo: React.FC = () => (
  <View style={{ marginRight: 10, justifyContent: 'center' }}>
    <Text
      style={{
        fontFamily: 'Poppins_800ExtraBold',
        fontStyle: 'italic',
        fontSize: 18,
        color: '#1A1F71',
        letterSpacing: 1,
      }}
    >
      VISA
    </Text>
  </View>
);

const JcbLogo: React.FC = () => (
  <View
    style={{
      width: 38,
      height: 26,
      flexDirection: 'row',
      borderRadius: 3,
      overflow: 'hidden',
    }}
  >
    <View
      style={{ flex: 1, backgroundColor: '#0E4C96', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text
        style={{
          fontFamily: 'Poppins_800ExtraBold',
          fontStyle: 'italic',
          fontSize: 11,
          color: 'white',
        }}
      >
        J
      </Text>
    </View>
    <View
      style={{ flex: 1, backgroundColor: '#D2202E', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text
        style={{
          fontFamily: 'Poppins_800ExtraBold',
          fontStyle: 'italic',
          fontSize: 11,
          color: 'white',
        }}
      >
        C
      </Text>
    </View>
    <View
      style={{ flex: 1, backgroundColor: '#0B8A41', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text
        style={{
          fontFamily: 'Poppins_800ExtraBold',
          fontStyle: 'italic',
          fontSize: 11,
          color: 'white',
        }}
      >
        B
      </Text>
    </View>
  </View>
);

export default function CardScreen() {
  const { orderId, orderCode, totalAmount, expiresAt } = useLocalSearchParams<{
    orderId: string;
    orderCode: string;
    totalAmount: string;
    expiresAt: string;
  }>();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleCardNumberChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 6);
    if (digits.length <= 2) {
      setExpiry(digits);
    } else {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    }
  };

  const handleCvvChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    setCvv(digits);
  };

  const baseAmount = useMemo(() => parseInt(totalAmount || '0', 10), [totalAmount]);
  const grandTotal = baseAmount + ADMIN_FEE;

  const cardNumberDigits = cardNumber.replace(/\s/g, '');
  const isCardValid = cardNumberDigits.length >= 13 && cardNumberDigits.length <= 16;

  const expiryDigits = expiry.replace('/', '');
  const month = parseInt(expiryDigits.slice(0, 2) || '0', 10);
  const isExpiryValid = expiryDigits.length === 6 && month >= 1 && month <= 12;

  const isCvvValid = cvv.length >= 3;
  const canSubmit = isCardValid && isExpiryValid && isCvvValid && !submitting;

  const handlePay = async () => {
    if (!canSubmit) {
      return;
    }
    Keyboard.dismiss();
    setSubmitting(true);
    try {
      await apiClient.post(`/orders/${orderId}/simulate-payment`);
      Alert.alert(
        'Pembayaran Berhasil! 🎉',
        `Pesanan ${orderCode} telah dibayar dengan kartu •••• ${cardNumberDigits.slice(-4)}.\nKonsultan GoKang akan segera menghubungi kamu untuk jadwal survey.`,
        [
          {
            text: 'Lihat Pesanan',
            onPress: () => router.replace('/(tabs)/orders'),
          },
        ],
      );
    } catch (error: any) {
      console.error(
        '[Card] simulate-payment error:',
        error?.response?.data ?? error?.message,
      );
      const apiMessage =
        error?.response?.data?.message ?? 'Gagal memproses pembayaran. Coba lagi.';
      Alert.alert('Error', apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
                  Rp{ADMIN_FEE.toLocaleString('id-ID')}
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

          {/* Card form */}
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
                marginBottom: 18,
              }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827' }}>
                Kartu Kredit
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MastercardLogo />
                <VisaLogo />
                <JcbLogo />
              </View>
            </View>

            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 14,
                color: '#374151',
                marginBottom: 8,
              }}
            >
              Nomor Kartu
            </Text>
            <TextInput
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="number-pad"
              placeholder="0000 0000 0000 0000"
              placeholderTextColor="#D1D5DB"
              maxLength={19}
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 999,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontFamily: 'Poppins_500Medium',
                fontSize: 15,
                color: '#111827',
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 14,
                    color: '#374151',
                    marginBottom: 8,
                  }}
                >
                  Masa Berlaku
                </Text>
                <TextInput
                  value={expiry}
                  onChangeText={handleExpiryChange}
                  keyboardType="number-pad"
                  placeholder="MM / YYYY"
                  placeholderTextColor="#D1D5DB"
                  maxLength={7}
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 15,
                    color: '#111827',
                  }}
                />
              </View>

              <View style={{ width: 110 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 14,
                    color: '#374151',
                    marginBottom: 8,
                  }}
                >
                  CVV
                </Text>
                <TextInput
                  value={cvv}
                  onChangeText={handleCvvChange}
                  keyboardType="number-pad"
                  placeholder="123"
                  placeholderTextColor="#D1D5DB"
                  secureTextEntry
                  maxLength={4}
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 15,
                    color: '#111827',
                  }}
                />
              </View>
            </View>
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
