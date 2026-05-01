import { ArrowLeft, Locate, MapPin, Pencil, Search, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import * as Location from 'expo-location';

const DEFAULT_COORDS = {
  latitude: -6.2088,
  longitude: 106.8456,
};

export type SelectedAddress = {
  fullAddress: string;
  addressDetail?: string;
  latitude: number;
  longitude: number;
};

type Suggestion = {
  id: string;
  mainText: string;
  secondaryText: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
};

const getMockSuggestions = (query: string): Suggestion[] => {
  if (!query.trim() || query.length < 3) return [];
  const jitter = () => (Math.random() - 0.5) * 0.05;
  return [
    {
      id: '1',
      mainText: `Jl. ${query}`,
      secondaryText: 'Jakarta Pusat, DKI Jakarta',
      fullAddress: `Jl. ${query}, Jakarta Pusat, DKI Jakarta`,
      latitude: -6.1944 + jitter(),
      longitude: 106.8229 + jitter(),
    },
    {
      id: '2',
      mainText: `Jl. ${query} Raya`,
      secondaryText: 'Jakarta Selatan, DKI Jakarta',
      fullAddress: `Jl. ${query} Raya, Jakarta Selatan, DKI Jakarta`,
      latitude: -6.2615 + jitter(),
      longitude: 106.8106 + jitter(),
    },
    {
      id: '3',
      mainText: `${query}`,
      secondaryText: 'Tangerang, Banten',
      fullAddress: `${query}, Tangerang, Banten`,
      latitude: -6.1781 + jitter(),
      longitude: 106.6297 + jitter(),
    },
    {
      id: '4',
      mainText: `Perumahan ${query}`,
      secondaryText: 'Bekasi, Jawa Barat',
      fullAddress: `Perumahan ${query}, Bekasi, Jawa Barat`,
      latitude: -6.2349 + jitter(),
      longitude: 106.9896 + jitter(),
    },
  ];
};

// HTML Leaflet — gunakan template literal, lat/lng di-inject saat render awal
const buildLeafletHtml = (lat: number, lng: number) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #F5F5F5; }
    .red-pin {
      width: 36px;
      height: 36px;
      background: #1E2D4F;
      border: 3px solid #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      position: relative;
    }
    .red-pin svg { width: 20px; height: 20px; fill: white; }
    .red-pin::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 10px solid #1E2D4F;
    }
    .leaflet-container { background: #F5F5F5; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var initialLat = ${lat};
    var initialLng = ${lng};

    var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([initialLat, initialLng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    var redIcon = L.divIcon({
      className: 'gokang-pin',
      html: '<div class="red-pin"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg></div>',
      iconSize: [42, 52],
      iconAnchor: [21, 46],
    });

    var marker = L.marker([initialLat, initialLng], { draggable: true, icon: redIcon }).addTo(map);

    function postCoords(lat, lng) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'coords', lat: lat, lng: lng }));
      }
    }

    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      postCoords(e.latlng.lat, e.latlng.lng);
    });

    marker.on('dragend', function(e) {
      var pos = e.target.getLatLng();
      postCoords(pos.lat, pos.lng);
    });

    // RN -> WebView: pindah view & marker
    window.gokangSetView = function(lat, lng) {
      map.setView([lat, lng], 16, { animate: true, duration: 0.6 });
      marker.setLatLng([lat, lng]);
    };

    // Notify RN ready
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
    }
  </script>
