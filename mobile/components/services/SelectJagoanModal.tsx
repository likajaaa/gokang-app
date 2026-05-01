import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Grid, List, Search, X } from 'lucide-react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { servicesApi, type Service } from '../../services/api/services';
import { getServiceWarning } from '../../constants/serviceWarnings';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const ICON_BG_PALETTE = [
  '#E5EAF2',
  '#DBEAFE',
  '#D1FAE5',
  '#FEF3C7',
  '#EDE9FE',
  '#FFE4E6',
  '#CFFAFE',
  '#FFEDD5',
];

const getServiceEmoji = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('cat')) return '🎨';
  if (n.includes('keramik')) return '🔶';
  if (n.includes('listrik perapihan')) return '🔌';
  if (n.includes('listrik')) return '⚡';
  if (n.includes('pipa perapihan')) return '🔧';
  if (n.includes('pipa')) return '💧';
  if (n.includes('batu')) return '🧱';
  if (n.includes('waterproof')) return '💧';
  if (n.includes('genteng')) return '🏠';
  if (n.includes('plafon')) return '📐';
  if (n.includes('sanitair')) return '🚽';
  if (n.includes('gali')) return '⛏️';
  if (n.includes('besi')) return '🔩';
  if (n.includes('angkat')) return '📦';
  if (n.includes('ac')) return '❄️';
  if (n.includes('aluminium')) return '🪟';
  if (n.includes('kenek')) return '👷';
  return '🔧';
};

