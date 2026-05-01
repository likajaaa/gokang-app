import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import {
  ordersApi,
  type OrderListItem,
  type OrderStatus,
  type OrderTab,
} from '../../services/api/orders';

type TabCounts = Record<OrderTab, number>;

const STATUS_BADGE: Record<OrderStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: '#6B7280' },
  pending_payment: { label: 'Belum Dibayar', color: '#1E2D4F' },
  pending_survey: { label: 'Menunggu Survey', color: '#2563EB' },
  on_survey: { label: 'Survey Berlangsung', color: '#16A34A' },
  pending_assignment: { label: 'Mencari Tukang', color: '#7C3AED' },
  paid: { label: 'Sudah Dibayar', color: '#2563EB' },
  searching_tukang: { label: 'Mencari Tukang', color: '#7C3AED' },
  assigned: { label: 'Tukang Ditugaskan', color: '#4F46E5' },
  on_progress: { label: 'Sedang Dikerjakan', color: '#16A34A' },
  in_progress: { label: 'Sedang Dikerjakan', color: '#16A34A' },
  waiting_payment_final: { label: 'Menunggu Pelunasan', color: '#D97706' },
  completed: { label: 'Selesai', color: '#6B7280' },
  cancelled: { label: 'Dibatalkan', color: '#1E2D4F' },
  refunded: { label: 'Dana Dikembalikan', color: '#1E2D4F' },
  rejected: { label: 'Ditolak', color: '#1E2D4F' },
};

const serviceIcon = (order: OrderListItem): string => {
  if (order.service) {
    const n = order.service.name.toLowerCase();
    if (n.includes('cat')) return '🎨';
    if (n.includes('keramik')) return '🔶';
    if (n.includes('listrik')) return '⚡';
    if (n.includes('pipa')) return '💧';
    if (n.includes('batu')) return '🧱';
    if (n.includes('plafon')) return '📐';
    if (n.includes('sanitair') || n.includes('toilet')) return '🚽';
    if (n.includes('genteng') || n.includes('atap')) return '🏠';
    if (n.includes('ac')) return '❄️';
    if (n.includes('kebocoran') || n.includes('waterproof')) return '💧';
    if (n.includes('toren')) return '🚰';
    return '🔧';
  }
  if (order.order_type === 'borongan_home') return '🏡';
  if (order.order_type === 'borongan_business') return '🏢';
  if (order.order_type === 'daily_with_material') return '🔧';
  return '🔨';
};

function getOrderTypeLabel(orderType: string): string {
  switch (orderType) {
    case 'borongan_home':
    case 'borongan_business':
      return 'Survey Borongan';
    case 'daily_tukang':
      return 'Tukang Harian';
    case 'daily_with_material':
      return 'Perbaikan + Material';
    default:
      return 'Pesanan';
  }
}

function getCardTitle(order: OrderListItem): string {
  switch (order.order_type) {
    case 'borongan_home':
      return 'Borongan - Untuk Rumah';
    case 'borongan_business':
      return 'Borongan - Untuk Bisnis';
    case 'daily_tukang':
      return order.service ? `Tukang Harian - ${order.service.name}` : 'Tukang Harian';
    case 'daily_with_material':
      return order.service ? `Perbaikan - ${order.service.name}` : 'Perbaikan + Material';
    default:
      return order.service?.name ?? 'Pesanan';
  }
}

