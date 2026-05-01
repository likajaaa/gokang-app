import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Building,
  Camera,
  ChevronRight,
  Clock,
  MapPin,
  Megaphone,
  Ticket,
  Wallet,
  Wrench,
  X,
} from 'lucide-react-native';
import { ordersApi } from '../../services/api/orders';
import { convertImagesToBase64 } from '../../utils/imageHelpers';
import MapPickerScreen, { type SelectedAddress } from './components/MapPickerScreen';
import DatePickerScreen from './components/DatePickerScreen';

console.log('[BookingBisnis] borongan-bisnis.tsx module loaded');

const REFERRAL_OPTIONS = [
  'Rekomendasi Teman/Keluarga',
  'Instagram',
  'TikTok',
  'Iklan Online',
  'Pencarian Google',
  'Website',
];

const BUDGET_OPTIONS = [
  '< Rp 10 juta',
  'Rp 10 juta - Rp 50 juta',
  'Rp 50 juta - Rp 100 juta',
  'Rp 100 juta - Rp 500 juta',
  '> Rp 500 juta',
  'Belum tahu (konsultasi dulu)',
];

const BRANCH_COUNT_OPTIONS = [
  '1 cabang',
  '2-5 cabang',
  '6-10 cabang',
  '11-20 cabang',
  'Lebih dari 20 cabang',
];

const BUSINESS_BUILDING_TYPES = [
  'Kantor',
  'Ruko',
  'Mall/Pusat Perbelanjaan',
  'Hotel/Penginapan',
  'Pabrik/Gudang',
  'Restoran/Kafe',
  'Lainnya',
];