export default function SelectJagoanModal({ visible, onClose }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [showWarning, setShowWarning] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const snapPoints = useMemo(() => (showWarning ? ['55%'] : ['90%']), [showWarning]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      console.log('[SelectJagoan] fetching /services ...');
      const res = await servicesApi.list();
      const list = res.data.data ?? [];
      console.log('[SelectJagoan] loaded', list.length, 'services');
      setServices(list);
    } catch (err: any) {
      const status = err.response?.status;
      const apiMsg = err.response?.data?.message;
      console.error('[SelectJagoan] fetch error:', status, apiMsg || err.message);
      setServices([]);
      if (!err.response) {
        setFetchError('Tidak bisa konek ke server. Cek koneksi atau backend belum jalan.');
      } else if (status === 500) {
        setFetchError('Server error. Database mungkin down — cek Laravel logs.');
      } else {
        setFetchError(apiMsg ?? 'Gagal memuat daftar jagoan.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    setShowWarning(false);
    setSelectedService(null);
    fetchServices();
  }, [visible, fetchServices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description?.toLowerCase().includes(q) ?? false),
    );
  }, [query, services]);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
    setShowWarning(true);
  };

  const handleCancelWarning = () => {
    setShowWarning(false);
    setSelectedService(null);
  };

  const handleContinue = () => {
    const service = selectedService;
    if (!service) return;
    onClose();
    setTimeout(() => {
      router.push({
        pathname: '/booking/tukang-harian',
        params: {
          service_id: String(service.id),
          service_name: service.name,
          service_icon: service.icon_url ?? '',
          price_full_day: String(service.pricing.full_day),
        },
      });
    }, 100);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  const handleSheetClose = useCallback(() => {
    setShowWarning(false);
    setSelectedService(null);
    onClose();
  }, [onClose]);

  const renderListItem = ({ item, index }: { item: Service; index: number }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: ICON_BG_PALETTE[index % ICON_BG_PALETTE.length],
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14,
        }}
      >
        {item.icon_url ? (
          <Image source={{ uri: item.icon_url }} style={{ width: 34, height: 34 }} />
        ) : (
          <Text style={{ fontSize: 28 }}>{getServiceEmoji(item.name)}</Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: '#111827' }}
        >
          {item.name}
        </Text>
        {item.description ? (
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 12,
              color: '#6B7280',
              marginTop: 2,
              lineHeight: 16,
            }}
          >
            {item.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item, index }: { item: Service; index: number }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
      style={{
        width: '23%',
        aspectRatio: 0.9,
        margin: '1%',
        borderRadius: 14,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: ICON_BG_PALETTE[index % ICON_BG_PALETTE.length],
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6,
        }}
      >
        {item.icon_url ? (
          <Image source={{ uri: item.icon_url }} style={{ width: 30, height: 30 }} />
        ) : (
          <Text style={{ fontSize: 22 }}>{getServiceEmoji(item.name)}</Text>
        )}
      </View>
      <Text
        numberOfLines={2}
        style={{
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 10,
          textAlign: 'center',
          lineHeight: 13,
          color: '#111827',
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleSheetClose}
      backdropComponent={renderBackdrop}
    >
      {showWarning ? (
        <BottomSheetView style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ position: 'relative', width: 200, height: 180 }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 30,
                    left: 12,
                    width: 80,
                    height: 48,
                    backgroundColor: '#E0F2FE',
                    borderRadius: 40,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 40,
                    right: 14,
                    width: 100,
                    height: 56,
                    backgroundColor: '#FEF3C7',
                    borderRadius: 50,
                  }}
                />

                <View
                  style={{
                    position: 'absolute',
                    top: 30,
                    left: '50%',
                    marginLeft: -56,
                    width: 112,
                    height: 150,
                    backgroundColor: '#111827',
                    borderRadius: 20,
                    borderWidth: 4,
                    borderColor: '#111827',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#E5EAF2',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 64 }}>👷</Text>
                  </View>
                </View>

                <View
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 18,
                    width: 64,
                    height: 64,
                    backgroundColor: '#FB923C',
                    borderRadius: 32,
                    borderWidth: 5,
                    borderColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 36,
                      color: 'white',
                      fontFamily: 'Poppins_800ExtraBold',
                      lineHeight: 40,
                    }}
                  >
                    !
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
                color: '#111827',
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              {selectedService?.name ?? ''}
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: '#6B7280',
                textAlign: 'center',
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              {getServiceWarning(selectedService?.name ?? '')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 24 }}>
              <TouchableOpacity
                onPress={handleCancelWarning}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: '#1E2D4F',
                  borderRadius: 28,
                  paddingVertical: 14,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins_600SemiBold',
                    fontSize: 15,
                    color: '#1E2D4F',
                  }}
                >
                  Batalkan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleContinue}
                style={{
                  flex: 1,
                  backgroundColor: '#F97316',
                  borderRadius: 28,
                  paddingVertical: 14,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins_600SemiBold',
                    fontSize: 15,
                    color: 'white',
                  }}
                >
                  Lanjutkan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      ) : (
        <BottomSheetFlatList
          key={viewMode}
          data={loading || fetchError ? [] : filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={viewMode === 'list' ? renderListItem : renderGridItem}
          numColumns={viewMode === 'grid' ? 4 : 1}
          contentContainerStyle={{
            paddingBottom: 24,
            paddingHorizontal: viewMode === 'grid' ? 8 : 0,
            flexGrow: 1,
            backgroundColor: 'white',
          }}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 16,
                paddingTop: 4,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
              }}
            >
              {/* Close button row */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 }}>
                <TouchableOpacity
                  onPress={handleSheetClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ padding: 4 }}
                >
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_800ExtraBold',
                      fontSize: 22,
                      color: '#111827',
                      lineHeight: 28,
                    }}
                  >
                    Pesan Tukang Langsung! 👷
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 13,
                      color: '#6B7280',
                      marginTop: 4,
                      lineHeight: 18,
                    }}
                  >
                    Pilih Tukang Jagoan yang cocok untuk kebutuhan pekerjaan di rumahmu
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <TouchableOpacity
                    onPress={() => setViewMode('list')}
                    style={{ padding: 8 }}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <List size={22} color={viewMode === 'list' ? '#1E2D4F' : '#9CA3AF'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setViewMode('grid')}
                    style={{ padding: 8 }}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Grid size={22} color={viewMode === 'grid' ? '#1E2D4F' : '#9CA3AF'} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#F9FAFB',
                  borderRadius: 24,
                  paddingHorizontal: 14,
                  marginTop: 14,
                  height: 46,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Search size={18} color="#9CA3AF" />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Cari Tukang Langsung"
                  placeholderTextColor="#9CA3AF"
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 14,
                    color: '#111827',
                    padding: 0,
                  }}
                />
              </View>
            </View>
          }
          ListEmptyComponent={
            loading ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', color: '#9CA3AF' }}>
                  Loading...
                </Text>
              </View>
            ) : fetchError ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 32,
                  paddingTop: 40,
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
                  onPress={fetchServices}
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
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                <Text style={{ fontSize: 36 }}>🔍</Text>
                <Text
                  style={{
                    marginTop: 8,
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 14,
                    color: '#6B7280',
                  }}
                >
                  {query.trim() ? 'Jagoan tidak ditemukan' : 'Belum ada jagoan tersedia'}
                </Text>
              </View>
            )
          }
        />
      )}
    </BottomSheet>
  );
}
