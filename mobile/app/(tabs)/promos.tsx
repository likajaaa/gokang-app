import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronRight, X } from 'lucide-react-native';
import { vouchersApi, type Voucher } from '../../services/api/vouchers';

function EmptyVoucher() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 80,
      }}
    >
      <View
        style={{
          width: 200,
          height: 200,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 15,
            width: 120,
            height: 20,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 60,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 25,
            width: 140,
            height: 90,
            backgroundColor: '#1E2D4F',
            borderRadius: 8,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 108,
            left: 30,
            width: 68,
            height: 36,
            backgroundColor: '#1E2D4F',
            borderRadius: 4,
            transform: [{ rotate: '-20deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 108,
            right: 30,
            width: 68,
            height: 36,
            backgroundColor: '#1E2D4F',
            borderRadius: 4,
            transform: [{ rotate: '20deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 20,
            right: 35,
            transform: [{ rotate: '30deg' }],
          }}
        >
          <Text style={{ fontSize: 44 }}>➤</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 55,
            right: 60,
            width: 40,
            height: 2,
            borderWidth: 1,
            borderColor: '#9CA3AF',
            borderStyle: 'dashed',
            transform: [{ rotate: '30deg' }],
          }}
        />
      </View>

      <Text
        style={{
          fontFamily: 'Poppins_700Bold',
          fontSize: 20,
          color: '#111827',
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        Belum Ada Voucher
      </Text>

      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 15,
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 22,
          maxWidth: 280,
        }}
      >
        Kamu belum memiliki voucher aktif yang dapat digunakan
      </Text>
    </View>
  );
}