export default function BookingBoronganBisnisScreen() {
  console.log('[BookingBisnis] render');

  // ── Form state ────────────────────────────────────────────────
  const [photos, setPhotos] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [surveyDate, setSurveyDate] = useState<Date | null>(null);
  const [surveyTime, setSurveyTime] = useState<string | null>(null);
  const [budget, setBudget] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [referralSources, setReferralSources] = useState<string[]>([]);
  const [workDescription, setWorkDescription] = useState('');

  // Business-specific state
  const [businessName, setBusinessName] = useState('');
  const [branchCount, setBranchCount] = useState('');
  const [businessBuildingType, setBusinessBuildingType] = useState('');

  // Modal state
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showBuildingTypeModal, setShowBuildingTypeModal] = useState(false);
  const [tempReferral, setTempReferral] = useState<string[]>([]);
  const [tempReferralOther, setTempReferralOther] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Photo picker ──────────────────────────────────────────────
  const pickFromGallery = async () => {
    if (photos.length >= 10) {
      Alert.alert('Maksimal Foto', 'Maksimal 10 foto');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10 - photos.length,
    });
    if (!result.canceled) {
      setPhotos([...photos, ...result.assets.map((a) => a.uri)]);
    }
  };

  const openCamera = async () => {
    if (photos.length >= 10) {
      Alert.alert('Maksimal Foto', 'Maksimal 10 foto');
      return;
    }
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin Diperlukan', 'Izinkan akses kamera');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.5,
        exif: false,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        const uri = result.assets[0].uri;
        setPhotos((prev) => [...prev, uri]);
      }
    } catch (err: any) {
      console.error('[Camera] launch error:', err?.message);
      Alert.alert('Gagal Membuka Kamera', err?.message ?? 'Coba lagi sebentar');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // ── Date/time handlers ────────────────────────────────────────
  const handleConfirmDateTime = (date: Date, time: string) => {
    setSurveyDate(date);
    setSurveyTime(time);
    setShowDatePicker(false);
  };

  const formatDateTime = (d: Date, time: string | null) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const timeStr = time ?? `${hh}:${mm}`;
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} • ${timeStr} WIB`;
  };

  // ── Referral modal ────────────────────────────────────────────
  const openReferralModal = () => {
    const cleanOptions = referralSources.filter((s) => !s.startsWith('Lainnya: '));
    const other = referralSources.find((s) => s.startsWith('Lainnya: '));
    setTempReferral(cleanOptions);
    setTempReferralOther(other ? other.slice('Lainnya: '.length) : '');
    setShowReferralModal(true);
  };

  const toggleReferral = (option: string) => {
    setTempReferral((prev) =>
      prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option],
    );
  };

  const saveReferral = () => {
    const final = [...tempReferral];
    const trimmed = tempReferralOther.trim();
    if (trimmed) final.push(`Lainnya: ${trimmed}`);
    setReferralSources(final);
    setShowReferralModal(false);
  };

  // ── Address handler ───────────────────────────────────────────
  const handleSelectAddress = (data: SelectedAddress) => {
    setAddress(data.fullAddress);
    setAddressDetail(data.addressDetail ?? '');
    setLatitude(data.latitude);
    setLongitude(data.longitude);
    setShowAddressPicker(false);
  };

  // ── Validation + submit ───────────────────────────────────────
  const isFormValid =
    photos.length > 0 &&
    address.length > 0 &&
    surveyDate !== null &&
    budget.length > 0 &&
    referralSources.length > 0 &&
    businessName.trim().length > 0 &&
    branchCount.length > 0 &&
    businessBuildingType.length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('Form Tidak Lengkap', 'Mohon isi semua field yang wajib (*)');
      return;
    }

    setSubmitting(true);
    try {
      console.log('[BookingBisnis] Converting', photos.length, 'photo(s) to base64...');
      const photosBase64 = await convertImagesToBase64(photos);

      const payload = {
        photos: photosBase64,
        address,
        address_detail: addressDetail.trim() || undefined,
        latitude,
        longitude,
        survey_scheduled_at: surveyDate!.toISOString(),
        budget,
        promo_code: promoCode.trim() || null,
        referral_sources: referralSources,
        business_name: businessName.trim(),
        branch_count: branchCount,
        building_type: businessBuildingType,
        description: workDescription || undefined,
      };

      console.log('[BookingBisnis] POST /booking/borongan/bisnis', {
        ...payload,
        photos: `[${payload.photos.length} base64 images]`,
      });

      const response = await ordersApi.createBoronganBisnis(payload);
      console.log('[BookingBisnis] API response:', response.data);

      const data = response.data.data;
      Alert.alert(
        'Pesanan Berhasil! 🎉',
        `Kode pesanan: ${data.order_code}\nTotal: Rp ${data.total_amount.toLocaleString('id-ID')}\n\nPesanan tersimpan di tab Rencana. Lakukan pembayaran kapan saja untuk melanjutkan.`,
        [
          {
            text: 'Lihat Pesanan',
            onPress: () => router.replace('/(tabs)/orders'),
          },
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (err: any) {
      console.error('[BookingBisnis] Submit error:', err.response?.data || err.message);
      const status = err.response?.status;
      const apiMessage = err.response?.data?.message;
      const errors = err.response?.data?.errors;

      let message = apiMessage ?? 'Gagal membuat order. Coba lagi.';
      if (status === 422 && errors) {
        const lines = Object.values(errors).map((arr) => (Array.isArray(arr) ? arr[0] : arr));
        message = lines.join('\n');
      } else if (status === 401) {
        message = 'Sesi habis. Silakan login ulang.';
      } else if (!err.response) {
        message = 'Tidak bisa connect ke server. Cek koneksi atau backend.';
      }
      Alert.alert('Gagal Membuat Order', message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 48,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 8, alignSelf: 'flex-start' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: '#111827' }}>
          Butuh Jasa Tukang + Material?
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
            color: '#6B7280',
            marginTop: 4,
          }}
        >
          GoKang solusi tepat untuk bisnismu!
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* 1. Tahu GoKang dari mana */}
        <View style={{ marginTop: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Megaphone size={20} color="#1E2D4F" />
            <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
              Tahu GoKang dari mana?<Text style={{ color: '#1E2D4F' }}> *</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={openReferralModal}
            style={{
              borderWidth: 2,
              borderColor: referralSources.length > 0 ? '#1E2D4F' : '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                flex: 1,
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: referralSources.length > 0 ? '#111827' : '#9CA3AF',
              }}
            >
              {referralSources.length > 0 ? referralSources.join(', ') : 'Pilih sumber informasi'}
            </Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* 2. Informasi Bisnis */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Building size={20} color="#1E2D4F" />
            <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
              Informasi Bisnis<Text style={{ color: '#1E2D4F' }}> *</Text>
            </Text>
          </View>

          {/* Nama Usaha */}
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, marginBottom: 6 }}>
            Nama Usaha<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
          <TextInput
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Contoh: PT Maju Jaya"
            placeholderTextColor="#9CA3AF"
            maxLength={100}
            style={{
              borderWidth: 2,
              borderColor: businessName.trim() ? '#1E2D4F' : '#D1D5DB',
              borderRadius: 12,
              padding: 14,
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              marginBottom: 14,
            }}
          />

          {/* Jumlah Cabang */}
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, marginBottom: 6 }}>
            Jumlah Cabang<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowBranchModal(true)}
            style={{
              borderWidth: 2,
              borderColor: branchCount ? '#1E2D4F' : '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: branchCount ? '#111827' : '#9CA3AF',
              }}
            >
              {branchCount || 'Pilih jumlah cabang'}
            </Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Jenis Bangunan */}
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, marginBottom: 6 }}>
            Jenis Bangunan<Text style={{ color: '#1E2D4F' }}> *</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowBuildingTypeModal(true)}
            style={{
              borderWidth: 2,
              borderColor: businessBuildingType ? '#1E2D4F' : '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: businessBuildingType ? '#111827' : '#9CA3AF',
              }}
            >
              {businessBuildingType || 'Pilih jenis bangunan'}
            </Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* 3. Deskripsi Pekerjaan */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Wrench size={20} color="#1E2D4F" />
            <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
              Perbaikan/pekerjaan yang dibutuhkan
            </Text>
          </View>
          <TextInput
            value={workDescription}
            onChangeText={setWorkDescription}
            placeholder="Isi dengan jelas"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            style={{
              borderWidth: 2,
              borderColor: '#D1D5DB',
              borderRadius: 12,
              padding: 14,
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              minHeight: 110,
              textAlignVertical: 'top',
            }}
          />
          <Text
            style={{
              textAlign: 'right',
              color: '#9CA3AF',
              fontSize: 12,
              marginTop: 4,
              fontFamily: 'Poppins_400Regular',
            }}
          >
            {workDescription.length}/500
          </Text>
        </View>

        {/* 4. Upload Foto */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Camera size={20} color="#1E2D4F" />
            <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
              Masukkan Foto Masalah<Text style={{ color: '#1E2D4F' }}> *</Text>
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 12,
              color: '#9CA3AF',
              fontStyle: 'italic',
              marginBottom: 12,
            }}
          >
            Maksimal foto diupload adalah 10 foto
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <TouchableOpacity
              onPress={pickFromGallery}
              style={{
                flex: 1,
                borderWidth: 1.5,
                borderColor: '#F97316',
                borderRadius: 22,
                paddingVertical: 11,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={18} color="#F97316" />
              <Text
                style={{
                  marginLeft: 8,
                  color: '#F97316',
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 13,
                }}
              >
                Pilih dari galeri
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openCamera}
              style={{
                flex: 1,
                borderWidth: 1.5,
                borderColor: '#F97316',
                borderRadius: 22,
                paddingVertical: 11,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={18} color="#F97316" />
              <Text
                style={{
                  marginLeft: 8,
                  color: '#F97316',
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 13,
                }}
              >
                Buka kamera
              </Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {photos.map((uri, i) => (
                <View key={`${uri}-${i}`} style={{ position: 'relative' }}>
                  <Image source={{ uri }} style={{ width: 92, height: 92, borderRadius: 10 }} />
                  <TouchableOpacity
                    onPress={() => removePhoto(i)}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: '#F97316',
                      borderWidth: 1.5,
                      borderColor: '#FFFFFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 5. Alamat Pekerjaan */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MapPin size={20} color="#1E2D4F" />
            <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
              Alamat Pekerjaan<Text style={{ color: '#1E2D4F' }}> *</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddressPicker(true)}
            style={{
              borderWidth: 1.5,
              borderColor: address ? '#1E2D4F' : '#E5E7EB',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>📍</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 12,
                  color: '#9CA3AF',
                  marginBottom: 2,
                }}
              >
                Alamat Pekerjaan *
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: address ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                  fontSize: 15,
                  color: address ? '#111827' : '#9CA3AF',
                }}
              >
                {address || 'Masukan alamat pengerjaan'}
              </Text>
            </View>
            {address ? (
              <Text style={{ color: '#16A34A', fontSize: 18 }}>✓</Text>
            ) : (
              <ChevronRight size={20} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        </View>

        {/* 6. Tanggal & Waktu Survey */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Clock size={20} color="#1E2D4F" />
            <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
              Tanggal & Waktu Survey<Text style={{ color: '#1E2D4F' }}> *</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              borderWidth: 1.5,
              borderColor: surveyDate ? '#1E2D4F' : '#E5E7EB',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>📅</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 12,
                  color: '#9CA3AF',
                  marginBottom: 2,
                }}
              >
                Tanggal & Waktu Survey *
              </Text>
              <Text
                style={{
                  fontFamily: surveyDate ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                  fontSize: 15,
                  color: surveyDate ? '#111827' : '#9CA3AF',
                }}
              >
                {surveyDate
                  ? formatDateTime(surveyDate, surveyTime)
                  : 'Pilih tanggal dan waktu survey'}
              </Text>
            </View>
            {surveyDate ? (
              <Text style={{ color: '#16A34A', fontSize: 18 }}>✓</Text>
            ) : (
              <ChevronRight size={20} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        </View>

        {/* 7. Budget */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Wallet size={20} color="#1E2D4F" />
            <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
              Budget yang kamu siapkan<Text style={{ color: '#1E2D4F' }}> *</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowBudgetModal(true)}
            style={{
              borderWidth: 2,
              borderColor: budget ? '#1E2D4F' : '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: budget ? '#111827' : '#9CA3AF',
              }}
            >
              {budget || 'Pilih budget'}
            </Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* 8. Kode Pesanan */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ticket size={20} color="#1E2D4F" />
            <Text style={{ marginLeft: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
              Kode Pesanan
            </Text>
          </View>
          <TextInput
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Masukkan kode pesanan bila ada"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            style={{
              borderWidth: 2,
              borderColor: '#D1D5DB',
              borderRadius: 12,
              padding: 14,
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
            }}
          />
        </View>

        {/* 9. Promo Banner */}
        <View
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#FAFAFA',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15 }}>Promo Survey 60%</Text>
            <Text style={{ fontSize: 18 }}>✅</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#9CA3AF',
                textDecorationLine: 'line-through',
                marginRight: 8,
              }}
            >
              Rp250.000
            </Text>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: '#1E2D4F' }}>
              Rp100.000
            </Text>
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, marginBottom: 6 }}>
            Termasuk:
          </Text>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>
            ✅ Diskusi dengan ahli bangunan
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 12,
              color: '#6B7280',
              marginBottom: 10,
            }}
          >
            ✅ Penawaran pekerjaan dengan harga terbaik
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 11,
              color: '#6B7280',
              fontStyle: 'italic',
            }}
          >
            ⛔ Harap menyiapkan tanggal, karena konsultan tidak membawa tanggal saat survey
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: 24,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isFormValid || submitting}
          style={{
            backgroundColor: isFormValid && !submitting ? '#1E2D4F' : '#D1D5DB',
            paddingVertical: 16,
            borderRadius: 28,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: isFormValid && !submitting ? 'white' : '#9CA3AF',
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
            }}
          >
            {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Referral Modal ─────────────────────────────────────────── */}
      <Modal
        visible={showReferralModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReferralModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              maxHeight: '75%',
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, marginBottom: 6 }}>
              Tahu GoKang dari mana?
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                color: '#6B7280',
                marginBottom: 12,
              }}
            >
              Pilih satu atau lebih (multiple choice)
            </Text>

            <ScrollView style={{ maxHeight: 380 }}>
              {REFERRAL_OPTIONS.map((option) => {
                const isSelected = tempReferral.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleReferral(option)}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F3F4F6',
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        paddingRight: 8,
                      }}
                    >
                      {option}
                    </Text>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: isSelected ? '#1E2D4F' : '#D1D5DB',
                        backgroundColor: isSelected ? '#1E2D4F' : 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={{ paddingVertical: 14 }}>
                <Text
                  style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, marginBottom: 8 }}
                >
                  Lainnya
                </Text>
                <TextInput
                  value={tempReferralOther}
                  onChangeText={setTempReferralOther}
                  placeholder="Tuliskan sumber lainnya..."
                  placeholderTextColor="#9CA3AF"
                  style={{
                    borderWidth: 1.5,
                    borderColor: '#D1D5DB',
                    borderRadius: 12,
                    padding: 12,
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 14,
                  }}
                />
              </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => setShowReferralModal(false)}
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: '#D1D5DB',
                  borderRadius: 24,
                  paddingVertical: 13,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#6B7280', fontSize: 14 }}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveReferral}
                style={{
                  flex: 1,
                  backgroundColor: '#F97316',
                  borderRadius: 24,
                  paddingVertical: 13,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontFamily: 'Poppins_700Bold', fontSize: 14 }}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Address Picker (full-screen) ───────────────────────────── */}
      <Modal
        visible={showAddressPicker}
        animationType="slide"
        onRequestClose={() => setShowAddressPicker(false)}
      >
        <MapPickerScreen
          onSelect={handleSelectAddress}
          onClose={() => setShowAddressPicker(false)}
          initialAddress={address}
          initialDetail={addressDetail}
          initialLatitude={latitude}
          initialLongitude={longitude}
        />
      </Modal>

      {/* ── Date & Time Picker (full-screen) ──────────────────────── */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <DatePickerScreen
          title="Tanggal & Waktu Survey"
          dateLabel="Tanggal Survey"
          timeLabel="Waktu Survey"
          buttonLabel="Pilih Tanggal & Waktu"
          onConfirm={handleConfirmDateTime}
          onClose={() => setShowDatePicker(false)}
        />
      </Modal>

      {/* ── Budget Modal ───────────────────────────────────────────── */}
      <Modal
        visible={showBudgetModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBudgetModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, marginBottom: 16 }}>
              Pilih Budget
            </Text>
            {BUDGET_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setBudget(option);
                  setShowBudgetModal(false);
                }}
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 15,
                    color: budget === option ? '#1E2D4F' : '#111827',
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ── Branch Count Modal ─────────────────────────────────────── */}
      <Modal
        visible={showBranchModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBranchModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, marginBottom: 16 }}>
              Pilih Jumlah Cabang
            </Text>
            {BRANCH_COUNT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setBranchCount(option);
                  setShowBranchModal(false);
                }}
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 15,
                    color: branchCount === option ? '#1E2D4F' : '#111827',
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ── Business Building Type Modal ───────────────────────────── */}
      <Modal
        visible={showBuildingTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBuildingTypeModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, marginBottom: 16 }}>
              Pilih Jenis Bangunan
            </Text>
            {BUSINESS_BUILDING_TYPES.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setBusinessBuildingType(option);
                  setShowBuildingTypeModal(false);
                }}
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 15,
                    color: businessBuildingType === option ? '#1E2D4F' : '#111827',
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

    </View>
  );
}