function formatDateLong(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} - ${hh}:${mm}`;
}

function OrderCard({ order }: { order: OrderListItem }) {
  const icon = serviceIcon(order);
  const title = getCardTitle(order);
  const orderTypeLabel = getOrderTypeLabel(order.order_type);
  const badge = STATUS_BADGE[order.status] ?? STATUS_BADGE.pending_payment;
  const isUnpaid = order.status === 'pending_payment';

  const isBoronganOrder =
    order.order_type === 'borongan_home' || order.order_type === 'borongan_business';
  const dateLabel = isBoronganOrder ? 'Tanggal Survey Proyek' : 'Jadwal Pekerjaan';
  const dateValue = formatDateLong(
    isBoronganOrder ? order.survey_scheduled_at : order.work_scheduled_at,
  );

  const orderIdShort = `ID${order.id.toString().padStart(5, '0')}`;

  const handlePayNow = () => {
    router.push({
      pathname: '/payment/[orderId]',
      params: {
        orderId: order.id.toString(),
        orderCode: order.order_code,
        totalAmount: order.pricing.total.toString(),
      },
    });
  };

  const handleViewDetail = () => router.push(`/order/${order.id}`);

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Top Row: Status Badges + ID */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          <View
            style={{
              backgroundColor: badge.color,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11, color: 'white' }}>
              {badge.label}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#F97316',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11, color: 'white' }}>
              {orderTypeLabel}
            </Text>
          </View>
        </View>

        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 11, color: '#9CA3AF' }}>
          {orderIdShort}
        </Text>
      </View>

      {/* Dashed Separator */}
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          borderStyle: 'dashed',
          marginBottom: 14,
        }}
      />

      {/* Title with Icon */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#E5EAF2',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>{icon}</Text>
        </View>
        <Text
          style={{
            flex: 1,
            fontFamily: 'Poppins_700Bold',
            fontSize: 14,
            color: '#111827',
          }}
        >
          {title}
        </Text>
      </View>

      {/* Address */}
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 13,
          color: '#374151',
          marginBottom: 14,
        }}
      >
        {order.survey_address ?? '-'}
      </Text>

      {/* Date Box */}
      <View
        style={{
          backgroundColor: '#F9FAFB',
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 16,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontFamily: 'Poppins_500Medium',
            fontSize: 12,
            color: '#6B7280',
            marginBottom: 4,
          }}
        >
          {dateLabel}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 14,
            color: '#111827',
          }}
        >
          {dateValue}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {isUnpaid ? (
          <>
            <TouchableOpacity
              onPress={handlePayNow}
              style={{
                flex: 1,
                backgroundColor: '#F97316',
                borderRadius: 28,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: 'white' }}>
                Bayar Sekarang
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewDetail}
              style={{
                flex: 1,
                borderWidth: 1.5,
                borderColor: '#F97316',
                borderRadius: 28,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: '#F97316' }}>
                Lihat Pesanan
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleViewDetail}
            style={{
              flex: 1,
              borderWidth: 1.5,
              borderColor: '#F97316',
              borderRadius: 28,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, color: '#F97316' }}>
              Lihat Pesanan
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const EMPTY_COPY: Record<OrderTab, { title: string; subtitle: string }> = {
  rencana: {
    title: 'Belum Ada Proyek',
    subtitle: 'Kamu belum pernah memesan layanan atau tukang langsung',
  },
  aktif: {
    title: 'Tidak Ada Pesanan Aktif',
    subtitle: 'Saat ini tidak ada pesanan yang sedang berjalan',
  },
  arsip: {
    title: 'Belum Ada Arsip',
    subtitle: 'Pesanan yang selesai atau dibatalkan akan muncul di sini',
  },
};

function OpenBoxIllustration() {
  return (
    <View
      style={{
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
      }}
    >
      <View
        style={{
          width: 140,
          height: 100,
          backgroundColor: '#1E2D4F',
          borderRadius: 8,
          position: 'absolute',
          bottom: 20,
          shadowColor: '#1E2D4F',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      />
      <View
        style={{
          width: 70,
          height: 40,
          backgroundColor: '#1E2D4F',
          borderRadius: 4,
          position: 'absolute',
          bottom: 110,
          left: 30,
          transform: [{ rotate: '-15deg' }],
        }}
      />
      <View
        style={{
          width: 70,
          height: 40,
          backgroundColor: '#1E2D4F',
          borderRadius: 4,
          position: 'absolute',
          bottom: 110,
          right: 30,
          transform: [{ rotate: '15deg' }],
        }}
      />
      <Text
        style={{
          fontSize: 48,
          position: 'absolute',
          top: 10,
          right: 30,
          transform: [{ rotate: '15deg' }],
        }}
      >
        ✈️
      </Text>
    </View>
  );
}

function EmptyState({ tab }: { tab: OrderTab }) {
  const copy = EMPTY_COPY[tab];
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
      }}
    >
      <OpenBoxIllustration />
      <Text
        style={{
          fontFamily: 'Poppins_700Bold',
          fontSize: 20,
          color: '#111827',
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        {copy.title}
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 15,
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 22,
        }}
      >
        {copy.subtitle}
      </Text>
    </View>
  );
}

function WarningBanner() {
  return (
    <View
      style={{
        paddingHorizontal: 32,
        paddingVertical: 24,
        backgroundColor: 'white',
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          fontFamily: 'Poppins_700Bold',
          fontSize: 16,
          color: '#6B7280',
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        Mohon tidak bertransaksi di luar aplikasi.
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 14,
          color: '#9CA3AF',
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        GoKang tidak bertanggung jawab atas transaksi yang terjadi di luar aplikasi
      </Text>
    </View>
  );
}

const TABS: { key: OrderTab; label: string }[] = [
  { key: 'rencana', label: 'Rencana' },
  { key: 'aktif', label: 'Aktif' },
  { key: 'arsip', label: 'Arsip' },
];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<OrderTab>('rencana');
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [, setTabCounts] = useState<TabCounts>({ rencana: 0, aktif: 0, arsip: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Filter orders by order_code, service title, atau survey_address
  const filteredOrders = searchQuery.trim()
    ? orders.filter((order) => {
        const q = searchQuery.toLowerCase().trim();
        const title = getCardTitle(order).toLowerCase();
        const code = order.order_code.toLowerCase();
        const addr = (order.survey_address ?? '').toLowerCase();
        return code.includes(q) || title.includes(q) || addr.includes(q);
      })
    : orders;

  const handleTabChange = (tab: OrderTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
  };

  const fetchOrders = useCallback(
    async (tab: OrderTab, isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setFetchError(null);

      try {
        const res = await ordersApi.listByTab(tab);
        setOrders(res.data.data ?? []);
        if (res.data.meta.tab_counts) {
          setTabCounts(res.data.meta.tab_counts);
        }
      } catch (err: any) {
        const status = err.response?.status;
        const apiMsg = err.response?.data?.message;
        console.error('[Orders] fetch error:', status, apiMsg || err.message);
        setOrders([]);
        if (!err.response) {
          setFetchError('Tidak bisa konek ke server. Cek koneksi atau backend belum jalan.');
        } else if (status === 401) {
          setFetchError('Sesi habis. Silakan login ulang.');
        } else if (status === 500) {
          setFetchError('Server error. Cek Laravel logs.');
        } else {
          setFetchError(apiMsg ?? 'Gagal memuat pesanan.');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab, fetchOrders]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: 52,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        {!isSearching ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <View style={{ width: 40 }} />
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 18,
                color: '#111827',
              }}
            >
              Pesanan
            </Text>
            <TouchableOpacity
              onPress={() => setIsSearching(true)}
              style={{ width: 40, alignItems: 'flex-end' }}
            >
              <Search size={22} color="#111827" />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
              gap: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F3F4F6',
                borderRadius: 28,
                paddingHorizontal: 14,
                paddingVertical: 10,
              }}
            >
              <Search size={18} color="#9CA3AF" />
              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cari kode, layanan, atau alamat..."
                placeholderTextColor="#9CA3AF"
                returnKeyType="search"
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 14,
                  color: '#111827',
                  padding: 0,
                }}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity onPress={handleCancelSearch}>
              <Text
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 14,
                  color: '#1E2D4F',
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ flexDirection: 'row' }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabChange(tab.key)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 2,
                  borderBottomColor: isActive ? '#1E2D4F' : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: isActive ? 'Poppins_700Bold' : 'Poppins_500Medium',
                    fontSize: 15,
                    color: isActive ? '#1E2D4F' : '#9CA3AF',
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#1E2D4F" />
        </View>
      ) : fetchError ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ fontSize: 36 }}>😕</Text>
          <Text
            style={{
              marginTop: 8,
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 14,
              color: '#111827',
              textAlign: 'center',
            }}
          >
            {fetchError}
          </Text>
          <TouchableOpacity
            onPress={() => fetchOrders(activeTab)}
            style={{
              marginTop: 16,
              backgroundColor: '#F97316',
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 22,
            }}
          >
            <Text
              style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}
            >
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(activeTab, true)}
              colors={['#1E2D4F']}
              tintColor="#1E2D4F"
            />
          }
          ListHeaderComponent={<WarningBanner />}
          ListEmptyComponent={
            searchQuery.trim() ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 80,
                  paddingHorizontal: 40,
                }}
              >
                <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 18,
                    color: '#111827',
                    textAlign: 'center',
                    marginBottom: 8,
                  }}
                >
                  Tidak Ditemukan
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 14,
                    color: '#6B7280',
                    textAlign: 'center',
                    lineHeight: 20,
                  }}
                >
                  Tidak ada pesanan dengan kata kunci "{searchQuery}"
                </Text>
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={{
                    marginTop: 16,
                    borderWidth: 1.5,
                    borderColor: '#F97316',
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins_600SemiBold',
                      fontSize: 14,
                      color: '#F97316',
                    }}
                  >
                    Hapus Pencarian
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <EmptyState tab={activeTab} />
            )
          }
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={{
            paddingBottom: 100,
            flexGrow: filteredOrders.length === 0 ? 1 : undefined,
          }}
        />
      )}
    </View>
  );
}