function VoucherCard({ voucher }: { voucher: Voucher }) {
  const expiresAt = voucher.expires_at ? new Date(voucher.expires_at).getTime() : Infinity;
  const now = Date.now();
  const isExpired = expiresAt < now;
  const isExpiringSoon = !isExpired && expiresAt - now < 3 * 24 * 60 * 60 * 1000;

  const formatDate = (iso: string | null) => {
    if (!iso) return 'Tanpa batas waktu';
    const d = new Date(iso);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const discountText =
    voucher.discount_type === 'percentage'
      ? voucher.max_discount !== null
        ? `Diskon ${voucher.discount_value}% (maks. Rp ${voucher.max_discount.toLocaleString('id-ID')})`
        : `Diskon ${voucher.discount_value}%`
      : `Diskon Rp ${voucher.discount_value.toLocaleString('id-ID')}`;

  const accentColor = isExpired ? '#9CA3AF' : isExpiringSoon ? '#F97316' : '#1E2D4F';

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        opacity: isExpired ? 0.6 : 1,
        flexDirection: 'row',
      }}
    >
      <View style={{ width: 8, backgroundColor: accentColor }} />

      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_800ExtraBold',
              fontSize: 18,
              color: accentColor,
              letterSpacing: 1,
            }}
          >
            {voucher.code}
          </Text>

          {isExpiringSoon ? (
            <View
              style={{
                backgroundColor: '#FEF3C7',
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 11,
                  color: '#D97706',
                }}
              >
                Segera Berakhir
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          style={{
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 15,
            color: isExpired ? '#9CA3AF' : '#111827',
            marginBottom: 4,
          }}
        >
          {voucher.name}
        </Text>

        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 13,
            color: '#6B7280',
            marginBottom: 12,
          }}
        >
          {discountText}
        </Text>

        <View
          style={{
            height: 1,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderStyle: 'dashed',
            marginBottom: 12,
            marginHorizontal: -16,
          }}
        />

        <View style={{ gap: 4, marginBottom: 12 }}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: '#6B7280',
            }}
          >
            📋 Berlaku untuk: {voucher.applicable_for.join(', ')}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: '#6B7280',
            }}
          >
            📋 Minimal order: Rp {voucher.min_order.toLocaleString('id-ID')}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: isExpired ? '#1E2D4F' : '#6B7280',
            }}
          >
            📅 {isExpired ? 'Kadaluwarsa' : 'Berlaku hingga'}: {formatDate(voucher.expires_at)}
          </Text>
        </View>

        <TouchableOpacity
          disabled={isExpired}
          onPress={() =>
            Alert.alert(
              'Gunakan Voucher',
              `Voucher ${voucher.code} akan digunakan saat checkout`,
            )
          }
          style={{
            backgroundColor: isExpired ? '#E5E7EB' : '#1E2D4F',
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 15,
              color: isExpired ? '#9CA3AF' : 'white',
            }}
          >
            {isExpired ? 'Tidak Dapat Digunakan' : 'Gunakan Voucher'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PromoCodeModal({
  visible,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: (voucher: Voucher) => void;
}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRedeem = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await vouchersApi.redeem(code);
      const voucher = res.data.data;
      setCode('');
      onSuccess(voucher);
      onClose();
      Alert.alert('Berhasil! 🎉', res.data.message ?? 'Kode promo berhasil ditambahkan!');
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage ?? 'Kode promo tidak valid atau sudah kedaluwarsa');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              width: 48,
              height: 4,
              backgroundColor: '#E5E7EB',
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 20,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 18,
                color: '#111827',
              }}
            >
              Masukkan Kode Promo
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TextInput
            value={code}
            onChangeText={(text) => {
              setCode(text.toUpperCase());
              setError('');
            }}
            placeholder="Kode Promo"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            autoCorrect={false}
            style={{
              borderWidth: 1.5,
              borderColor: error ? '#1E2D4F' : '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              fontFamily: 'Poppins_500Medium',
              fontSize: 16,
              color: '#111827',
              marginBottom: 8,
            }}
          />

          {error ? (
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#1E2D4F',
                marginBottom: 12,
              }}
            >
              ⚠️ {error}
            </Text>
          ) : (
            <View style={{ height: 12 }} />
          )}

          <TouchableOpacity
            onPress={handleRedeem}
            disabled={!code.trim() || loading}
            style={{
              backgroundColor: !code.trim() || loading ? '#D1D5DB' : '#1E2D4F',
              borderRadius: 28,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text
                style={{
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 16,
                  color: !code.trim() ? '#9CA3AF' : 'white',
                }}
              >
                Gunakan Kode Promo
              </Text>
            )}
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 12,
              color: '#9CA3AF',
              textAlign: 'center',
            }}
          >
            Syarat & ketentuan berlaku
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function PromosScreen() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVouchers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await vouchersApi.wallet();
      setVouchers(res.data.data ?? []);
    } catch (err: any) {
      console.error('[Promos] fetch error:', err?.response?.data ?? err?.message);
      setVouchers([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleVoucherAdded = (voucher: Voucher) => {
    setVouchers((prev) =>
      prev.find((v) => v.id === voucher.id) ? prev : [voucher, ...prev],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: 52,
          paddingBottom: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#111827',
          }}
        >
          Promo
        </Text>
      </View>

      <FlatList
        data={vouchers}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchVouchers(true)}
            colors={['#1E2D4F']}
            tintColor="#1E2D4F"
          />
        }
        ListHeaderComponent={
          <>
            <View
              style={{
                backgroundColor: 'white',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                activeOpacity={0.85}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 28,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  backgroundColor: 'white',
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#7B1D1D',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'white',
                      fontFamily: 'Poppins_700Bold',
                    }}
                  >
                    %
                  </Text>
                </View>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 15,
                    color: '#111827',
                  }}
                >
                  Masukkan kode promo disini
                </Text>

                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {vouchers.length > 0 ? (
              <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 16,
                    color: '#111827',
                  }}
                >
                  Voucher Kamu ({vouchers.length})
                </Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={<EmptyVoucher />}
        renderItem={({ item }) => <VoucherCard voucher={item} />}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      />

      <PromoCodeModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleVoucherAdded}
      />
    </View>
  );
}
