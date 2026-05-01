import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import {
  BANKS,
  type Bank,
  type BankId,
  type InstructionGroup,
} from '../../components/features/payment/banks';

const VA_PREFIXES: Record<BankId, string> = {
  bca: '70070',
  mandiri: '88608',
  bri: '26215',
  bni: '9888',
  permata: '8625',
};

const generateVaNumber = (bankId: BankId, orderId: string): string => {
  const prefix = VA_PREFIXES[bankId];
  const digits = (orderId || '').replace(/\D/g, '').padStart(10, '0').slice(-10);
  return `${prefix}${digits}`;
};

type TabId = 'atm' | 'mobileBanking' | 'internetBanking';

const TABS: { id: TabId; label: string }[] = [
  { id: 'atm', label: 'ATM' },
  { id: 'mobileBanking', label: 'Mobile\nBanking' },
  { id: 'internetBanking', label: 'Internet\nBanking' },
];

export default function VaDetailScreen() {
  const { orderId, orderCode, totalAmount, expiresAt, bankId } = useLocalSearchParams<{
    orderId: string;
    orderCode: string;
    totalAmount: string;
    expiresAt: string;
    bankId: BankId;
  }>();

  const bank: Bank | undefined = bankId ? BANKS[bankId] : undefined;

  const [activeTab, setActiveTab] = useState<TabId>('atm');

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

  const activeInstructions: InstructionGroup[] = useMemo(() => {
    if (!bank) {
      return [];
    }
    return bank.instructions[activeTab];
  }, [bank, activeTab]);

  const vaNumber = useMemo(
    () => (bank ? generateVaNumber(bank.id, orderId ?? '') : ''),
    [bank, orderId],
  );

  const handleCopyVa = async () => {
    if (!vaNumber) return;
    try {
      await Clipboard.setStringAsync(vaNumber);
      Alert.alert('Berhasil disalin', `Nomor Virtual Account ${vaNumber} sudah disalin ke clipboard.`);
    } catch (error: any) {
      console.error('[VA Detail] copy error:', error?.message);
      Alert.alert('Gagal menyalin', 'Tidak bisa menyalin nomor VA. Coba lagi.');
    }
  };

  if (!bank) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Poppins_500Medium', color: '#6B7280' }}>
          Bank tidak ditemukan.
        </Text>
      </View>
    );
  }

  const Logo = bank.Logo;

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
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, color: '#111827' }}>
                Total Harga
              </Text>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: '#E8272A' }}>
                Rp{parseInt(totalAmount || '0', 10).toLocaleString('id-ID')}
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

        {/* Nomor Virtual Account card */}
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
              marginBottom: 8,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: '#6B7280' }}>
              Nomor Virtual Account
            </Text>
            <Logo />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_800ExtraBold',
                fontSize: 20,
                color: '#111827',
                letterSpacing: 0.5,
                flex: 1,
              }}
            >
              {vaNumber}
            </Text>
            <TouchableOpacity
              onPress={handleCopyVa}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 6,
                paddingHorizontal: 10,
              }}
            >
              <Copy size={16} color="#E8272A" style={{ marginRight: 6 }} />
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: '#E8272A' }}>
                Salin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cara Pembayaran card */}
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 12,
            marginTop: 12,
            borderRadius: 8,
            paddingTop: 20,
            paddingBottom: 24,
          }}
        >
          {/* Title + Bank logo */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#111827' }}>
              Cara Pembayaran?
            </Text>
            <Logo />
          </View>

          {/* Tabs */}
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: '#F3F4F6',
              borderBottomWidth: 1,
              borderBottomColor: '#F3F4F6',
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    alignItems: 'center',
                    borderBottomWidth: 2,
                    borderBottomColor: isActive ? '#E8272A' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: isActive ? 'Poppins_700Bold' : 'Poppins_500Medium',
                      fontSize: 14,
                      color: isActive ? '#111827' : '#9CA3AF',
                      textAlign: 'center',
                      lineHeight: 18,
                    }}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Instructions */}
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            {activeInstructions.map((group, gIdx) => (
              <View key={gIdx} style={{ marginBottom: gIdx === activeInstructions.length - 1 ? 0 : 16 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 14,
                    color: '#111827',
                    marginBottom: 8,
                  }}
                >
                  {group.title}
                </Text>
                {group.steps.map((step, sIdx) => (
                  <Text
                    key={sIdx}
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 14,
                      color: '#374151',
                      lineHeight: 22,
                      marginBottom: 4,
                    }}
                  >
                    {sIdx + 1}. {step}
                  </Text>
                ))}
              </View>
            ))}
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
          onPress={handleCopyVa}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#E8272A',
            borderRadius: 999,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Copy size={18} color="white" style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: 'white' }}>
            Salin No. Virtual Account
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