</body>
</html>`;

type Props = {
  onSelect: (data: SelectedAddress) => void;
  onClose: () => void;
  initialAddress?: string;
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  initialDetail?: string;
};

export default function MapPickerScreen({
  onSelect,
  onClose,
  initialAddress,
  initialLatitude,
  initialLongitude,
  initialDetail,
}: Props) {
  const webViewRef = useRef<WebView>(null);

  const [coords, setCoords] = useState({
    latitude: initialLatitude ?? DEFAULT_COORDS.latitude,
    longitude: initialLongitude ?? DEFAULT_COORDS.longitude,
  });
  const [mainText, setMainText] = useState(
    initialAddress ? initialAddress.split(',')[0].trim() : 'Lokasi Terpilih',
  );
  const [fullAddress, setFullAddress] = useState(initialAddress || 'Memuat alamat...');
  const [detail, setDetail] = useState(initialDetail || '');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [webViewReady, setWebViewReady] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // HTML hanya di-build sekali — perubahan koordinat dikirim via injectJavaScript
  const html = useMemo(
    () => buildLeafletHtml(coords.latitude, coords.longitude),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Mount: GPS atau pakai initial coords
  useEffect(() => {
    if (initialLatitude && initialLongitude) {
      void reverseGeocode(initialLatitude, initialLongitude);
      setLoadingLocation(false);
      return;
    }
    void getUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    setSearchLoading(true);
    const timer = setTimeout(() => {
      setSuggestions(getMockSuggestions(searchQuery));
      setSearchLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const animateMapTo = (latitude: number, longitude: number) => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript(
      `if (window.gokangSetView) window.gokangSetView(${latitude}, ${longitude}); true;`,
    );
  };

  const getUserLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Lokasi', 'Izinkan akses lokasi untuk mendeteksi posisi kamu.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      setCoords({ latitude, longitude });
      if (webViewReady) {
        animateMapTo(latitude, longitude);
      }
      await reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('GPS error:', error);
      setFullAddress('Tidak dapat mendeteksi lokasi');
    } finally {
      setLoadingLocation(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      setLoadingAddress(true);
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const place = geocode[0];
        const main = place.name || place.street || place.district || 'Lokasi terpilih';
        const parts = [
          place.street,
          place.district,
          place.subregion,
          place.city,
          place.region,
          place.postalCode,
        ].filter(Boolean);
        setMainText(main);
        setFullAddress(parts.join(', ') || main);
      } else {
        setMainText('Lokasi tanpa nama');
        setFullAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      }
    } catch (error) {
      console.error('Geocode error:', error);
      setFullAddress('Gagal memuat alamat');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        setWebViewReady(true);
        // Sync awal kalau sudah punya GPS coords sebelum WebView ready
        animateMapTo(coords.latitude, coords.longitude);
        return;
      }
      if (data.type === 'coords' && typeof data.lat === 'number' && typeof data.lng === 'number') {
        setCoords({ latitude: data.lat, longitude: data.lng });
        void reverseGeocode(data.lat, data.lng);
      }
    } catch (e) {
      console.warn('WebView message parse error', e);
    }
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    setCoords({ latitude: s.latitude, longitude: s.longitude });
    setMainText(s.mainText);
    setFullAddress(s.fullAddress);
    animateMapTo(s.latitude, s.longitude);
    setShowSearch(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSimpan = () => {
    if (loadingAddress) {
      Alert.alert('Tunggu sebentar', 'Alamat masih dimuat. Coba lagi sebentar.');
      return;
    }
    if (
      !fullAddress ||
      fullAddress === 'Memuat alamat...' ||
      fullAddress === 'Tidak dapat mendeteksi lokasi' ||
      fullAddress === 'Gagal memuat alamat'
    ) {
      Alert.alert(
        'Alamat tidak tersedia',
        'Pindahkan pin atau cari alamat manual untuk melanjutkan.',
      );
      return;
    }
    onSelect({
      fullAddress,
      addressDetail: detail.trim() || undefined,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  // ─── SEARCH MODE ──────────────────────────────────────────────────
  if (showSearch) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle="dark-content" />

        <View
          style={{
            paddingTop: 52,
            paddingHorizontal: 16,
            paddingBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowSearch(false);
              setSearchQuery('');
              setSuggestions([]);
            }}
            style={{ padding: 4 }}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: 28,
              paddingHorizontal: 14,
              paddingVertical: 10,
              gap: 8,
            }}
          >
            <Search size={18} color="#9CA3AF" />
            <TextInput
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari lokasi pengerjaan..."
              placeholderTextColor="#9CA3AF"
              style={{
                flex: 1,
                fontFamily: 'Poppins_400Regular',
                fontSize: 15,
                color: '#111827',
                padding: 0,
              }}
            />
            {searchLoading && <ActivityIndicator size="small" color="#1E2D4F" />}
            {searchQuery.length > 0 && !searchLoading && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {suggestions.length > 0 ? (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectSuggestion(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F9FAFB',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#E5EAF2',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={20} color="#1E2D4F" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_600SemiBold',
                      fontSize: 15,
                      color: '#111827',
                      marginBottom: 2,
                    }}
                  >
                    {item.mainText}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 13,
                      color: '#6B7280',
                    }}
                  >
                    {item.secondaryText}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>🔍</Text>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 16,
                color: '#111827',
                marginBottom: 6,
              }}
            >
              {searchQuery.length === 0
                ? 'Cari Alamat'
                : searchQuery.length < 3
                  ? 'Ketik minimal 3 karakter'
                  : 'Tidak ada hasil'}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#6B7280',
                textAlign: 'center',
                paddingHorizontal: 40,
              }}
            >
              {searchQuery.length === 0
                ? 'Ketik nama jalan, kelurahan, atau patokan'
                : searchQuery.length < 3
                  ? 'Lanjutkan ketik untuk mencari'
                  : 'Coba kata kunci lain'}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // ─── MAP MODE ─────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />

      {/* MAP CONTAINER (flex 1) */}
      <View style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{ html }}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleWebViewMessage}
          style={{ flex: 1, backgroundColor: '#F5F5F5' }}
        />

        {/* TOP OVERLAY: back + search */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            paddingTop: 52,
            paddingHorizontal: 16,
            paddingBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <ArrowLeft size={22} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowSearch(true)}
            activeOpacity={0.9}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 28,
              paddingHorizontal: 16,
              paddingVertical: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
              gap: 10,
            }}
          >
            <Search size={18} color="#9CA3AF" />
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: '#9CA3AF',
              }}
            >
              Cari Alamat
            </Text>
          </TouchableOpacity>
        </View>

        {/* GPS BUTTON */}
        <TouchableOpacity
          onPress={getUserLocation}
          disabled={loadingLocation}
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          {loadingLocation ? (
            <ActivityIndicator size="small" color="#1E2D4F" />
          ) : (
            <Locate size={22} color="#1E2D4F" />
          )}
        </TouchableOpacity>
      </View>

      {/* BOTTOM SHEET CARD */}
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 28,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Text
          style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 16,
            color: '#111827',
            marginBottom: 12,
          }}
        >
          Lokasi Terpilih
        </Text>

        {/* Address card */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            padding: 14,
            gap: 12,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#E5EAF2',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={18} color="#1E2D4F" />
          </View>

          <View style={{ flex: 1 }}>
            {loadingAddress ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingVertical: 6,
                }}
              >
                <ActivityIndicator size="small" color="#1E2D4F" />
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 13,
                    color: '#9CA3AF',
                  }}
                >
                  Memuat alamat...
                </Text>
              </View>
            ) : (
              <>
                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 15,
                    color: '#111827',
                    marginBottom: 2,
                  }}
                  numberOfLines={1}
                >
                  {mainText}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 12,
                    color: '#6B7280',
                    lineHeight: 18,
                  }}
                  numberOfLines={3}
                >
                  {fullAddress}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Detail input label */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 14,
              color: '#111827',
            }}
          >
            Detail Alamat/Patokan
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: '#9CA3AF',
            }}
          >
            Opsional
          </Text>
        </View>

        {/* Detail input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: 16,
            gap: 8,
          }}
        >
          <TextInput
            value={detail}
            onChangeText={setDetail}
            placeholder="Masukkan detail alamat/patokan"
            placeholderTextColor="#9CA3AF"
            multiline
            style={{
              flex: 1,
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              color: '#111827',
              padding: 0,
              maxHeight: 80,
            }}
          />
          <Pencil size={16} color="#9CA3AF" />
        </View>

        {/* Simpan button */}
        <TouchableOpacity
          onPress={handleSimpan}
          disabled={loadingAddress}
          style={{
            backgroundColor: loadingAddress ? '#D1D5DB' : '#1E2D4F',
            borderRadius: 28,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
              color: 'white',
            }}
          >
            Simpan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
