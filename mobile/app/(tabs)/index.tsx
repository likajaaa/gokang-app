import { useCallback, useEffect, useState } from 'react';
import { Keyboard, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import ArticlesSection from '../../components/home/ArticlesSection';
import CategoryCard from '../../components/home/CategoryCard';
import ConsultationCard from '../../components/home/ConsultationCard';
import InfoBanner from '../../components/home/InfoBanner';
import PromoBanner from '../../components/home/PromoBanner';
import SearchBar from '../../components/home/SearchBar';
import SearchResults from '../../components/home/SearchResults';
import SelectJagoanModal from '../../components/services/SelectJagoanModal';
import SelectSolutionModal from '../../components/services/SelectSolutionModal';
import { SEARCHABLE_SERVICES, type SearchResult } from '../../constants/searchableServices';
import { notificationsApi } from '../../services/api/notifications';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [refreshing, setRefreshing] = useState(false);
  const [showJagoanModal, setShowJagoanModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await notificationsApi.list();
      setUnreadCount(res.data.meta?.unread_count ?? 0);
    } catch (err: any) {
      console.warn('[Home] fetch unread count error:', err?.message);
    }
  }, [isLoggedIn]);

  // Refetch unread count saat tab home gain focus (e.g., balik dari notifications screen)
  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: fetch home data from API
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // Debounced search
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const results = SEARCHABLE_SERVICES.filter(
        (service) =>
          service.name.toLowerCase().includes(q) ||
          service.description.toLowerCase().includes(q),
      );
      setSearchResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const closeSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  }, []);

  const handleSearchResultPress = useCallback((item: SearchResult) => {
    closeSearch();

    switch (item.category) {
      case 'borongan':
        if (item.id === 'b1') {
          router.push('/booking/borongan-rumah');
        } else {
          router.push('/booking/borongan-bisnis');
        }
        break;

      case 'tukang_harian':
        router.push({
          pathname: '/booking/tukang-harian',
          params: {
            service_name: item.name,
          },
        });
        break;

      case 'perbaikan':
        router.push({
          pathname: '/booking/perbaikan-material',
          params: {
            service_name: item.name,
          },
        });
        break;
    }
  }, [closeSearch]);

  const isSearching = searchQuery.length > 0;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" translucent />

      {/* Sticky header */}
      <SearchBar
        notificationCount={unreadCount}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={closeSearch}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1E2D4F" />
        }
      >
        <InfoBanner />

        {/* Section: Borongan (Full Service) */}
        <View className="mt-6 px-4">
          <Text
            className="text-2xl text-text-primary"
            style={{ fontFamily: 'Poppins_800ExtraBold', lineHeight: 32 }}
          >
            Borongan (Full Service) 🏡
          </Text>
          <Text
            className="mt-1 text-sm text-text-secondary"
            style={{ fontFamily: 'Poppins_400Regular', lineHeight: 20 }}
          >
            Survey + Jasa + Material + Pengawasan
          </Text>

          <View className="mt-4 flex-row" style={{ gap: 12 }}>
            <CategoryCard
              title="Untuk Rumah"
              subtitle="Renovasi & perbaikan"
              colors={['#E5EAF2', '#FCA5A5']}
              emoji="🏠"
              onPress={() => router.push('/booking/borongan-rumah')}
            />
            <CategoryCard
              title="Untuk Bisnis"
              subtitle="Ruko, kantor, kafe"
              colors={['#DBEAFE', '#93C5FD']}
              emoji="🏢"
              onPress={() => router.push('/booking/borongan-bisnis')}
            />
          </View>
        </View>

        {/* Section: Tukang Harian */}
        <View className="mt-8 px-4">
          <Text
            className="text-2xl text-text-primary"
            style={{ fontFamily: 'Poppins_800ExtraBold', lineHeight: 32 }}
          >
            Tukang Harian 👷
          </Text>
          <Text
            className="mt-1 text-sm text-text-secondary"
            style={{ fontFamily: 'Poppins_400Regular', lineHeight: 20 }}
          >
            Pekerjaan kecil tanpa survey
          </Text>

          <View className="mt-4 flex-row" style={{ gap: 12 }}>
            <CategoryCard
              title="Pesan Tukang Saja"
              subtitle="Beli material sendiri"
              colors={['#D1FAE5', '#6EE7B7']}
              emoji="👷"
              onPress={() => setShowJagoanModal(true)}
            />
            <CategoryCard
              titleNode={
                <View>
                  <Text
                    className="text-text-primary"
                    style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, lineHeight: 18 }}
                  >
                    Layanan
                  </Text>
                  <Text
                    className="text-text-primary"
                    style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, lineHeight: 18 }}
                  >
                    Perbaikan
                  </Text>
                  <Text
                    className="text-primary"
                    style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, lineHeight: 18 }}
                  >
                    + Material
                  </Text>
                </View>
              }
              colors={['#FEF3C7', '#FDE68A']}
              emoji="🔧"
              onPress={() => setShowSolutionModal(true)}
            />
          </View>
        </View>

        {/* Promo Banner Slider */}
        <PromoBanner />

        {/* CS Consultation */}
        <ConsultationCard />

        {/* Articles Section */}
        <ArticlesSection />

        {/* Auth CTA — hanya tampil saat belum login */}
        {!isLoggedIn ? (
          <View className="mt-4 px-4 pb-6">
            <TouchableOpacity
              onPress={() => router.push('/welcome')}
              activeOpacity={0.85}
              className="items-center justify-center rounded-2xl bg-orange"
              style={{
                height: 56,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text
                className="text-base text-white"
                style={{ fontFamily: 'Poppins_600SemiBold' }}
              >
                Daftar Akun / Masuk
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      {/* Search overlay - sits above ScrollView, below SearchBar */}
      {isSearching ? (
        <>
          {/* Backdrop - tap outside to close */}
          <Pressable
            onPress={closeSearch}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.25)',
              zIndex: 50,
            }}
          />
          {/* Results dropdown - positioned just below SearchBar header */}
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              top: 100,
              left: 16,
              right: 16,
              zIndex: 60,
            }}
          >
            <SearchResults
              query={searchQuery}
              results={searchResults}
              onSelect={handleSearchResultPress}
            />
          </View>
        </>
      ) : null}

      <SelectJagoanModal
        visible={showJagoanModal}
        onClose={() => setShowJagoanModal(false)}
      />

      <SelectSolutionModal
        visible={showSolutionModal}
        onClose={() => setShowSolutionModal(false)}
      />
    </View>
  );
}
