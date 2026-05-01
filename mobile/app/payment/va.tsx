import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { BANK_LIST, type Bank } from '../../components/features/payment/banks';

export default function VirtualAccountScreen() {
  const { orderId, orderCode, totalAmount, expiresAt } = useLocalSearchParams<{
    orderId: string;
    orderCode: string;
    totalAmount: string;
    expiresAt: string;
  }>();

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

  const handleSelectVa = (bank: Bank) => {
    router.push({
      pathname: '/payment/va-detail',
      params: {
        orderId: orderId ?? '',
        orderCode: orderCode ?? '',
        totalAmount: totalAmount ?? '0',
        expiresAt: expiresAt ?? String(Date.now() + timeLeft * 1000),
        bankId: bank.id,
      },
    });
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Timer Banner */}
        <View
          style={{
            backgroundColor: '#FEE2E2',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            margin: 12,
            borderRadius: 8,
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
              fontSize: 20,
              color: '#1E2D4F',
            }}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>

        {/* VA List */}
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 12,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {BANK_LIST.map((bank, index) => {
            const isLast = index === BANK_LIST.length - 1;
            const Logo = bank.Logo;

            return (
              <TouchableOpacity
                key={bank.id}
                onPress={() => handleSelectVa(bank)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 18,
                  paddingHorizontal: 16,
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <View
                  style={{
                    width: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Logo />
                </View>

                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 14,
                    color: '#111827',
                    flex: 1,
                  }}
                >
                  {bank.name}
                </Text>

                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
